import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h1 className="mb-3">Dashboard</h1>
            <p className="mb-1">
              Bienvenido, <strong>{user?.nombre} {user?.apellido}</strong>
            </p>
            <p className="mb-1">
              Correo: <strong>{user?.email}</strong>
            </p>
            <p className="mb-0">
              Rol: <strong>{user?.rol}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;