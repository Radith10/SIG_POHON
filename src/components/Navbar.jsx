import { NavLink } from "react-router-dom";
import "../styles/components.css";

export default function Navbar() {
  return (
    <nav className={`navbar navbar-transparent`}>
      <div className="navbar-inner">
        <div className="navbar-logo">ProyekSIG</div>

        <ul className="navbar-menu">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/peta">Peta</NavLink>
          </li>
          <li>
            <NavLink to="/visualisasi">Visualisasi</NavLink>
          </li>
          <li>
            <NavLink to="/insight">Insight</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/peta">Peta</NavLink>
          </li>
          <li>
            <NavLink to="/visualisasi">Visualisasi</NavLink>
          </li>
          <li>
            <NavLink to="/dataset">Dataset</NavLink>
          </li>
          <li>
            <NavLink to="/insight">Insight</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
