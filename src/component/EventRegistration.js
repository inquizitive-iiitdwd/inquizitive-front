import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api.js';
import { FaEnvelope, FaUser, FaIdCard, FaUsers, FaTimes } from 'react-icons/fa';

const EventRegistration = ({ isOpen, onClose }) => {
  const [teamLeaderName, setteamLeaderName] = useState('');
  const [teamLeaderId, setteamLeaderId] = useState('');
  const [leadMailId, setleadMailId] = useState('');
  const [teamName, setteamName] = useState('');
  const [MemberI, setMemberI] = useState('');
  const [MemberIid, setMemberIid] = useState('');
  const [MemberII, setMemberII] = useState('');
  const [MemberIIid, setMemberIIid] = useState('');
  const [validMailmsg, setvalidMailmsg] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const modalRef = useRef(null);

  // Handle Escape key press to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Memoize handleClickOutside to prevent unnecessary re-renders
  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  // Handle click outside modal to close
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  // Return null if modal is not open
  if (!isOpen) return null;

  const emailVerification = (email) => {
    const mail = document.getElementById('email');
    if (email.endsWith('@iiitdwd.ac.in')) {
      setvalidMailmsg('valid');
      mail.classList.remove('border-red-500');
      mail.classList.add('border-green-500');
    } else {
      setvalidMailmsg('invalid');
      mail.classList.remove('border-green-500');
      mail.classList.add('border-red-500');
    }
  };

  const register = async () => {
    try {
      const set = new Set([
        teamLeaderId.toLowerCase(),
        MemberIid.toLowerCase(),
        MemberIIid.toLowerCase()
      ]);
      const members = [...set];

      if (!teamLeaderName || !teamLeaderId || !leadMailId || !teamName || !MemberI || !MemberIid || !MemberII || !MemberIIid) {
        alert("Please enter all the details");
        return;
      }

      if (teamLeaderId.length !== 8) {
        toast.error("Invalid Team Lead ID");
        return;
      }

      if (MemberIid.length !== 8 || MemberIIid.length !== 8) {
        toast.error("Invalid Team Member's ID");
        return;
      }

      if (!leadMailId.endsWith('@iiitdwd.ac.in')) {
        toast.error("Invalid Email-ID");
        return;
      }

      if ((leadMailId.slice(0, 8)).toLowerCase() !== teamLeaderId.toLowerCase()) {
        toast.error("Team Lead mail ID does not match with the team lead ID");
        return;
      }

      if (members.length !== 3) {
        toast.error("All the team members need to be different");
        return;
      }

      const data = {
        teamLeaderName,
        teamLeaderId: members.find(m => m === teamLeaderId.toLowerCase()),
        leadMailId,
        teamName,
        MemberI,
        MemberIid: members.find(m => m === MemberIid.toLowerCase()),
        MemberII,
        MemberIIid: members.find(m => m === MemberIIid.toLowerCase())
      };

      const response = await api.post('/events/eventRegistration', { data }, { withCredentials: true });

      if (response.data.ok) {
        setIsRegistered(true);
        toast.success("Your team is registered successfully");
      } else {
        if (response.data.RteamName) toast.error("Team Name already exists");
        else if (response.data.RmailID) toast.error("Email ID is repeated");
        else if (response.data.Rteamlead) toast.error("Team lead has registered");
        else if (response.data.RteamMates) toast.error("Team Mates have already registered");
        else toast.error("Failed to register");
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
          <form className="space-y-5">
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={teamLeaderName}
                placeholder="Team Leader Name"
                onChange={(e) => setteamLeaderName(e.target.value)}
                className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="relative">
              <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={teamLeaderId}
                placeholder="Team Leader ID"
                onChange={(e) => setteamLeaderId(e.target.value)}
                className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={leadMailId}
                placeholder="Team Leader Email"
                onChange={validMail}
                className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <span className={`block text-right mt-1 text-sm ${validMailmsg === 'invalid' ? 'text-red-500' : 'text-green-500'}`}>
                {validMailmsg}
              </span>
            </div>

            <div className="relative">
              <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={teamName}
                placeholder="Team Name"
                onChange={(e) => setteamName(e.target.value)}
                className="bg-gray-900/50 text-white w-full pl-12 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {[{
              name: MemberI,
              id: MemberIid,
              setName: setMemberI,
              setId: setMemberIid,
              label: "Member I"
            }, {
              name: MemberII,
              id: MemberIIid,
              setName: setMemberII,
              setId: setMemberIIid,
              label: "Member II"
            }].map((member, index) => (
              <div key={index} className="space-y-3">
                <input
                  type="text"
                  value={member.name}
                  placeholder={`${member.label} Name`}
                  onChange={(e) => member.setName(e.target.value)}
                  className="bg-gray-900/50 text-white w-full pl-4 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="text"
                  value={member.id}
                  placeholder={`${member.label} ID`}
                  onChange={(e) => member.setId(e.target.value)}
                  className="bg-gray-900/50 text-white w-full pl-4 pr-4 py-3 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={register}
              className="w-full bg-yellow-400 text-black font-bold px-4 py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">You have been registered successfully!</h2>
          </div>
        )}

        <Toaster
          position="top-right"
          toastOptions={{
            className: "bg-gray-800 text-white"
          }}
        />
      </div>
    </div>
  );
};

export default EventRegistration;