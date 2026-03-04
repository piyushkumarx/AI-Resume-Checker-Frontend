import React from "react";
import "./invalid.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const InvalidModal = ({ title, disc, onClose }) => {
  const isSuccess = title?.toLowerCase().includes("success");

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <FontAwesomeIcon
          icon={isSuccess ? faCircleCheck : faCircleXmark}
          className={isSuccess ? "success-icon" : "wrong-icon"}
        />

        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div className="modal-body">
          <p style={{ whiteSpace: "pre-line" }}>{disc}</p>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default InvalidModal;


