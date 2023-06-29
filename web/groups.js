const token = Cookies.get('token');

if (!token) {
  window.location.replace('./index.html');
}

const API_BASE = 'http://localhost:8080';

const groupsWithId = async () => {
  try {
    const response = await fetch(`${API_BASE}/groups`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    return await response.json();
  } catch (error) {
    return console.log(error);
  }
};
// const renderUserGroups = (groups) => {
//   groups.forEach((groupName) => {
//     console.log(groupName);
//   });
// };

document.addEventListener('DOMContentLoaded', async () => {
  const groups = await groupsWithId();
  if (groups.error) {
    window.location.replace('./index.html');
  }
});
