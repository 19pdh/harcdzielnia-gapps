import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import About from "./pages/About";
import logoLight from "./assets/logo-light.svg";
import pkg from "../package.json";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <header>
          <img
            src={logoLight}
            width="267"
            height="167"
            alt="Harcdzielnia logo"
          />
          <div>
            <h1 style={{ marginBottom: 0 }}>Harcdzielnia</h1>
            <p style={{ marginTop: 0, textAlign: "center" }}>
              Drugie życie mundurów
            </p>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer>
          <p>
            <a href="https://github.com/19pdh/harcdzielnia-gapps">
              Harcdzielnia v{pkg.version}
            </a>
          </p>
        </footer>
      </Router>
    </Provider>
  );
};

export default App;
