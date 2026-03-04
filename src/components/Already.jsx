import React from "react";
import './Already.css'


export default function Already({setPage , setAlready}){
    return (
    <div className="overlay">
      <div className="modal">
        <h2>Email Already Exists</h2>
        <p>This email is already registered. Please login instead.</p>

        <div className="actions">
          <button className="login-btn" onClick={()=>{setPage("login"); setAlready(false)}}>Go to Login</button>
          
        </div>
      </div>
    </div>
  );
};
