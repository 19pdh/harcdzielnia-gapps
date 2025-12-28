import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import About from './pages/About';
import logoLight from './assets/logo-light.svg';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <header>
          <Link to="/">
            <img alt="Harcdzielnia logo" className="logo" src={logoLight} width="125" height="125" />
          </Link>
          <div className="wrapper">
            <nav>
              <Link to="/">Harcdzielnia</Link>
              {' | '}
              <Link to="/about">O nas</Link>
            </nav>
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
          <p>&copy; {new Date().getFullYear()} Harcdzielnia</p>
        </footer>
      </Router>
    </Provider>
  );
};

export default App;
