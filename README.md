# Library Management System - Setup Guide

## 1. Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager, comes with Node.js)

### Check if Node.js and npm are installed

Run these commands in your terminal:

```bash
node -v  
npm -v  
```

If not installed, download and install Node.js from [nodejs.org](https://nodejs.org).

---

## 2. Download the Project

If you haven't already, download or clone the project files to your local machine:

```bash
git clone <repository-url>
```

---

## 3. Install Dependencies

Navigate to the project directory (where `package.json` is located) and run:

```bash
npm install  
```

This will install all the required dependencies listed in `package.json`.

---

## 4. Start the Server

To start the backend server, run:

```bash
npm start  
```

Or, for development mode with automatic restarts (using **nodemon**):

```bash
npm run dev  
```

You should see a message in the terminal like:

```
Library Management System running at http://localhost:3000  
```

---

## 5. Access the Application

Open your web browser and visit:

```
http://localhost:3000  
```

You should now see the Library Management System interface.

---

## 6. Add, Edit, and Manage Books

- Use the form to **add new books**.
- **Search and sort** books using the controls.
- **Edit** or **delete** books using the action buttons in the table.
- **Export data** as a CSV file using the "Export Data" button.

---

## 7. Stop the Server

To stop the server, press `Ctrl + C` in the terminal where the server is running.

---

## 8. (Optional) Debugging

If you encounter any errors:

- Check the **terminal logs** for details.
- Ensure the **books.csv** file exists in the project directory. (The server will create it automatically if missing.)
- If you make changes to the code, restart the server:
  ```bash
  Ctrl + C  
  npm start  
  ```

---

## 9. (Optional) Run in Production

For production deployment:

1. Install a process manager like **pm2**:

   ```bash
   npm install -g pm2  
   ```

2. Start the application with **pm2**:

   ```bash
   pm2 start index.js  
   ```

3. Monitor the application logs:

   ```bash
   pm2 logs  
   ```

---

You're now ready to run, manage, and extend the Library Management System! 🚀
