// frontend/src/components/common/Modal.js

import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
