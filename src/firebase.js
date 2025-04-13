import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD7ZsTvNSZKD_qdpWaR3y9JShi0eRmKofs",
  authDomain: "banking-app-52d23.firebaseapp.com",
  projectId: "banking-app-52d23",
  storageBucket: "banking-app-52d23.firebasestorage.app",
  messagingSenderId: "1019747653482",
  appId: "1:1019747653482:web:36a8ca9a59b35c0810b713"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);