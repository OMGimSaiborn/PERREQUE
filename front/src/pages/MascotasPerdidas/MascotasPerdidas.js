import React, { useState, useEffect } from 'react';
import MascotaCard from '../../components/MascotaCard/MascotaCard';
import Paginador from '../../components/Paginador/Paginador';
import { getPetsLost, mapBackendToFrontend } from '../../services/petsService';
import './MascotasPerdidas.css';

const SIZE_FETCH_ALL = 9999;

const MascotasPerdidas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);

  const [filtros, setFiltros] = useState({
    tipo: '',
    ubicacion: '',
    busqueda: ''
  });

  const loadPets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getPetsLost(SIZE_FETCH_ALL);
      const content = Array.isArray(response) ? response : (response.content || []);
      setMascotas(content.map(pet => mapBackendToFrontend(pet)));
    } catch (err) {
      setError(err.message || 'Error al cargar las mascotas perdidas');
      console.error('Error al cargar mascotas perdidas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const totalElements = mascotasFiltradas.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const pageClamped = Math.min(page, totalPages - 1);
  const mascotasPagina = mascotasFiltradas.slice(pageClamped * size, pageClamped * size + size);

  useEffect(() => {
    if (page >= totalPages && totalPages > 0) setPage(0);
  }, [totalPages]);

  return (
    <div className="mascotas-perdidas-page">
      <div className="page-header">
        <h1>Mascotas Perdidas</h1>
        <p>Ayuda a reunir a estas mascotas con sus familias</p>
      </div>

      <div className="alerta-section">
        <div className="alerta-box">
          <span className="alerta-icon">⚠️</span>
          <p>Si has visto alguna de estas mascotas, por favor reporta el avistamiento. Los servicios de contacto estarán disponibles próximamente.</p>
        </div>
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
          <div className="loading-spinner">Cargando mascotas perdidas...</div>
        </div>
      ) : error ? (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="mascotas-grid">
            {mascotasPagina.length > 0 ? (
              mascotasPagina.map(mascota => (
                <MascotaCard key={mascota.id} mascota={mascota} />
              ))
            ) : (
              <div className="no-results">
                <p>No se encontraron mascotas perdidas con esos filtros.</p>
                <p>Intenta ajustar tus criterios de búsqueda.</p>
              </div>
            )}
          </div>
          {totalElements > 0 && (
            <Paginador
              currentPage={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={size}
              onPageChange={setPage}
              onSizeChange={(newSize) => {
                setSize(newSize);
                setPage(0);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MascotasPerdidas;
