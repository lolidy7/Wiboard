import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { handleFacebookSignUp } from "../thirdPartySignUp/facebookSignUp";
import { handleGoogleSignUp } from "../thirdPartySignUp/googleSignUp";


const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

export default function SignUpModal({ show, onClose, onSignUpSuccess }) {
  const { login, updateUser } = useAuth();
  const navigate = useNavigate();
  const [signUpError, setSignUpError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const GoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setSignUpError('');

    
    const { success, userData, error } = await handleGoogleSignUp(login);
    
    if (success) {
      setUserData(userData);
      setShowSuccessModal(true);
      onSignUpSuccess(userData);
      console.log(userData)
    } else {
      setSignUpError(error);
    }
    
    setIsGoogleLoading(false);
  };
  
  const FacebookSignUp = async () => {
    setIsFacebookLoading(true);
    setSignUpError('');
    
    const { success, userData, error } = await handleFacebookSignUp(login);
    
    if (success) {
      setUserData(userData);
      setShowSuccessModal(true);
      onSignUpSuccess(userData);
    } else {
      setSignUpError(error);
    }
    
    setIsFacebookLoading(false);
  };


  const handleSignUp = async (values, { setSubmitting }) => {
    try {
      // Step 1: Create new user
      const signupResponse = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          avatar: "https://i.pravatar.cc/300" // Default avatar
        })
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      // Step 2: Auto-login the new user
      const loginResponse = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Auto-login failed after signup');
      }
      const data = await loginResponse.json();
      const { access_token, refresh_token } = data;
      await login(access_token, refresh_token);
      
      // Step 3: Get user profile
      const profileResponse = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });

      const userData = await profileResponse.json();
      setUserData(userData);
      
      // Show avatar upload step
      setShowAvatarUpload(true);
      
    } catch (error) {
      console.error('Signup error:', error);
      setSignUpError(error.message || 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data with new avatar (simulated)
      const updatedUser = { ...userData, avatar: URL.createObjectURL(file) };
      updateUser(updatedUser); // Add this line
      setUserData(updatedUser);
      
      // Show success modal
      setShowAvatarUpload(false);
      setShowSuccessModal(true);
      
      // Notify parent component
      onSignUpSuccess(updatedUser);
      
    } catch (error) {
      console.error('Avatar upload error:', error);
      setSignUpError('Failed to upload avatar. Please try again.');
    }
  };

  const handleGoToHome = () => {
    setShowSuccessModal(false);
    onClose();
    navigate("/home")
    // In a real app, you would navigate to /home
    // For example, with react-router: navigate('/home');
  };

  return (
    <>
      {/* Main Sign Up Modal */}
      <Modal
        show={show && !showAvatarUpload && !showSuccessModal}
        onClose={onClose}
        size="md"
        popup
        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md"
      >
        <ModalHeader />
        <ModalBody>
          <LoginModal
            show={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                Sign Up Free
              </h3>
              <p className="text-primary-darkmode dark:text-primary">
                Already A Member?{" "}
                <span>
                  <button
                    className="text-primary-darkmode dark:text-primary text-sm font-medium"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Login
                  </button>
                </span>
              </p>
              {/* Social Login Buttons */}
              <div className="space-y-3 mt-4">
                <button
                  type="button"
                  onClick={GoogleSignUp}
                  disabled={isGoogleLoading}
                  className={`w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors dark:border-gray-600 dark:hover:bg-gray-900 dark:text-white ${isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGoogleLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </>
                  ) : (
                    <>
                      <img
                        src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                      />
                      Sign up with Google
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={FacebookSignUp}
                  disabled={isFacebookLoading}
                  className={`w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors dark:border-gray-600 dark:hover:bg-gray-900 dark:text-white ${isFacebookLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFacebookLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </>
                  ) : (
                    <>
                      <img
                        src="https://static.vecteezy.com/system/resources/thumbnails/016/716/447/small_2x/facebook-icon-free-png.png"
                        alt="Facebook"
                        className="w-5 h-5 mr-2"
                      />
                      Sign up with Facebook
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {signUpError && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                {signUpError}
              </div>
            )}

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignUpSchema}
              onSubmit={handleSignUp}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <div className="relative mt-5">
                      <Field
                        name="name"
                        id="name"
                        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                          errors.name && touched.name
                            ? "border-red-500"
                            : "border-gray-300"
                        } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="name"
                        className={`absolute text-sm ${
                          errors.name && touched.name
                            ? "text-gray-500 dark:text-gray-500"
                            : "text-gray-500 dark:text-gray-400"
                        } duration-300 transform -translate-y-7 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-7 left-1`}
                      >
                        Full Name
                      </label>
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-500"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <div className="relative mt-5">
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                          errors.email && touched.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className={`absolute text-sm ${
                          errors.email && touched.email
                            ? "text-gray-500 dark:text-gray-500"
                            : "text-gray-500 dark:text-gray-400"
                        } duration-300 transform -translate-y-7 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-7 left-1`}
                      >
                        Email Address
                      </label>
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-500"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="relative mt-5">
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                          errors.password && touched.password
                            ? "border-red-500"
                            : "border-gray-300"
                        } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="password"
                        className={`absolute text-sm ${
                          errors.password && touched.password
                            ? "text-gray-500 dark:text-gray-500"
                            : "text-gray-500 dark:text-gray-400"
                        } duration-300 transform -translate-y-7 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-7 left-1`}
                      >
                        Password
                      </label>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-500"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <div className="relative mt-5">
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                        placeholder=" "
                      />
                      <label
                        htmlFor="confirmPassword"
                        className={`absolute text-sm ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "text-gray-500 dark:text-gray-500"
                            : "text-gray-500 dark:text-gray-400"
                        } duration-300 transform -translate-y-7 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-7 left-1`}
                      >
                        Confirm Password
                      </label>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="mt-1 text-sm text-red-600 dark:text-red-500"
                    />
                  </div>

                  {/* Terms Text */}
                  <div className="text-gray-700 text-[13px] dark:text-gray-300">
                    <p>
                      By continuing, you agree to Wiboard terms of Service and
                      acknowledge you've read our Privacy Policy.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creating account..." : "Sign Up"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </ModalBody>
      </Modal>

      {/* Avatar Upload Modal */}
      <Modal
        show={showAvatarUpload}
        onClose={() => setShowAvatarUpload(false)}
        size="md"
        popup
        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
              Upload Your Avatar
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customize your profile with a photo
            </p>

            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
              <button
                onClick={() => {
                  setShowAvatarUpload(false);
                  setShowSuccessModal(true);
                  onSignUpSuccess(userData);
                }}
                className="mt-2 text-gray-600 dark:text-gray-300 text-sm underline"
              >
                Skip for now
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onClose={handleGoToHome}
        size="md"
        popup
        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
              Congratulations!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your account has been created successfully and you're now logged
              in.
            </p>

            {userData?.avatar && (
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="w-full">
              <button
                onClick={handleGoToHome}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Go to Home
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}