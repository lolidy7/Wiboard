import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import DarkModeToggler from "../components/darkmode/DarkModeToggler";
import AnimatedBackground from '../components/animatedBackground/AnimatedBackground';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export function LoginModal({ showModal, onClose }) {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      
      onClose(); // Close modal on successful login
      navigate("/home");
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      alert("Google login would be implemented here");
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      alert("Facebook login would be implemented here");
    } catch (err) {
      setError(err.message || 'Facebook login failed');
    }
  };


  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Add the animated background */}
      <AnimatedBackground />
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal container */}
        <div className="  inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full pt-10 duration-300">
          <div className="p-6 space-y-6">
            {/* Close button */}
            <div className="absolute top-0 right-0 pt-4 pr-4 w-full">
              <div className="flex justify-between pl-5">
                <DarkModeToggler />
                <button
                  className="text-gray-400 hover:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <Link to={"/"}>
                    <span className="sr-only">Home</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                  </Link>
                </button>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                {error}
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
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
                className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/016/716/447/small_2x/facebook-icon-free-png.png"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
                Sign in with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
              <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
                OR
              </span>
              <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            </div>

            {/* Formik Form */}
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  {/* Email Input */}
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

                  {/* Submit Button */}
                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Logging in..." : "Sign in"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Terms Text */}
            <div className="text-gray-700 text-[13px] dark:text-gray-300">
              <p>
                By continuing, you agree to Wiboard terms of Service and
                acknowledge you've read our Privacy Policy.
              </p>
            </div>

            {/* Sign Up Link */}
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
              >
                <span className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"> Sign up</span> 
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage in a parent component:
export default function LoginPageWithModal() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div>
      <LoginModal showModal={showModal} onClose={() => setShowModal(true)} />
    </div>
  );
}