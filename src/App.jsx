import React from "react";
import "./App.css";

import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <p>User: {user ? "is logged in" : "is null"}</p>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
        <section>
          <SignOut />
        </section>
      </header>
    </div>
  );
}

function ChatRoom() {
  let randomString = generateString(8);
  let createdAt = Timestamp.fromDate(new Date()).toDate();

  const generateDocument = async () => {
    try {
      await addDoc(collection(db, "testCollection"), {
        testField: `Another test field: ${randomString}`,
        createdAt,
      });
      console.log(`Doc written at: ${createdAt}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <p>In the chat room!</p>
      <button onClick={generateDocument}>Generate unique document</button>
    </>
  );
}

function SignIn() {
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };

  return <button onClick={signInWithGoogle}>Sign In With Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function generateString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default App;
