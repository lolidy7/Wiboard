// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL
        };
        
      
        // Get the Firebase ID token
        const token = await firebaseUser.getIdToken();
        const refreshToken = firebaseUser.refreshToken;
        
        // Store in your auth system
        setUser(userData);
        setAuthTokens({
          access_token: token,
          refresh_token: refreshToken
        });
        
        // Store in localStorage
        localStorage.setItem('authTokens', JSON.stringify({
          access_token: token,
          refresh_token: refreshToken
        }));
      } else {
        // Check for existing tokens from your API
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        if (tokens) {
          setAuthTokens(tokens);
          await verifyToken(tokens.access_token);
        }
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const verifyToken = async (token) => {
  try {
    // First try verifying with your API
    const apiResponse = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (apiResponse.ok) {
      const userData = await apiResponse.json();
      setUser(userData);
      return;
    }

    // If API verification fails, try Firebase verification
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      if (token) {
        const userData = {
          id: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          avatar: currentUser.photoURL
        };
        setUser(userData);
        return;
      }
    }

    // If both verifications fail, logout
    logout();
  } catch (error) {
    console.error("Token verification error:", error);
    logout();
  }
};

  const login = async (accessToken, refreshToken, userData = null) => {
    const tokens = {
      access_token: accessToken,
      refresh_token: refreshToken
    };
    
    // Store tokens in localStorage
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    setAuthTokens(tokens);
    
    // If userData is provided, use it (for Firebase or signup flow)
    if (userData) {
      setUser(userData);
      setLoading(false);
    } else {
      // Otherwise fetch profile (for regular login)
      await verifyToken(accessToken);
    }
  };

  const logout = () => {
    // Sign out from Firebase if needed
    auth.signOut();
    localStorage.removeItem('authTokens');
    setUser(null);
    setAuthTokens(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      authTokens,
      login, 
      logout,
      updateUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);