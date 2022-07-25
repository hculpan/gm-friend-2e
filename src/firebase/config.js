import { getFirestore, collection } from "@firebase/firestore/lite";
import { getAuth } from "@firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCuS-W_dkPyZkpkqODWcQPDg62acdZu8LM",
  authDomain: "addfightfriend.firebaseapp.com",
  projectId: "addfightfriend",
  storageBucket: "addfightfriend.appspot.com",
  messagingSenderId: "157050734460",
  appId: "1:157050734460:web:dae0f3d7d35cbcf95206f9",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();

const npcsCol = collection(db, "npcs");
const locationsCol = collection(db, "locations");

export { db, auth, npcsCol, locationsCol };
