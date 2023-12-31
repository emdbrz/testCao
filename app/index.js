const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { authenticate } = require("./middleware");
require("dotenv").config();

const server = express();
server.use(express.json());
server.use(cors());

const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASS,
  database: "nodejsexam",
};
const userSchema = Joi.object({
  full_name: Joi.string().trim(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
});

const dbPool = mysql.createPool(mysqlConfig).promise();

server.get("/", authenticate, (req, res) => {
  console.log(req.user);
  res.status(200).send({ message: "Authorized" });
});
server.post("/login", async (req, res) => {
  let payload = req.body;

  try {
    payload = await userSchema.validateAsync(payload);
  } catch (error) {
    console.error(error);

    return res.status(400).send({ error: "All fields are required" });
  }

  try {
    const [data] = await dbPool.execute(
      `
          SELECT * FROM users
          WHERE email = ?
      `,
      [payload.email],
    );

    if (!data.length) {
      return res.status(400).send({ error: "Email or password did not match" });
    }

    const passwordMatch = await bcrypt.compare(
      payload.password,
      data[0].password,
    );

    if (passwordMatch) {
      const token = jwt.sign(
        {
          email: data[0].email,
          id: data[0].id,
        },
        process.env.JWT_SECRET,
      );
      return res.status(200).send({ token });
    }

    return res.status(400).send({ error: "Email or password did not match" });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

server.post("/register", async (req, res) => {
  let payload = req.body;
  try {
    payload = await userSchema.validateAsync(payload);
  } catch (error) {
    console.error(error);

    return res.status(400).send({ error: "All fields are required" });
  }

  try {
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    const [response] = await dbPool.execute(
      `INSERT INTO users (full_name, email, password)
    VALUES (?,?,?)
    `,
      [payload.full_name, payload.email, encryptedPassword],
    );
    const token = jwt.sign(
      {
        email: payload.email,
        id: response.insertId,
        full_name: payload.full_name,
      },
      process.env.JWT_SECRET,
    );
    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});

server.get("/groups", authenticate, async (_, res) => {
  try {
    const [groups] = await dbPool.execute("SELECT * FROM nodejsexam.groups;");
    return res.json(groups);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});
server.post("/groups", async (req, res) => {
  try {
    const groups = {
      name: req.body.name,
    };
    const [response] = await dbPool.query(
      "INSERT INTO nodejsexam.groups SET ?",
      [groups],
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

server.post("/accounts", async (req, res) => {
  let payload = req.body;
  try {
    const [response] = await dbPool.execute(
      `INSERT INTO nodejsexam.accounts (group_id, user_id)
    VALUES (?,?)
    `,
      [payload.group_id, payload.user_id],
    );
    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

server.get("/accounts", authenticate, async (req, res) => {
  try {
    const [accounts] = await dbPool.execute(
      "SELECT groups.name, groups.id FROM nodejsexam.accounts JOIN nodejsexam.groups ON groups.id = accounts.group_id  WHERE accounts.user_id=?",
      [req.user.id],
    );
    return res.json(accounts);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

server.get("/bills/:groups_id", authenticate, async (req, res) => {
  try {
    const [bills] = await dbPool.execute(
      "SELECT * FROM nodejsexam.bills WHERE groups_id=?",
      [req.params.groups_id],
    );
    console.log(bills);
    return res.json(bills);
  } catch (error) {
    return res.status(500).end();
  }
});

server.post("/bills", async (req, res) => {
  let payload = req.body;
  try {
    const [response] = await dbPool.execute(
      `INSERT INTO nodejsexam.bills (groups_id, amount, description)
    VALUES (?,?,?)
    `,
      [payload.groups_id, payload.amount, payload.description],
    );
    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

server.listen(process.env.PORT, () =>
  console.log(`Server is listening to ${process.env.PORT} port`),
);
