import React from "react";
import "./LoadingOverlay.css";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loader-box">
        <div className="spinner">
        <h2>Analyzing Resumes</h2>
        <p>Wait we are checking...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;