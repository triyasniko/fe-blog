import { Link } from 'react-router-dom';

function NavLoginRegister() {
  return (
      <div className="container d-flex justify-content-center flex-column mt-5 w-50">
            <Link className="btn btn-outline-primary btn-sm my-2" to="/login">Login</Link>
            <Link className="btn btn-outline-primary btn-sm" to="/register">Register</Link>
      </div>
    );
}
export default NavLoginRegister;