import React from "react";

import "./cardArea.scss";

const CardArea = props => {

  // let gameObject = useGameObject();

  return (
    <div className="card-area">
      <div className="top-area">
        <div className="opponent top-opponent">top opponent</div>
        <div className="opponent left-opponent">left opponent</div>
        <div className="opponent right-opponent">right opponent</div>
      </div>
      <div className="draw-discard-area">
        <div className="card-button deck">draw</div>
        <div className="card-button discard">discard</div>
        <div className="button card-button draw-from-pile-button">pickup</div>
        <div className="button card-button play-card-button">play</div>
        <div className="button card-button discard-card-button">discard</div>
      </div>
      <div className="player play-area">your cards</div>
      <div className="player hand">your hand</div>
    </div>
  );
};
export default CardArea;
