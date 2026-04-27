import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute/ProtectedAdminRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import Home from './pages/Home/Home';
import Adopcion from './pages/Adopcion/Adopcion';
import MascotasPerdidas from './pages/MascotasPerdidas/MascotasPerdidas';
import DetalleMascota from './pages/DetalleMascota/DetalleMascota';
import EditarMascota from './pages/EditarMascota/EditarMascota';
import PublicarMascota from './pages/PublicarMascota/PublicarMascota';
import Perfil from './pages/Perfil/Perfil';
import CrearUsuario from './pages/CrearUsuario/CrearUsuario';
import Login from './pages/Login/Login';
import Registro from './pages/Registro/Registro';
import './App.css';

// Componente que redirige según el estado de autenticación
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  // Si está autenticado, ir a home; si no, ir a login
  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Ruta raíz: redirige según autenticación */}
              <Route path="/" element={<RootRedirect />} />
              
              {/* Rutas públicas de autenticación */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/registro" 
                element={
                  <PublicRoute>
                    <Registro />
                  </PublicRoute>
                } 
              />
              
              {/* Rutas protegidas - requieren autenticación */}
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/adopcion" 
                element={
                  <ProtectedRoute>
                    <Adopcion />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mascotas-perdidas" 
                element={
                  <ProtectedRoute>
                    <MascotasPerdidas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mascota/:id" 
                element={
                  <ProtectedRoute>
                    <DetalleMascota />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mascota/:id/editar" 
                element={
                  <ProtectedAdminRoute>
                    <EditarMascota />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/publicar" 
                element={
                  <ProtectedAdminRoute>
                    <PublicarMascota />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/crear-usuario" 
                element={
                  <ProtectedAdminRoute>
                    <CrearUsuario />
                  </ProtectedAdminRoute>
                } 
              />
              
              {/* TODO: Agregar más rutas protegidas según necesites */}
              {/* Ejemplo:
              <Route 
                path="/mis-anuncios" 
                element={
                  <ProtectedRoute>
                    <MisAnuncios />
                  </ProtectedRoute>
                } 
              />
              */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

