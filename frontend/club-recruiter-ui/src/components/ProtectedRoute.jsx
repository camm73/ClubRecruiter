import { React } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../api/firebase';

const ProtectedRoute = ({ component }) => {
  const [user, loading, error] = useAuthState(auth);

  // Placeholder for login pending
  if (loading) {
    return (
      <div>
        <h1>Logging in user...</h1>
      </div>
    );
  }

  // Show error if login fails
  if (error) {
    return (
      <div>
        <h1>Failed to login user!</h1>
      </div>
    );
  }

  // Render component once authorized
  if (user) {
    return (
      <>
        {component}
      </>
    );
  }

  return (
    <div />
  );
};

export default ProtectedRoute;
