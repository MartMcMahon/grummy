import React, { useState, useEffect } from "react";
import firebase from "./firebase";
// import MessagesContent from "./messages/messagesContent";

import "./lobby.scss";

const Lobby = props => {
  let [userList, setUserList] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("lobby")
      .onSnapshot(snapshot => {
        console.log(snapshot.docs);
        setUserList([...snapshot.docs]);
      });
  }, []);

  console.log(props.userId)

  return (
    <div className="lobby">
      <div className="player-area">
        <div>
          {userList.map(user => {
            return <div>{user.name}</div>;
          })}
        </div>
      </div>
        <div className="start-button">
          <button
            onClick={e => {
              props.setRoute("game");
            }}
          >
            start</button>
          </div>

      <div className="lobby-message-area">
        <MessagesContent />
      </div>
    </div>
  );
};
export default Lobby;
