// Clear old tokens and force re-login
export const clearAuthAndReload = () => {
  localStorage.removeItem('auth');
  window.location.href = '/login';
};

// Check if token is expired and clear if needed
export const checkTokenExpiry = () => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  if (auth.accessToken) {
    try {
      const payload = JSON.parse(atob(auth.accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        console.log('Token expired, clearing auth');
        clearAuthAndReload();
      }
    } catch (error) {
      console.log('Invalid token format, clearing auth');
      clearAuthAndReload();
    }
  }
};