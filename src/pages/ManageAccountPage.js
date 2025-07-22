import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Lock, Edit3, Save, Shield, Camera, Activity, LogOut } from 'lucide-react';
import NavBar from '../component/NavBar.js';

const ManageAccountPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    user_name: '',
    phone_number: '',
    currentPassword: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState('account'); // State to manage active tab

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me', { withCredentials: true });
        setUser(response.data);
        setFormData({
          email: response.data.email || '',
          user_name: response.data.user_name || '',
          phone_number: response.data.phone_number || '',
          currentPassword: '',
          password: '',
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load account details. Please log in again.');
        navigate('/client-login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email' && value !== user.email) {
      setVerificationToken(null); // Reset verification if email changes
      setIsVerifyingEmail(false); // Also reset verification state
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@iiitdwd.ac.in$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.email && formData.email !== user.email && !verificationToken) {
        if (!validateEmail(formData.email)) {
          toast.error('Please enter a valid @iiitdwd.ac.in email address.');
          setLoading(false);
          return;
        }
        setIsVerifyingEmail(true);
        // In a real application, you'd send an email and get a token from there.
        // For demonstration, let's simulate the token generation.
        const response = await api.post(
          '/users/request-email-verification',
          { newEmail: formData.email },
          { withCredentials: true }
        );
        toast.success('Verification email sent. Please check your inbox and enter the token to verify.');
        setVerificationToken(response.data.verificationToken); // Assuming backend sends back a token to prompt user
        setIsVerifyingEmail(false);
        setLoading(false);
        return;
      }

      if (formData.password && !formData.currentPassword) {
        toast.error('Please enter your current password to change it.');
        setLoading(false);
        return;
      }
      if (formData.password && formData.password.length > 0 && !validatePassword(formData.password)) {
        toast.error('New password must be at least 8 characters long with uppercase, lowercase, number, and special character.');
        setLoading(false);
        return;
      }

      const updateData = {
        user_name: formData.user_name,
        phone_number: formData.phone_number,
        email: verificationToken ? formData.email : undefined, // Only update email if verified
        currentPassword: formData.currentPassword || undefined,
        password: formData.password || undefined,
      };

      // Remove undefined fields to avoid sending them if not changed
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      await api.put('/users/profile', updateData, { withCredentials: true });
      toast.success('Account updated successfully!');
      const response = await api.get('/users/me', { withCredentials: true });
      setUser(response.data);
      setFormData((prev) => ({ ...prev, currentPassword: '', password: '' }));
      setIsEditing(false);
      setVerificationToken(null); // Clear token after successful update
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to update account.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('avatar', file);
      try {
        const response = await api.post('/users/avatar', formDataToSend, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUser(response.data);
        toast.success('Avatar uploaded successfully!');
      } catch (error) {
        console.error('Avatar upload failed:', error.response?.data || error.message);
        toast.error(error.response?.data?.error || 'Failed to upload avatar.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please select an image file.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      toast.success('Logged out successfully!');
      navigate('/client-login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] flex items-center justify-center">
        <div className="text-center" aria-label="Loading account details">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] flex items-center justify-center">
        <p className="text-white">User data not available. Please log in.</p>
      </div>
    );
  }

  // Helper to format last login date
  const formatLastLogin = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString(); // Or use a more specific format
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-r from-[#2e1a47] to-[#624a82] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-200">Manage your personal information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/10 rounded-2xl shadow-xl p-6 sticky top-8 backdrop-blur-md">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User avatar"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-24 h-24 bg-gradient-to-br from-[#2e1a47] to-[#624a82] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                        aria-label="User avatar"
                      >
                        {user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-purple-400 hover:border-purple-300 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-purple-300" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{user.user_name || 'User'}</h3>
                  <p className="text-sm text-gray-300 mb-4">{user.email}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100/20 text-green-300">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                    Active
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all w-full text-left ${
                      activeTab === 'account'
                        ? 'bg-purple-700/50 text-white hover:bg-purple-600'
                        : 'text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                    aria-current={activeTab === 'account' ? 'page' : undefined}
                  >
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all w-full text-left ${
                      activeTab === 'security'
                        ? 'bg-purple-700/50 text-white hover:bg-purple-600'
                        : 'text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-all w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === 'account' && (
                <div className="bg-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                  <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Personal Information</h2>
                        <p className="text-gray-200">Update your account details and preferences</p>
                      </div>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center space-x-2"
                        aria-label={isEditing ? 'Cancel editing' : 'Edit account'}
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
                          <Mail className="w-4 h-4 text-purple-300" />
                          <span>Email Address</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing || isVerifyingEmail}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                              isEditing
                                ? 'border-gray-700/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20'
                                : 'border-gray-800/20 bg-gray-900/20 cursor-not-allowed'
                            }`}
                            required
                          />
                          {formData.email !== user.email && !verificationToken && isEditing && (
                            <p className="text-yellow-400 text-xs mt-1">
                              Changing email requires verification. Click Save to send verification email.
                            </p>
                          )}
                          {verificationToken && isEditing && (
                            <p className="text-green-400 text-xs mt-1">
                              Verification email sent. Your new email will be updated upon successful verification.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
                          <User className="w-4 h-4 text-purple-300" />
                          <span>Username</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                              isEditing
                                ? 'border-gray-700/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20'
                                : 'border-gray-800/20 bg-gray-900/20 cursor-not-allowed'
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
                          <Phone className="w-4 h-4 text-purple-300" />
                          <span>Phone Number</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                              isEditing
                                ? 'border-gray-700/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20'
                                : 'border-gray-800/20 bg-gray-900/20 cursor-not-allowed'
                            }`}
                            required
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
                              <Lock className="w-4 h-4 text-purple-300" />
                              <span>Current Password</span>
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password to change it"
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                                  isEditing
                                    ? 'border-gray-700/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20'
                                    : 'border-gray-800/20 bg-gray-900/20 cursor-not-allowed'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-200">
                              <Lock className="w-4 h-4 text-purple-300" />
                              <span>New Password</span>
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password (optional)"
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                                  isEditing
                                    ? 'border-gray-700/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20'
                                    : 'border-gray-800/20 bg-gray-900/20 cursor-not-allowed'
                                }`}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {isEditing && (
                      <div className="mt-8 pt-6 border-t border-gray-800/20">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">
                            Ensure your information is accurate and up to date.
                          </p>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                            aria-label="Save changes"
                            disabled={loading}
                          >
                            <Save className="w-5 h-5" />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                  <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] px-8 py-6">
                    <h2 className="text-2xl font-bold text-white mb-1">Security Settings</h2>
                    <p className="text-gray-200">Manage your account security and privacy</p>
                  </div>
                  <div className="p-8 space-y-8">
                    {/* Two-Factor Authentication Section */}
                    <div className="bg-white/5 rounded-xl p-6 border border-gray-700/30">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-indigo-100/20 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-200">Two-Factor Authentication (2FA)</h3>
                          <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Status:</span>
                        {user.two_factor_enabled ? (
                          <span className="text-green-400 font-medium flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>Enabled
                          </span>
                        ) : (
                          <span className="text-red-400 font-medium flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>Disabled
                          </span>
                        )}
                      </div>
                      <button
                        className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-all"
                        onClick={() => toast.success('2FA settings page would open here! Devs are still working on this')} // Placeholder action
                      >
                        {user.two_factor_enabled ? 'Manage 2FA' : 'Enable 2FA'}
                      </button>
                    </div>

                    {/* Login Activity Section */}
                    <div className="bg-white/5 rounded-xl p-6 border border-gray-700/30">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100/20 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-200">Login Activity</h3>
                          <p className="text-sm text-gray-400">Review recent logins to your account.</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Last login:</span>
                          <span className="text-gray-200">{user.last_login ? formatLastLogin(user.last_login) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Login from:</span>
                          <span className="text-gray-200">{user.last_login_ip || 'Unknown IP'}</span> {/* Assuming an IP field */}
                        </div>
                        <button
                          className="mt-4 text-purple-300 hover:underline"
                          onClick={() => toast.success('Full login history would be displayed here!')} // Placeholder action
                        >
                          View all activity
                        </button>
                      </div>
                    </div>

                    {/* Password Management Reminder */}
                    <div className="bg-white/5 rounded-xl p-6 border border-gray-700/30">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-yellow-100/20 rounded-xl flex items-center justify-center">
                          <Lock className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-200">Password Strength</h3>
                          <p className="text-sm text-gray-400">Keep your password strong and unique.</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">
                        It's recommended to change your password regularly and use a strong, unique combination of characters.
                      </p>
                      <button
                        className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
                        onClick={() => {
                          setActiveTab('account');
                          setIsEditing(true);
                          toast.success('Make your changes here!');
                        }}
                      >
                        Change Password Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAccountPage;