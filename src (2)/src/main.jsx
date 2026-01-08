import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./styles/variables.css";
import "./styles/components.css";

const root = document.getElementById("root");
createRoot(root).render(<App />);
