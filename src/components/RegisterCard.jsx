import React, { useState } from "react";
import "./LoginCard.css";
import loginCardImg from "../../assets/download.jpg";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterCard = ({ setPage , setShowSuccess ,alreadyfnc   }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const[regEmail , setRegEmail]= useState(false);
    const[regPass , setRegErr] = useState(false);

 const handleRegister = async () => {

  setRegEmail(false);
  setRegErr(false);

  try {
    await createUserWithEmailAndPassword(auth, email, password);

   setShowSuccess(true);

  } catch (error) {

    switch (error.code) {

      case "auth/missing-email":
        setRegEmail(true);
        break;

      case "auth/email-already-in-use":
       
        alreadyfnc(true)
        break;

      case "auth/invalid-email":
        setRegEmail(true);
        break;



      case "auth/missing-password":
        setRegErr(true);
        break;

      default:
        alert(error.message);
    }
  }
};

  return (
    <div className="login-card">
      <div className="logo-box">
        <img src={loginCardImg} alt="login-card-img" />
      </div>

      <h1 className="title">Create Account</h1>
      <p className="subtitle">Register as recruiter</p>

      <div className="form-content">
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            
          />
          {regEmail && <p className="err">Please Enter a Valid Email</p>}
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {regPass && <p className="err">Please Enter a Password</p>}
        </div>

        <button onClick={handleRegister} className="sign-in-btn">
          Register
        </button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => setPage("login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterCard;