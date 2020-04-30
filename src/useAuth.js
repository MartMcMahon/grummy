import { useEffect, useState } from "react";
import firebase from "./firebase";

export const useAuth = () => {
  let [userId, setUserId] = useState("");

  useEffect(() => {
    let usersRef = firebase.database().ref("users/");
    usersRef.on("value", snapshot => {
      firebase
        .database()
        .ref("users/")
        .set({ [userId]: "online" });
    });
  }, [userId]);

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUserId(user.uid);
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    firebase
      .database()
      .ref("users/")
      .onDisconnect()
      .update({
        [userId]: "offline"
      });
  }, []);

  useEffect(() => {
    const auth = firebase.auth();
    const res = auth.signInAnonymously();
  }, []);

  return [userId];
};
