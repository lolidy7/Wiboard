import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FacebookLoginComponent = ({ 
  auth, 
  onClose, 
  onSuccess, 
  onError, 
  children,
  disabled = false,
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;

      const userData = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL || 
               `https://graph.facebook.com/${user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`
      };

      await login(token, refreshToken, userData);
      
      if (onSuccess) onSuccess(userData);
      if (onClose) onClose();
      
      if (window.location.pathname === '/') {
        navigate('/home');
      }
    } catch (err) {
      console.error("Facebook login error:", err);
      
      let errorMessage = err.message || 'Facebook login failed';
      if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email but different sign-in method';
      }
      
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors dark:border-gray-600 dark:hover:bg-gray-900 dark:text-white ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <>
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
          Signing in...
        </>
      ) : (
        <>
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/016/716/447/small_2x/facebook-icon-free-png.png"
            alt="Facebook"
            className="w-5 h-5 mr-2"
          />
          {children || "Sign in with Facebook"}
        </>
      )}
    </button>
  );
};

FacebookLoginComponent.propTypes = {
  auth: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object
};

export default FacebookLoginComponent;