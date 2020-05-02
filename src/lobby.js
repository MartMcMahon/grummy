import React, { useState, useEffect } from "react";
import firebase from "./firebase";
import { useGameObject } from "./gameObject";
import MessagesContent from "./messages/messagesContent";

import "./lobby.scss";

const Lobby = props => {
  // // const [gameId] = useGameObject();
  //   let [gameId, setGameId] = useState("0");
  //   useEffect(() => {
  //     firebase
  //       .firestore()
  //       .collection("games")
  //       .onSnapshot(snapshot => {
  //         // const currentGame = Math.max(...snapshot.docs.map(doc => parseInt(doc.id)));
  //         console.log("docs", snapshot.docs);
  //         const currentGame = snapshot.docs
  //           .map(doc => doc.id)
  //           .sort()
  //           .reverse()[0];
  //         setGameId(currentGame);
  //       });
  //   }, [gameId]);

  let [userList, setUserList] = useState([]);
  let gameId = useGameObject();

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
            return <div>{user.id}</div>;
          })}
        </div>
      </div>
        <div className="ready-button">
          <button
            onClick={e => {
              console.log(e, "ready!");
            }}
          >
            ready</button>
          </div>

      <div className="lobby-message-area">
        <MessagesContent />
      </div>
    </div>
  );
};
export default Lobby;
