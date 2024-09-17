document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('itemForm');
    const itemNameInput = document.getElementById('itemName');
    const itemList = document.getElementById('itemList');

    // Fetch and display items
    const fetchItems = async () => {
        const response = await fetch('/items');
        const items = await response.json();
        itemList.innerHTML = items.map((item, index) => `
            <li>
                ${item.name}
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
            </li>
        `).join('');
    };

    fetchItems();

    // Handle form submission
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemName = itemNameInput.value;

        if (itemName) {
            await fetch('/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: itemName })
            });
            itemNameInput.value = '';
            fetchItems();
        }
    });

    // Handle item list actions
    itemList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit')) {
            const index = e.target.getAttribute('data-index');
            const newName = prompt('Enter new item name:');
            if (newName) {
                await fetch(`/items/${index}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: newName })
                });
                fetchItems();
            }
        } else if (e.target.classList.contains('delete')) {
            const index = e.target.getAttribute('data-index');
            await fetch(`/items/${index}`, {
                method: 'DELETE'
            });
            fetchItems();
        }
    });
});
s