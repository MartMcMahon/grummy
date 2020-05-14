import React, { useEffect, useState } from "react";
import "@firebase/messaging";
import firebase from "../firebase";

function createUUID() {
  return `${Date.now()}-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(
    /[xy]/g,
    function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(() => {
      console.log("ok. cool");
      return messaging.getToken();
    })
    .then(token => {
      console.log({ token });
    })
    .catch(err => {
      console.log("no permission");
    });

  messaging.onMessage(payload => {
    console.log({ payload });
  });
}

const MessagesContent = props => {
  let [username, setUsername] = useState("new user");
  // let [extended, setExtended] = useState(false);
  let [localMessage, setLocalMessage] = useState("");
  let [messages, setMessages] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("messages")
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => ({
          ...doc.data()
        }));
        console.log("ss", newMessages);
        setMessages(newMessages);
      });
  }, []);

  // useEffect(() => {
  //   messaging
  //     .getToken()
  //     .then(currentToken => {
  //       if (currentToken) {
  //         console.log("got token", currentToken);
  //       } else {
  //         // permission req
  //         console.log("need permission");
  //       }
  //     })
  //     .catch(err => {
  //       console.log("an error occurred getting messaging token.", err);
  //     });
  // });

  const catchKey = e => {
    if (e.which === 13 /* Enter */) {
      // e.preventDefault();
      // e.target.blur();
      firebase
        .firestore()
        .collection("messages")
        .doc(createUUID())
        .set({
          user: username,
          message: localMessage
        })
        .then(function() {
          console.log("Document successfully written!");
          setLocalMessage("");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  };

  return (
    <React.Fragment>
      <div className="message-output">
        {messages.map(m => (
          <div className="message">{`${m.user}: ${m.message}`}</div>
        ))}
      </div>
      <div className="username-input">
        <input
          type="text"
          value={username}
          onChange={e => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div className="message-input">
        <textarea
          type="textarea"
          value={localMessage}
          onKeyPress={catchKey}
          onChange={e => {
            setLocalMessage(e.target.value);
          }}
        />
      </div>
        </React.Fragment>
  );
};

export default MessagesContent;
