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
  className = '',
  disabled = false,
  style = {} 
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
      onClick={handleLogin}
      disabled={disabled || loading}
      className={`
        bg-blue-600 hover:bg-blue-700 
        text-white font-medium 
        py-2 px-4 rounded-md
        transition-colors duration-300
        flex items-center justify-center gap-2
        disabled:bg-gray-400 disabled:cursor-not-allowed
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
          {children || 'Continue with Facebook'}
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