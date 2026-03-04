import React, { useState } from "react";
import "./LoginCard.css";
import "./EmailSent.css";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import frogetpass from "../../assets/forgetpass.jpg";
import gamillogo from "../../assets/gmail_logo.jpg";
import openit from "../../assets/openit.png";

const ForgotPassword = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [mailSent, setMailSent] = useState(false);

   const[errEmail , setErrEmail]= useState(false);
    const[errPass , setPassErr] = useState(false);

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMailSent(true);
    } catch (error) {
      switch (error.code) {

      case "auth/invalid-email":
        setErrEmail(true);
        break;

        case "auth/missing-email":
        setErrEmail(true);
        break;

      case "auth/too-many-requests":
        alert("Too many attempts. Try again later.");
        break;


      default:
        alert(error.message);
    }
    }
  };

  return (
    <div className="login-card">
      {!mailSent ? (
        <>
          <div className="forget-img-container">
            <img src={frogetpass} alt="forget-img" className="forget-img" />
          </div>
          <h1 className="title">Reset Password</h1>
          <p className="subtitle">Enter your email to receive reset link</p>

          <div className="form-content">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errEmail && <p className="err">Please Enter a Registerd Email</p>}
            </div>

            <button onClick={handleReset} className="sign-in-btn">
              Send Reset Link
            </button>

            <p className="switch-text">
              Remember password?{" "}
              <span onClick={() => setPage("login")}>Back to Login</span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="email-heading">
            <h1 className="email-title">Check Your Email</h1>
            <div className="gmail-logo-container">
              <img src={gamillogo} alt="gmail-logo" />
            </div>
          </div>

          <p className="email-subtitle">
            We’ve sent a password reset link to your email.
          </p>

          <p className="email-note">
            Don’t forget to check your spam folder if you don’t see the email.
          </p>

          <button
            className="email-btn"
            onClick={() =>
              window.open("https://mail.google.com/mail/u/0/#spam", "_blank")
            }
          >
            Open Gmail
            <img src={openit} alt="open-image" className="open-it" />
          </button>

          <p className="email-switch-text">
            Back to <span onClick={() => setPage("login")}>Login</span>
          </p>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
