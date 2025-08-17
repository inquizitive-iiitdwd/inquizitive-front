import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api.js';
import { FaEnvelope, FaUser, FaIdCard, FaUsers, FaPlus, FaTimes, FaRegTimesCircle } from 'react-icons/fa';

const EventRegistration = ({ isOpen, onClose }) => {
  const [teamLeaderName, setteamLeaderName] = useState('');
  const [teamLeaderId, setteamLeaderId] = useState('');
  const [leadMailId, setleadMailId] = useState('');
  const [teamName, setteamName] = useState('');
  const [members, setMembers] = useState([]);
  const [validMailmsg, setvalidMailmsg] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  if (!isOpen) return null;

  const emailVerification = (email) => {
    const mail = document.getElementById('email');
    if (email.endsWith('@iiitdwd.ac.in')) {
      setvalidMailmsg('valid');
      if (mail) {
        mail.classList.remove('border-red-500');
        mail.classList.add('border-green-500');
      }
    } else {
      setvalidMailmsg('invalid');
      if (mail) {
        mail.classList.remove('border-green-500');
        mail.classList.add('border-red-500');
      }
    }
  };

  const handleAddMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: '', id: '' }]);
    }
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const register = async () => {
    try {
      const allMembers = [
        teamLeaderId.toLowerCase(),
        ...members.map(m => m.id.toLowerCase())
      ];
      const uniqueIds = new Set(allMembers);

      if (!teamLeaderName || !teamLeaderId || !leadMailId || !teamName) {
        toast.error("Please enter team leader details and team name.");
        return;
      }
      if (members.some(m => !m.name || !m.id)) {
        toast.error("Please fill all member details or remove empty fields.");
        return;
      }
      if (teamLeaderId.length !== 8 || members.some(m => m.id.length !== 8)) {
        toast.error("Invalid ID format (must be 8 characters).");
        return;
      }
      if (!leadMailId.endsWith('@iiitdwd.ac.in')) {
        toast.error("Invalid Email-ID format.");
        return;
      }
      if ((leadMailId.slice(0, 8)).toLowerCase() !== teamLeaderId.toLowerCase()) {
        toast.error("Team Lead mail ID does not match with the team lead ID");
        return;
      }
      if (uniqueIds.size !== allMembers.length) {
        toast.error("All team members must have unique IDs.");
        return;
      }

      const data = {
        teamLeaderName,
        teamLeaderId: allMembers[0],
        leadMailId,
        teamName,
        members: members.map((m, index) => ({
          name: m.name,
          id: allMembers[index + 1]
        }))
      };

      const response = await api.post('/events/eventRegistration', { data }, { withCredentials: true });

      if (response.data.ok) {
        setIsRegistered(true);
        toast.success("Your team is registered successfully");
      } else {
        toast.error(response.data.message || "Failed to register.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Failed to register. Please try again.");
    }
  };

  const validMail = (e) => {
    const newmail = e.target.value;
    setleadMailId(newmail);
    emailVerification(newmail);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-gradient-to-br from-[#2e1a47] to-[#1e103a] border border-purple-700 p-8 rounded-2xl w-full max-w-xl relative shadow-2xl animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-3xl text-white font-bold mb-4 text-center">Event Registration</h2>
        {!isRegistered ? (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={teamLeaderName} placeholder="Team Leader Name" onChange={(e) => setteamLeaderName(e.target.value)} className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div className="relative">
              <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={teamLeaderId} placeholder="Team Leader ID (e.g. 23bcs067)" onChange={(e) => setteamLeaderId(e.target.value)} className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div className="relative flex items-center gap-2">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="email" type="email" value={leadMailId} placeholder="Team Leader Email (e.g. 23bcs067@iiitdwd.ac.in)" onChange={validMail} className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <span className={`text-right text-sm whitespace-nowrap ${validMailmsg === 'invalid' ? 'text-red-500' : 'text-green-500'}`}>{validMailmsg}</span>
            </div>
            <div className="relative">
              <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={teamName} placeholder="Team Name" onChange={(e) => setteamName(e.target.value)} className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            {members.map((member, index) => (
              <div key={index} className="space-y-3 relative p-4 border border-purple-800 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Member {index + 1}</h4>
                <div className="relative">
                  <input type="text" value={member.name} placeholder={`Member ${index + 1} Name`} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} className="bg-gray-900/50 text-white w-full pl-4 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
                <div className="relative">
                  <input type="text" value={member.id} placeholder={`Member ${index + 1} ID`} onChange={(e) => handleMemberChange(index, 'id', e.target.value)} className="bg-gray-900/50 text-white w-full pl-4 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
                <button type="button" onClick={() => handleRemoveMember(index)} className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"><FaRegTimesCircle size={20} /></button>
              </div>
            ))}
            {members.length < 3 && (
              <button type="button" onClick={handleAddMember} className="w-full flex items-center justify-center bg-purple-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-purple-500 transition-colors">
                <FaPlus className="mr-2" /> Add Member
              </button>
            )}
            <button type="button" onClick={register} className="w-full bg-yellow-400 text-black font-bold px-4 py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
              Submit
            </button>
          </div>
        ) : (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">You have been registered successfully!</h2>
          </div>
        )}
        <Toaster position="top-right" toastOptions={{ className: "bg-gray-800 text-white" }} />
      </div>
    </div>
  );
};

export default EventRegistration;