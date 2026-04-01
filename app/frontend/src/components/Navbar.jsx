import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">
          {import.meta.env.VITE_APP_NAME || 'Aplicación'}
        </span>

        <div className="ms-auto d-flex align-items-center gap-3 text-white">
          <span>
            {user?.nombre} {user?.apellido} | {user?.rol}
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;