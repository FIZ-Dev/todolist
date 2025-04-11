import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// isi konfigurasi sesuai dengan konfigurasi firebase kalian
const firebaseConfig = {
  apiKey: 'AIzaSyDJu_Y4Ub2ew1AyhMXMv3UqQ2_NzqhKlWM',
  authDomain: 'todolist-960c3.firebaseapp.com',
  projectId: 'todolist-960c3',
  storageBucket: 'todolist-960c3.firebasestorage.app',
  messagingSenderId: '1:240080086367:web:f9212fc4b47de1156402ea',
  appId: 'G-0JX3K2F1Q4',
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };