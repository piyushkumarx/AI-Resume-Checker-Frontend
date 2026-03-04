import React, { useState } from "react";
import "./LoginCard.css";
import loginCardImg from "../../assets/download.jpg";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const LoginCard = ({ setPage, setModalData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errEmail, setErrEmail] = useState(false);
  const [errPass, setPassErr] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);

      setPage("dashboard");
    } catch (error) {
      alert("Google login failed");
      console.error(error);
    }
  };

  const handleLogin = async () => {
    setErrEmail(false);
    setPassErr(false);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      setPage("dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
          setErrEmail(true);
          break;

        case "auth/missing-password":
          setPassErr(true);
          break;

        case "auth/too-many-requests":
          setModalData({
            title: "Too Many Attempts",
            message: "Too many login attempts. Please try again later.",
          });
          break;

        case "auth/invalid-credential":
          setModalData({
            title: "Invalid Credentials",
            message: "Please enter a valid email and password.",
          });
          break;

        default:
          setModalData({
            title: "Login Error",
            message: error.code,
          });
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-card">
      <div className="logo-box">
        <img src={loginCardImg} alt="login-card-img" />
      </div>

      <h1 className="title">AI Resume Screening</h1>
      <p className="subtitle">Sign in to your recruiter dashboard</p>

      <div className="form-content">
        <div className={`${errEmail ? "email-err" : "input-group"}`}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errEmail && <p className="err">Please Enter a Registerd Email</p>}
        </div>

        <div className={`${errPass ? "email-err" : "input-group"}`}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errPass && <p className="err">Please Enter Correct Password</p>}
        </div>

        <button onClick={handleLogin} className="sign-in-btn">
          Sign In
        </button>

        <div className="google-icon-container" onClick={handleGoogleLogin}>
          <FontAwesomeIcon
            className="google-icon"
            icon={faGoogle}
            style={{ color: "#7736ff" }}
          />
        </div>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={() => setPage("register")}>Register here</span>
        </p>

        <p className="forgot-text" onClick={() => setPage("forgot")}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
