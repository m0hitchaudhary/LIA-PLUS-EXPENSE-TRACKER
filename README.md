# Expense Tracker

A modern, full-stack expense tracking application that helps you manage and visualize your personal finances. Track your spending, categorize expenses, and gain insights through interactive charts and reports.

## Features

- 🔐 Secure user authentication
- 💰 Track expenses with categories
- 📊 Visual analytics with charts
- 📱 Responsive Material-UI design
- 🌓 Light/Dark theme support
- 📈 Daily, weekly, and monthly views

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI v5 for styling
- Chart.js for data visualization
- React Router v6 for navigation
- Axios for API requests
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/m0hitchaudhary/expense-tracker.git
cd expense-tracker
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:

Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI='mongodb+srv://mohit:mohit123@cluster0.615klfg.mongodb.net/'
JWT_SECRET='cdFkUxF/cqmBW6H/C+7PpHzBuqMIy0ETDOrgqWFo8E4='
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm start
```

3. Open your browser and visit `http://localhost:3000`

## Project Structure

```
expense-tracker/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── context/      # React Context providers
│       ├── services/     # API services
│       └── types/        # TypeScript type definitions
│
└── server/                # Backend Node.js application
    ├── middleware/       # Express middlewares
    ├── models/          # Mongoose models
    └── routes/          # API routes
```

## Screenshots

![image](https://github.com/user-attachments/assets/1cb0098d-2f45-4881-a162-6399ab19d9f1)

![image](https://github.com/user-attachments/assets/876c1645-4d98-4b1a-88ff-835d6a447ed9)

![image](https://github.com/user-attachments/assets/621b4c24-fe54-4fc4-bd7e-ba7b84f68839)

![image](https://github.com/user-attachments/assets/2eaa3f8c-9269-48e7-8fcf-0e508d6cd1d6)

![image](https://github.com/user-attachments/assets/be8a73db-d72c-438f-af4a-d015d17c56df)



<!-- Add your application screenshots here. Example:
![Dashboard](screenshots/dashboard.png)
![Expense Form](screenshots/expense-form.png)
![Charts](screenshots/charts.png)
-->

## Development

To run the application in development mode with hot reloading:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

[Mohit Chaudhary](https://github.com/m0hitchaudhary)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the beautiful components
- Chart.js for the visualization capabilities
- MongoDB Atlas for database hosting 
