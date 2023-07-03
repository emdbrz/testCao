const token = Cookies.get('token');

if (!token) {
  window.location.replace('./index.html');
}

const API_BASE = 'http://localhost:8080';

const gridContainer = document.getElementById('grid-container');

const groupsWithId = async () => {
  try {
    const response = await fetch(`${API_BASE}/accounts`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    return await response.json();
  } catch (error) {
    return console.log(error);
  }
};

const renderGroups = (groups) => {
  groups.forEach((group) => {
    const gridItem = document.createElement('div');
    const section = document.createElement('section');
    const heading3 = document.createElement('h3');
    const content = document.createElement('p');

    gridItem.classList.add('grid-item');
    heading3.textContent = `ID ${group.id}`;
    content.textContent = group.name;

    gridItem.addEventListener('click', async () => {
      window.location.href = './bills.html';
    });

    gridItem.append(section);
    section.append(heading3, content);
    gridContainer.append(gridItem);
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  const groups = await groupsWithId();
  if (groups.error) {
    window.location.replace('./index.html');
  } else {
    renderGroups(groups);
  }
});
