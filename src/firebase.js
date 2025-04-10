import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase client-side configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKAzy9U4dU0oFLV9jd1qLA58P_vpPiD80",
  authDomain: "banking-app-799ed.firebaseapp.com",
  projectId: "banking-app-799ed",
  storageBucket: "banking-app-799ed.firebasestorage.app",
  messagingSenderId: "111217392895",
  appId: "1:111217392895:web:8056f99b133450818ba0ca",
  measurementId: "G-7VK1N8HMHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Auth
export const auth = getAuth(app);