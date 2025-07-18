import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Lock, Edit3, Save, Shield, Camera } from 'lucide-react';
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
  // eslint-disable-next-line no-unused-vars
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

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
        toast.error('Failed to load account details.');
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
        const response = await api.post(
          '/users/request-email-verification',
          { newEmail: formData.email },
          { withCredentials: true }
        );
        toast.success('Verification email sent. Please check your inbox.');
        setVerificationToken(response.data.verificationToken);
        setIsVerifyingEmail(false);
        setLoading(false);
        return;
      }

      if (formData.password && !formData.currentPassword) {
        toast.error('Please enter your current password to change it.');
        setLoading(false);
        return;
      }
      if (formData.password && !validatePassword(formData.password)) {
        toast.error('Password must be at least 8 characters long with uppercase, lowercase, number, and special character.');
        setLoading(false);
        return;
      }

      const updateData = {
        user_name: formData.user_name,
        phone_number: formData.phone_number,
        email: verificationToken ? formData.email : undefined,
        currentPassword: formData.currentPassword,
        password: formData.password,
      };
      await api.put('/users/profile', updateData, { withCredentials: true });
      toast.success('Account updated successfully!');
      const response = await api.get('/users/me', { withCredentials: true });
      setUser(response.data);
      setFormData((prev) => ({ ...prev, currentPassword: '', password: '' }));
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to update account.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file); // Debug: Log the selected file
    if (file) {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('avatar', file);
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value.name || value}`); // Debug: Log FormData entries
      }
      try {
        const response = await api.post('/users/avatar', formDataToSend, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Avatar upload response:', response.data); // Debug: Log response
        setUser(response.data);
        toast.success('Avatar uploaded successfully!');
      } catch (error) {
        console.error('Avatar upload failed:', error.response?.data || error.message);
        toast.error(error.response?.data?.error || 'Failed to upload avatar.');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('No file selected'); // Debug: Log if no file is selected
      toast.error('Please select an image file.');
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
        <p className="text-white">User data not available.</p>
      </div>
    );
  }

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
                  <a
                    href="#account"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-purple-700/50 text-white font-medium transition-all hover:bg-purple-600"
                    aria-current="page"
                  >
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </a>
                  <a
                    href="#security"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Security</span>
                  </a>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
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
                              disabled={!isEditing}
                              placeholder={isEditing ? 'Enter current password' : '••••••••'}
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
                              disabled={!isEditing}
                              placeholder={isEditing ? 'Enter new password' : '••••••••'}
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
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 rounded-2xl shadow-lg p-6 backdrop-blur-md">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">Security Status</h3>
                      <p className="text-sm text-gray-400">Your account is secure</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Two-factor authentication</span>
                      <span className="text-green-300 font-medium">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last login</span>
                      <span className="text-gray-200">Today, 2:30 PM</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl shadow-lg p-6 backdrop-blur-md">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100/20 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">Account Activity</h3>
                      <p className="text-sm text-gray-400">Recent account updates</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Profile updated</span>
                      <span className="text-gray-200">3 days ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Password changed</span>
                      <span className="text-gray-200">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAccountPage;