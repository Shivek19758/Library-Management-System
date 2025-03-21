# Library-Management-System
1. Prerequisites
Make sure you have the following installed on your system:

Node.js (version 14 or higher)

npm (Node Package Manager, comes with Node.js)

You can check if Node.js and npm are installed by running these commands in your terminal:

bash
Copy
node -v
npm -v
If not installed, download and install Node.js from nodejs.org.

2. Download the Project
If you haven't already, download or clone the project files to your local machine.

3. Install Dependencies
Navigate to the project directory (where package.json is located) and run:

bash
Copy
npm install
This will install all the required dependencies listed in package.json.

4. Start the Server
To start the backend server, run:

bash
Copy
npm start
or, if you want to run it in development mode with automatic restarts (using nodemon), use:

bash
Copy
npm run dev
You should see a message in the terminal like:

Copy
Library Management System running at http://localhost:3000
5. Access the Application
Open your web browser and go to:

Copy
http://localhost:3000
You should see the Library Management System interface.

6. Add, Edit, and Manage Books
Use the form to add new books.

Search and sort books using the controls.

Edit or delete books using the action buttons in the table.

Export the data as a CSV file using the "Export Data" button.

7. Stop the Server
To stop the server, press Ctrl + C in the terminal where the server is running.

8. (Optional) Debugging
If you encounter any errors, check the terminal for logs.

Ensure the books.csv file exists in the project directory. If not, the server will create it automatically.

If you make changes to the code, restart the server (Ctrl + C and then npm start again).

9. (Optional) Run in Production
If you want to deploy the application to a production environment:

Install a process manager like pm2:

bash
Copy
npm install -g pm2
Start the application with pm2:

bash
Copy
pm2 start index.js
Monitor the application:

bash
Copy
pm2 logs
