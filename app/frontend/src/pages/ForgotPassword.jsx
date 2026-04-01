import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5 text-center">
                <h2 className="mb-3">Recuperar contraseña</h2>
                <p className="text-muted">
                  Esta funcionalidad todavía no está disponible porque el backend
                  aún no tiene endpoint para recuperación.
                </p>

                <Link to="/login" className="btn btn-primary mt-3">
                  Volver al login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;