import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  // No mostrar header en páginas de login/registro
  if (location.pathname === '/login' || location.pathname === '/registro') {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to={isAuthenticated ? "/home" : "/login"} className="logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">Perreque</span>
        </Link>
        
        <nav className="navigation">
          {isAuthenticated && (
            <>
              <Link 
                to="/home" 
                className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
              >
                Inicio
              </Link>
              <Link 
                to="/adopcion" 
                className={`nav-link ${location.pathname === '/adopcion' ? 'active' : ''}`}
              >
                Adopción
              </Link>
              <Link 
                to="/mascotas-perdidas" 
                className={`nav-link ${location.pathname === '/mascotas-perdidas' ? 'active' : ''}`}
              >
                Mascotas Perdidas
              </Link>
              <Link 
                to="/publicar" 
                className="nav-link nav-link-primary"
              >
                Publicar Anuncio
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-menu-button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Menú de usuario"
              >
                <span className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="user-name">{user?.name || 'Usuario'}</span>
                <span className="menu-arrow">▼</span>
              </button>
              
              {showMenu && (
                <div className="user-dropdown">
                  <Link 
                    to="/perfil" 
                    className="dropdown-item"
                    onClick={() => setShowMenu(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link 
                    to="/mis-anuncios" 
                    className="dropdown-item"
                    onClick={() => setShowMenu(false)}
                  >
                    Mis Anuncios
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item dropdown-item-danger"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;

