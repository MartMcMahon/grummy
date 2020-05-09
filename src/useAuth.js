import { useEffect, useState } from "react";
import firebase from "./firebase";

export const useAuth = () => {
  let [user, setUser] = useState("");

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user.uid);
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  });

  return user;
};
