import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { auth, googleProvider, facebookProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export default function LoginModal({ show, onClose }) {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const navigate = useNavigate();
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setError(null);
      const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { access_token, refresh_token } = data;
      await login(access_token, refresh_token);
      onClose();
      
      if (window.location.pathname === "/") {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the Firebase ID token
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;
  
      // Store tokens in your system
      const userData = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      };
  
      await login(token, refreshToken, userData);
      onClose();
      
      if (window.location.pathname === "/") {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      
      // Facebook provides additional credential info
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
  
      // Get the Firebase ID token
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;
  
      // Prepare user data
      const userData = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL || `https://graph.facebook.com/${user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`
      };
  
      // Login with Firebase tokens
      await login(token, refreshToken, userData);
      onClose();
      
      if (window.location.pathname === "/") {
        navigate("/home");
      }
    } catch (err) {
      console.error("Facebook login error:", err);
      setError(err.message || 'Facebook login failed');
      
      // Handle specific Facebook errors
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email but different sign-in method');
      }
    }
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      size="md"
      popup
      className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-lg"
    >
      <ModalHeader></ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
              Sign In To Wiboard
            </h3>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors dark:border-gray-600 dark:hover:bg-gray-900 dark:text-white disabled:opacity-50"
            >
              <img
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isFacebookLoading}
              className={`w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white ${
                isFacebookLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isFacebookLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/016/716/447/small_2x/facebook-icon-free-png.png"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
              )}
              {isFacebookLoading ? "Signing in..." : "Sign in with Facebook"}
            </button>
          </div>

          <div className="flex items-center">
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <div className="relative">
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
                          ? "text-gray-600 dark:text-gray-500"
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

                {/* Password Input */}
                <div>
                  <div className="relative mt-7">
                    <Field
                      type={showPassword ? "text" : "password"}
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
                          ? "text-gray-600 dark:text-gray-500"
                          : "text-gray-500 dark:text-gray-400"
                      } duration-300 transform -translate-y-7 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-7 left-1`}
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-500"
                  />
                </div>

                <div className="text-gray-700 text-[13px] dark:text-gray-300">
                  <p>
                    By continuing, you agree to Wiboard terms of Service and
                    acknowledge you've read our Privacy Policy.
                  </p>
                </div>

                <div className="w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </ModalBody>
    </Modal>
  );
}