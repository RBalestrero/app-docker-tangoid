import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm"
      style={{ backgroundColor: '#123C66' }}
    >
      <div className="container">
        <span
          className="navbar-brand fw-semibold"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          {import.meta.env.VITE_APP_NAME || 'Aplicación'}
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active fw-semibold' : ''}`
                }
              >
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/pedidos"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active fw-semibold' : ''}`
                }
              >
                Pedidos
              </NavLink>
            </li>
          </ul>

          <div className="ms-auto d-flex align-items-center gap-3 text-white">
            <span className="small">
              {user?.nombre} {user?.apellido} | {user?.rol}
            </span>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;