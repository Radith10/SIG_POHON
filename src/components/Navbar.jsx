import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.wrapper}>
        <div style={styles.logo}>ProyekSIG</div>

        <ul style={styles.menu}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/peta" style={styles.link}>Peta</Link></li>
          <li><Link to="/visualisasi" style={styles.link}>Visualisasi</Link></li>
          <li><Link to="/insight" style={styles.link}>Insight</Link></li>
          <li><Link to="/contact" style={styles.link}>Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    height: "60px",
    background: "#1e1e1e",
    display: "flex",
    alignItems: "center",
    position: "fixed",
    top: 0,
    zIndex: 5000,
  },

  wrapper: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },

  logo: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },

  menu: {
    display: "flex",
    gap: "20px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },

  link: {
    color: "white",
    fontSize: "16px",
    textDecoration: "none",
  },
};
