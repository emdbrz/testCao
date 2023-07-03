const gridContainer = document.getElementById('bills-container');
const btnEl = document.getElementById('btn');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const API_BASE = 'http://localhost:8080';

btnEl.addEventListener('click', async (event) => {
  event.preventDefault();
  const description = descriptionEl.value;
  const amount = amountEl.value;
  const groupBills = async () => {
    const response = await fetch(`${API_BASE}/bills`);
    const data = await response.json();
    console.log(data);
  };
  console.log(amount, description);
  groupBills.forEach((bill) => {
    const tableRow = document.createElement('tr');
    const id = document.createElement('td');
    id.textContent = bill.groups_id.toString();
    const description = document.createElement('td');
    description.textContent = bill.description.value;
    const amount = document.createElement('td');
    amount.textContent = bill.amount.value;

    tableRow.append(id, description, amount);
    gridContainer.appendChild(tableRow);
  });
  groupBills();
});

// I know I need make Post.. But I stuck with append and grabing values from database tried everything ... Just there is lack of knowledge. Need to learn debug code .....
