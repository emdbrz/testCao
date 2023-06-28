const form = document.querySelector('form');

const API_BASE = 'http://localhost:8080';

const onLoginUser = async (payload) => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    return console.error(error);
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    email: event.target.email.value,
    password: event.target.password.value,
  };

  const userData = await onLoginUser(payload);
  if (userData.token) {
    document.cookie = `token=${userData.token};`;
    window.location.replace('./groups.html');
  } else {
    alert('Email or password did not match');
  }
});
