// frontend/src/components/admin/ActivityLogManagement.js

import React, { useEffect, useState } from 'react';
import { fetchActivityLogs, deleteActivityLog } from '../../services/adminService'; // Imported deleteActivityLog
import { toast } from 'react-toastify';
import ConfirmModal from '../common/ConfirmModal';

const ActivityLogManagement = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  const getActivityLogs = async () => {
    try {
      const response = await fetchActivityLogs();
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error('Failed to load activity logs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getActivityLogs();
  }, []);

  const handleDeleteLog = async () => {
    try {
      await deleteActivityLog(logToDelete.id); // Using the imported function
      toast.success('Activity log deleted successfully.');
      setShowConfirm(false);
      setLogToDelete(null);
      getActivityLogs();
    } catch (error) {
      console.error('Error deleting activity log:', error);
      toast.error('Failed to delete activity log.');
      setShowConfirm(false);
      setLogToDelete(null);
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Activity Log Management</h1>

      {loading ? (
        <div className="text-center">Loading Activity Logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center">No activity logs available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Timestamp</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Details</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    {log.User ? `${log.User.username}#${log.User.discriminator}` : 'Unknown'}
                  </td>
                  <td className="border px-4 py-2">{log.action}</td>
                  <td className="border px-4 py-2">{log.details || 'N/A'}</td>
                  <td className="border px-4 py-2 space-x-2">
                    {/* Future: Implement edit functionality */}
                    <button
                      onClick={() => {
                        setLogToDelete(log);
                        setShowConfirm(true);
                      }}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Delete Activity Log"
          message={`Are you sure you want to delete the activity log "${logToDelete.action}"? This action cannot be undone.`}
          onConfirm={handleDeleteLog}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default ActivityLogManagement;
