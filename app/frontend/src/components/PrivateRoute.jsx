import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

function PrivateRoute({ children }) {
  const { isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border" role="status"></div>
          <p className="mt-3 mb-0">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="app-content py-4">
        {children}
      </main>
    </>
  );
}

export default PrivateRoute;