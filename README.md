# E-Commerce Application

Full-stack e-commerce platform with Node.js backend and React frontend.

## Project Structure

```
9_E-Commerce/
├── backend/              # Node.js Express server
│   ├── config/          # Database and service configs
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth and upload middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (OTP, email)
│   ├── package.json
│   ├── server.js
│   └── .env             # (git ignored)
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── features/    # Redux slices
│   │   ├── services/    # API services
│   │   └── App.jsx
│   ├── package.json
│   └── .env             # (git ignored)
└── README.md
```

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
# Create .env file with your configuration
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with API URL
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Features

- User authentication with OTP
- Role-based access (User/Seller)
- Product management
- Shopping cart
- Payment integration (Stripe)
- Address management
- Password reset via email

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB
- JWT Authentication
- Nodemailer (Email)
- Bcrypt (Password hashing)

**Frontend:**
- React + Vite
- Redux Toolkit (State management)
- Tailwind CSS (Styling)
- Axios (HTTP client)
