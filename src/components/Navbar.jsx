import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faSlack } from "@fortawesome/free-brands-svg-icons";
import { auth } from "../firebase"; 

const Navbar = ({ handleLogout }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        let name = user.displayName || user.email.split("@")[0];
        name = name.replace(/[0-9]/g, "");

        setUserName(name);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo-icon">
          <img
            src="https://www.creativefabrica.com/wp-content/uploads/2021/08/27/Resume-icon-Graphics-16430263-1-1-580x386.jpg"
            alt="FitCheck Logo"
          />
        </div>
        <span className="brand-name">ResumeFit</span>
      </div>

      <div className="navbar-right">
        <div className="workspace-badge">
          <FontAwesomeIcon icon={faSlack} className="slack-icon" />
          <span className="workspace-text">
            Workspace: <strong>{userName}</strong> 
          </span>
        </div>

        <button className="signout-btn" onClick={handleLogout}>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="logout-icon"
          />
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
