// src/pages/VerifyEmail.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VerifyEmail() {
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('Invalid verification link.');
        return;
      }

      try {
        await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        setStatus('Email verified successfully! You can now log in.');
      } catch (error) {
        setStatus(error.response?.data?.message || 'Email verification failed.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="card bg-base-100 shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-extrabold text-primary mb-4">Email Verification</h2>
            <p className={`text-lg ${status.includes('successfully') ? 'text-success' : 'text-error'}`}>
              {status}
            </p>
            {status === 'Email verified successfully! You can now log in.' && (
              <div className="mt-6">
                <a href="/login" className="link link-primary">
                  Go to Login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
