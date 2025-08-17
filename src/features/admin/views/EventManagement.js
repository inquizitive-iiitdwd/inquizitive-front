import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaCheck, FaTimesCircle } from 'react-icons/fa';
import api from '../../../services/api.js';

const EventManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/all-registrations', { withCredentials: true });
      setRegistrations(response.data);
    } catch (error) {
      toast.error("Failed to fetch event data.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleEdit = (registration) => {
    setEditingId(registration.teamleaderid);
    setEditedData({
      teamname: registration.teamname,
      is_present: registration.is_present,
      has_taken_quiz: registration.has_taken_quiz,
    });
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/events/update-registration/${id}`, editedData, { withCredentials: true });
      toast.success("Registration updated successfully!");
      setEditingId(null);
      fetchRegistrations(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update registration.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        await api.delete(`/events/delete-registration/${id}`, { withCredentials: true });
        toast.success("Registration deleted successfully!");
        fetchRegistrations(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete registration.");
        console.error("Delete error:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderMembers = (members) => {
    const memberCells = [];
    // Ensure 'members' is an array before mapping
    const memberArray = members || [];
    for (let i = 0; i < 3; i++) {
      const member = memberArray[i];
      if (member) {
        memberCells.push(
          <React.Fragment key={i}>
            <td className="p-4">{member.name}</td>
            <td className="p-4">{member.id}</td>
          </React.Fragment>
        );
      } else {
        memberCells.push(
          <React.Fragment key={i}>
            <td className="p-4 text-gray-500">N/A</td>
            <td className="p-4 text-gray-500">N/A</td>
          </React.Fragment>
        );
      }
    }
    return memberCells;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Event Registrations</h1>
      </div>
      <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-slate-900/70 text-sm uppercase sticky top-0">
              <tr>
                <th className="p-4">Present</th>
                <th className="p-4">Quiz Taken</th>
                <th className="p-4">Team Name</th>
                <th className="p-4">Team Lead Name</th>
                <th className="p-4">Team Lead ID</th>
                <th className="p-4">Team Lead Email</th>
                <th className="p-4">Member 1 Name</th>
                <th className="p-4">Member 1 ID</th>
                <th className="p-4">Member 2 Name</th>
                <th className="p-4">Member 2 ID</th>
                <th className="p-4">Member 3 Name</th>
                <th className="p-4">Member 3 ID</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.teamleaderid} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4">
                    {editingId === reg.teamleaderid ? (
                      <input type="checkbox" name="is_present" checked={editedData.is_present} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 rounded" />
                    ) : (
                      reg.is_present ? <FaCheck className="text-green-400" /> : <FaTimesCircle className="text-red-400" />
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === reg.teamleaderid ? (
                      <input type="checkbox" name="has_taken_quiz" checked={editedData.has_taken_quiz} onChange={handleChange} className="form-checkbox h-4 w-4 text-purple-600 rounded" />
                    ) : (
                      reg.has_taken_quiz ? <FaCheck className="text-green-400" /> : <FaTimesCircle className="text-red-400" />
                    )}
                  </td>
                  <td className="p-4 font-semibold text-white">
                    {editingId === reg.teamleaderid ? (
                      <input type="text" name="teamname" value={editedData.teamname} onChange={handleChange} className="bg-slate-700 px-2 py-1 rounded w-full" />
                    ) : (
                      reg.teamname
                    )}
                  </td>
                  <td className="p-4">{reg.teamleadername}</td>
                  <td className="p-4">{reg.teamleaderid}</td>
                  <td className="p-4">{reg.leadmailid}</td>
                  {renderMembers(reg.members)}
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      {editingId === reg.teamleaderid ? (
                        <button onClick={() => handleSave(reg.teamleaderid)} className="text-green-400 hover:text-green-500" title="Save">
                          <FaCheck size={18} />
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(reg)} className="text-yellow-400 hover:text-yellow-500" title="Edit">
                          <FaEdit size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(reg.teamleaderid)} className="text-red-400 hover:text-red-500" title="Delete">
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;