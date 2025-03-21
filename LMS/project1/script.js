document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const exportButton = document.getElementById('exportButton');
    const editMode = document.getElementById('editMode');

    // Load books on page load
    loadBooks();

    // Form submission
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            serialNumber: document.getElementById('serialNumber').value,
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            issueDate: document.getElementById('issueDate').value,
            returnDate: document.getElementById('returnDate').value
        };

        try {
            const isEditing = editMode.value === 'true';
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `/books/${formData.serialNumber}` : '/books';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save book');
            }

            bookForm.reset();
            editMode.value = 'false';
            loadBooks();
        } catch (error) {
            alert(error.message);
        }
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        loadBooks();
    });

    // Sort functionality
    sortSelect.addEventListener('change', () => {
        loadBooks();
    });

    // Export functionality
    exportButton.addEventListener('click', async () => {
        try {
            window.location.href = '/export';
        } catch (error) {
            alert('Failed to export data');
        }
    });
});

async function loadBooks() {
    try {
        const searchTerm = document.getElementById('searchInput').value;
        const sortBy = document.getElementById('sortSelect').value;
        
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (sortBy) queryParams.append('sort', sortBy);

        const response = await fetch(`/books?${queryParams.toString()}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        alert('Failed to load books');
    }
}

function displayBooks(books) {
    const tableBody = document.getElementById('booksTableBody');
    tableBody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        const isOverdue = new Date(book.returnDate) < new Date() && new Date(book.issueDate) < new Date();
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${book.serialNumber}</td>
            <td class="px-6 py-4 whitespace-nowrap ${isOverdue ? 'text-red-500' : ''}">${book.title}</td>
            <td class="px-6 py-4 whitespace-nowrap">${book.author}</td>
            <td class="px-6 py-4 whitespace-nowrap">${formatDate(book.issueDate)}</td>
            <td class="px-6 py-4 whitespace-nowrap ${isOverdue ? 'text-red-500' : ''}">${formatDate(book.returnDate)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="editBook('${book.serialNumber}')" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">Edit</button>
                <button onclick="deleteBook('${book.serialNumber}')" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

async function editBook(serialNumber) {
    try {
        const response = await fetch(`/books?search=${serialNumber}`);
        const books = await response.json();
        const book = books.find(b => b.serialNumber === serialNumber);
        
        if (book) {
            document.getElementById('serialNumber').value = book.serialNumber;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('issueDate').value = book.issueDate;
            document.getElementById('returnDate').value = book.returnDate;
            document.getElementById('editMode').value = 'true';
        }
    } catch (error) {
        alert('Failed to load book details');
    }
}

async function deleteBook(serialNumber) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            const response = await fetch(`/books/${serialNumber}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete book');
            }

            loadBooks();
        } catch (error) {
            alert(error.message);
        }
    }
}