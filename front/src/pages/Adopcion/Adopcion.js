import React, { useState, useEffect } from 'react';
import MascotaCard from '../../components/MascotaCard/MascotaCard';
import { getAllPets, mapBackendToFrontend } from '../../services/petsService';
import './Adopcion.css';

const Adopcion = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filtros, setFiltros] = useState({
    tipo: '',
    ubicacion: '',
    busqueda: ''
  });

  // Cargar mascotas al montar el componente
  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        setError('');
        const petsData = await getAllPets();
        
        // Filtrar solo mascotas disponibles (AVAILABLE) y mapear al formato del frontend
        const availablePets = petsData
          .filter(pet => pet.status === 'AVAILABLE')
          .map(pet => mapBackendToFrontend(pet));
        
        setMascotas(availablePets);
      } catch (err) {
        setError(err.message || 'Error al cargar las mascotas');
        console.error('Error al cargar mascotas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const mascotasFiltradas = mascotas.filter(mascota => {
    const coincideTipo = !filtros.tipo || mascota.tipo.toLowerCase() === filtros.tipo.toLowerCase();
    const coincideUbicacion = !filtros.ubicacion || mascota.ubicacion.toLowerCase().includes(filtros.ubicacion.toLowerCase());
    const coincideBusqueda = !filtros.busqueda || 
      mascota.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      (mascota.raza && mascota.raza.toLowerCase().includes(filtros.busqueda.toLowerCase()));

    return coincideTipo && coincideUbicacion && coincideBusqueda;
  });

  return (
    <div className="adopcion-page">
      <div className="page-header">
        <h1>Mascotas en Adopción</h1>
        <p>Encuentra a tu nuevo mejor amigo</p>
      </div>

      <div className="filtros-section">
        <div className="filtros-container">
          <input
            type="text"
            placeholder="Buscar por nombre o raza..."
            className="input-busqueda"
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
          />
          
          <select
            className="select-filtro"
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
          >
            <option value="">Todos los tipos</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>
          
          <input
            type="text"
            placeholder="Ubicación..."
            className="input-filtro"
            value={filtros.ubicacion}
            onChange={(e) => setFiltros({ ...filtros, ubicacion: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">Cargando mascotas...</div>
        </div>
      ) : error ? (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      ) : (
        <div className="mascotas-grid">
          {mascotasFiltradas.length > 0 ? (
            mascotasFiltradas.map(mascota => (
              <MascotaCard key={mascota.id} mascota={mascota} />
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron mascotas con esos filtros.</p>
              <p>Intenta ajustar tus criterios de búsqueda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Adopcion;

