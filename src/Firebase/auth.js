import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Sign up a new user
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Returns the user object
  } catch (error) {
    throw error; // Rethrow error for handling in the UI
  }
};

// Log in an existing user
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Returns the user object
  } catch (error) {
    throw error; // Rethrow error for handling in the UI
  }
};

// Log out the current user
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error; // Rethrow error for handling in the UI
  }
};
