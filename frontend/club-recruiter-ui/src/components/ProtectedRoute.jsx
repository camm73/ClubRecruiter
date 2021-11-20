import { React } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useHistory } from 'react-router-dom';
import { auth } from '../api/firebase';

const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  // Placeholder for login pending
  if (loading) {
    return (
      <div />
    );
  }

  // Show error if login fails
  if (error) {
    setTimeout(() => {
      history.push('/');
    }, 2500);
    return (
      <div>
        <h1>Failed to login user! Redirecting to homepage...</h1>
      </div>
    );
  }

  // Render component once authorized
  if (user) {
    return (
      <>
        {children}
      </>
    );
  }

  // Redirect to homepage
  history.push('/');
  return (
    <div>
      <h1> Logged out </h1>
    </div>
  );
};

export default ProtectedRoute;
