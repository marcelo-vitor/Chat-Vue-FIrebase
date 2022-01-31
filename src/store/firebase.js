import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { ref } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyCy997iMWshaoOu1gGUAp3FKWbAXE2R3Kg",
  authDomain: "sagip-chat.firebaseapp.com",
  projectId: "sagip-chat",
  storageBucket: "sagip-chat.appspot.com",
  messagingSenderId: "499268101874",
  appId: "1:499268101874:web:b6b07ca369280e7edad26b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

export { auth };

// DB
const db = getFirestore(app);

// USER COLLETION
const userCollection = collection(db, "users");

// GET USERS
export const userAll = () => {
  const users = ref([]);
  onSnapshot(userCollection, async (querySnapshot) => {
    users.value = await querySnapshot.docs.map((doc) => doc.data());
  });
  return users;
};

// USER CREATE
export const userCreate = async (user) => {
  return await setDoc(doc(db, "users", user.email), user);
};

// MESSAGE COLLECTION
const messageCollection = collection(db, "messages");

// MENSAGEM CREATE
export const messageCreate = async (message) => {
  return await setDoc(doc(db, "messages", uuidv4()), message);
};

// GET MESSAGE
export const messageGet = (currentChat) => {
  console.log(currentChat)
  const messages = ref([])
  const q = query(messageCollection, orderBy('data'))
  onSnapshot(q, async (querySnapshot) => {
    messages.value = await querySnapshot.docs.map((doc) => doc.data());
  })
  return messages;
};