import React, { useState, useEffect } from 'react';
import api from '../../../services/api.js';
import toast from 'react-hot-toast';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', image: '' });
  const [email, setEmail] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await api.get('/admine/membersDetail');
      setMembers(response.data || []); // Ensure array if empty
    } catch (error) {
      toast.error('Failed to fetch members');
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      toast.error('Name and role are required');
      return;
    }
    try {
      await api.post('/admine/addMember', newMember);
      toast.success('Member added');
      setNewMember({ name: '', role: '', image: '' });
      fetchMembers();
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const handleBlockUser = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email');
      return;
    }
    try {
      await api.post('/admine/blockuser', { gmail: email });
      toast.success('User blocked');
      setEmail('');
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email');
      return;
    }
    try {
      await api.post('/admine/unblockuser', { gmail: email });
      toast.success('User unblocked');
      setEmail('');
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#2e1a47] to-[#1a0e2e] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Member Management</h2>
          <p className="text-gray-400">Manage team members and user access</p>
        </div>

        {/* Add Member Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            Add New Member
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
              <input
                type="text"
                placeholder="Role/Position"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Profile Image URL (optional)"
              value={newMember.image}
              onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleAddMember}
              className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Add Member
            </button>
          </div>
        </div>

        {/* Block/Unblock User Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
            User Access Control
          </h3>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="User Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBlockUser}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Block User
              </button>
              <button
                onClick={handleUnblockUser}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Unblock User
              </button>
            </div>
          </div>
        </div>

        {/* Members List Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Current Members
          </h3>
          <div className="space-y-3">
            {members.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No members found</p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => { e.target.src = '/default-avatar.png'; }} // Fallback image
                        />
                      )}
                      <div>
                        <h4 className="text-white font-medium">{member.name}</h4>
                        <p className="text-gray-400 text-sm">{member.role}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;