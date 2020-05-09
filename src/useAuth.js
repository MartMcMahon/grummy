import { useEffect, useState } from "react";

export const useAuth = firebase => {
  let [user, setUser] = useState({uid: null});

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe;
  }, []);

  return user;
};
