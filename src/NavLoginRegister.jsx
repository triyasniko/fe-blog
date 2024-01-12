import { Link } from 'react-router-dom';

function NavLoginRegister() {
  return (
      <div className="d-flex justify-content-center">
        <ul className="nav nav-tabs mt-2">
          <li className="nav-item">
            <Link className="nav-link text-dark rounded-0" to="/login">Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark rounded-0" to="/register">Register</Link>
          </li>
        </ul>
      </div>
    );
}
export default NavLoginRegister;