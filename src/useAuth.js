import { useEffect, useState } from "react";
import firebase from "./firebase";

export const useAuth = () => {
  let [userId, setUserId] = useState("");

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUserId(user.uid);
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return [userId];
};
