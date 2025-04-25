import { auth, facebookProvider } from "../../firebase";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";

export const handleFacebookSignUp = async (login) => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    const userData = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL || `https://graph.facebook.com/${user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`
    };

    const token = await user.getIdToken();
    const refreshToken = user.refreshToken;

    try {
      await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          password: user.uid,
          avatar: userData.avatar
        })
      });
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
    console.error('Facebook signup error:', error);
    
    return {
      success: false,
      userData: null,
      error: error.message || 'Facebook signup failed'
    };
  }
};