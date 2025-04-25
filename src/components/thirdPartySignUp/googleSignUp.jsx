import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export const handleGoogleSignUp = async (login) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userData = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL
    };

    const token = await user.getIdToken();
    const refreshToken = user.refreshToken;

    try {
      const signupResponse = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          password: user.uid,
          avatar: user.photoURL || "https://i.pravatar.cc/300"
        })
      });


      if (!signupResponse.ok && signupResponse.status !== 409) {
        throw new Error('Failed to create user in database');
      }
    } catch (error) {
      console.log("User might already exist, proceeding with login");
    }

    await login(token, refreshToken, userData);
    
    return {
      success: true,
      userData,
      error: null
    };
    
  } catch (error) {
    console.error('Google signup error:', error);
    
    let errorMessage = error.message || 'Google signup failed';
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different login method';
    }
    
    return {
      success: false,
      userData: null,
      error: errorMessage
    };
  }
};