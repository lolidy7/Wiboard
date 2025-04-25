import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user.name?.split(' ')[0] || '',
    lastName: user.name?.split(' ')[1] || '',
    bio: user.bio || '',
    username: user.username || '',
    avatar: user.avatar || ''
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ')[1] || '',
      bio: user.bio || '',
      username: user.username || '',
      avatar: user.avatar || ''
    });
    setAvatarPreview(user.avatar || '');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = {
        ...user,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        bio: formData.bio,
        username: formData.username,
        avatar: formData.avatar
      };
      
      // Here you would typically make an API call to save the changes to your backend
      // For example:
      // await api.updateProfile(updatedUser);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(updatedUser);
      
      // Show success toast
      toast.success('Profile updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error('Failed to update profile. Please try again.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className=" dark:bg-primary-darkmode -m-4 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full dark:text-white max-w-2xl">
          {/* Back Arrow */}
          <div className="flex items-center mb-4">
            <Link to={"/profile"}>
              <i className="fas fa-arrow-left text-black dark:text-white text-2xl cursor-pointer"></i>
            </Link>
          </div>

          {/* Header */}
          <h1 className="text-heading sm:text-2xl font-semibold text-center mb-2">Edit Profile</h1>
          <p className="text-center text-gray-500 text-paragraph sm:text-lg dark:text-white mb-6">
            Keep your personal details private. Information you add here is <br className="hidden sm:block" />
            visible to anyone who can view your profile.
          </p>

          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex justify-center mt-6 cursor-pointer" onClick={triggerFileInput}>
                <img
                  src={avatarPreview || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <span 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-200 text-black text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                onClick={triggerFileInput}
              >
                Photo
              </span>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4 px-4 sm:px-6 justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500"
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500"
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" htmlFor="bio">
                Bio
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500"
                id="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" htmlFor="username">
                Username
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500"
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <button 
              className="bg-green-600 text-white rounded-full px-10 py-2 text-lg font-semibold hover:bg-[#46F323] w-full sm:w-auto"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </button>
            <button 
              className="bg-green-600 text-white rounded-full px-10 py-2 text-lg font-semibold hover:bg-[#46F323] w-full sm:w-auto flex items-center justify-center"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save'}
            </button>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* FontAwesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </div>
    </>
  );
}