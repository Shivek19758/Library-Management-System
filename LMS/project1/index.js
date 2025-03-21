const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { parseISO, isValid } = require('date-fns');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('public'));

// CSV file paths
const CSV_FILE = 'books.csv';
const BACKUP_FOLDER = 'backups';

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_FOLDER)) {
    fs.mkdirSync(BACKUP_FOLDER);
}

// CSV Writer setup
const csvWriter = createCsvWriter({
    path: CSV_FILE,
    header: [
        { id: 'serialNumber', title: 'Serial Number' },
        { id: 'title', title: 'Book Title' },
        { id: 'author', title: 'Author Name' },
        { id: 'issueDate', title: 'Date of Issue' },
        { id: 'returnDate', title: 'Return Date' }
    ]
});

// In-memory storage
let books = [];

// Helper function to create backup
function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_FOLDER, `books-${timestamp}.csv`);
    fs.copyFileSync(CSV_FILE, backupPath);
}

// Load data from CSV
function loadBooks() {
    return new Promise((resolve, reject) => {
        const results = [];
        if (!fs.existsSync(CSV_FILE)) {
            fs.writeFileSync(CSV_FILE, ''); // Create empty file if not exists
            resolve(results);
            return;
        }

        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                books = results;
                resolve(results);
            })
            .on('error', reject);
    });
}

// Save data to CSV
async function saveBooks() {
    await csvWriter.writeRecords(books);
    createBackup();
}

// Validate date format
function isValidDate(dateStr) {
    const parsed = parseISO(dateStr);
    return isValid(parsed);
}

// Routes
app.get('/books', (req, res) => {
    const { sort, search } = req.query;
    let result = [...books];

    if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(book =>
            book.serialNumber.toLowerCase().includes(searchLower) ||
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower)
        );
    }

    if (sort) {
        result.sort((a, b) => {
            switch (sort) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'author':
                    return a.author.localeCompare(b.author);
                case 'returnDate':
                    return new Date(a.returnDate) - new Date(b.returnDate);
                default:
                    return 0;
            }
        });
    }

    res.json(result);
});

app.post('/books', (req, res) => {
    const { serialNumber, title, author, issueDate, returnDate } = req.body;

    // Validation
    if (!serialNumber || !title || !author || !issueDate || !returnDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidDate(issueDate) || !isValidDate(returnDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    const newBook = { serialNumber, title, author, issueDate, returnDate };
    books.push(newBook);
    saveBooks();
    res.status(201).json(newBook);
});

app.put('/books/:serialNumber', (req, res) => {
    const { serialNumber } = req.params;
    const bookIndex = books.findIndex(book => book.serialNumber === serialNumber);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = {
        ...books[bookIndex],
        ...req.body,
        serialNumber // Prevent serial number modification
    };

    if (req.body.issueDate && !isValidDate(req.body.issueDate)) {
        return res.status(400).json({ error: 'Invalid issue date format' });
    }

    if (req.body.returnDate && !isValidDate(req.body.returnDate)) {
        return res.status(400).json({ error: 'Invalid return date format' });
    }

    books[bookIndex] = updatedBook;
    saveBooks();
    res.json(updatedBook);
});

app.delete('/books/:serialNumber', (req, res) => {
    const { serialNumber } = req.params;
    const initialLength = books.length;
    books = books.filter(book => book.serialNumber !== serialNumber);

    if (books.length === initialLength) {
        return res.status(404).json({ error: 'Book not found' });
    }

    saveBooks();
    res.status(204).send();
});

// Export data endpoint
app.get('/export', (req, res) => {
    res.download(CSV_FILE);
});

// Initialize server
async function init() {
    try {
        await loadBooks();
        app.listen(port, () => {
            console.log(`Library Management System running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

init();