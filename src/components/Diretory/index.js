import React from "react";
import "./style.scss";

function Directory(props) {
  return (
    <div className="directory">
      <div className="wrap">
        <div
          className="item"
          style={{
            backgroundColor: "#F5905C",
            height: "9rem",
          }}
        >
          <span> Shop </span>
        </div>
      </div>
    </div>
  );
}

export default Directory;
