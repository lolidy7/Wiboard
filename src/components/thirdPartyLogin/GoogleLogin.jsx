import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PropTypes from "prop-types";

export const useGoogleLogin = (auth, onClose) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;

      const userData = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      };

      await login(token, refreshToken, userData);
      onClose?.();
      
      if (window.location.pathname === "/") {
        navigate("/home");
      }

      return { success: true, user: userData };
    } catch (err) {
      console.error("Google login error:", err);
      
      let errorMessage = err.message || 'Google login failed';
      if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email but different sign-in method';
      }

      return { success: false, error: errorMessage };
    }
  };

  return { handleGoogleLogin };
};

GoogleLogin.propTypes = {
  auth: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};