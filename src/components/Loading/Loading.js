import React from "react";
import "./Loading.css";

const LoadingIndicator = (props) => {
  return (
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIndicator;
