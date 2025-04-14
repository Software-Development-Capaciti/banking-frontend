# 💻 Banking System – Frontend

This is the **React-based frontend** for the Banking System project. It provides a clean and user-friendly UI for interacting with the backend, with authentication handled by **Firebase** and deployment via **Docker**.

## ⚙️ Tech Stack

- React.js
- Firebase Authentication
- Axios
- React Router
- Bootstrap
- Docker

## 🔐 Authentication

Authentication is powered by **Firebase**. Users can sign up, log in, and log out securely. Tokens are sent with API requests to authorize access to protected endpoints.

Firebase is configured in `src/firebase.js`.

## 🌐 API Access

All API requests are proxied to the backend server using Axios. Make sure the backend has **CORS** enabled to allow communication.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- Firebase account 
- Docker

### 🛠️ Features
Login & Signup

View account details

Transfer funds

View transaction history

Responsive UI

### 📂 Project Structure
frontend/
├── public/
├── src/
|   ├── assest/
│   ├── components/
│   ├── pages/
│   ├── App.css
│   ├── App.jsx
|   ├── firebase.js
|   ├── index.css
│   └── main.jsx

### Installation

1. Clone the repository and navigate to the frontend folder:

git clone https://github.com/Software-Development-Capaciti/banking-frontend.git
cd banking-frontend

2. Install Dependencies:

npm install

3. Add your Firebase configuration to .env:

REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id


4. Start the development server:

npm start

