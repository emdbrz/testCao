const form = document.querySelector('form');

const API_BASE = 'http://localhost:8080';

const onRegisterUser = async (payload) => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const password = event.target.password.value;
  const repeatPassword = event.target['repeat-password'].value;

  if (password !== repeatPassword) {
    alert('Password do not match');
    return;
  }
  const payload = {
    full_name: event.target.full_name.value,
    email: event.target.email.value,
    password: password,
  };
  const userData = await onRegisterUser(payload);
  if (userData.token) {
    document.cookie = `token=${userData.token};`;
    window.location.replace('./groups.html');
  } else {
    console.log('Unexpected response from the server:', userData);
  }
});
