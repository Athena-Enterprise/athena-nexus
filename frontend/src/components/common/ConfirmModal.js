// frontend/src/components/common/ConfirmModal.js

import React from 'react';

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
