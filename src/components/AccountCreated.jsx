import React from 'react';
import './AccountCreated.css';
import successimg from '../../assets/congrats.png'

const AccountCreated = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="success-overlay">
      <div className="success-container">
        <div className="checkmark-wrapper">
          <div className='congrats-container'><img src={successimg} alt="congrats" /></div>
        </div>
        
        <div className="success-content">
          <h2>Account Created!</h2>
          <p>Yupp! Your dashboard is ready to go. Let’s start finding top talent with AI</p>
        </div>

        <button className="success-btn" onClick={onConfirm}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AccountCreated;