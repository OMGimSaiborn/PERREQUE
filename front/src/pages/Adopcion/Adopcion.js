import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MascotaCard from '../../components/MascotaCard/MascotaCard';
import BuscarPorRefugio from '../../components/BuscarPorRefugio/BuscarPorRefugio';
import { useAuth } from '../../context/AuthContext';
import { getPetsByShelter, mapBackendToFrontend } from '../../services/petsService';
import './Adopcion.css';

const Adopcion = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeShelterId = searchParams.get('shelter') || '';
  const isShelterAccount = user?.role === 'SHELTER';
  const userShelterId =
    user?.shelterId != null && user?.shelterId !== '' ? String(user.shelterId) : null;
  const shelterProfileIncomplete = isShelterAccount && !userShelterId;
  /** Refugio cuyo listado se pide al API: SHELTER siempre el suyo; otros roles usan la URL. */
  const shelterIdForApi =
    isShelterAccount && userShelterId ? userShelterId : activeShelterId.trim();

  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filtros, setFiltros] = useState({
    tipo: '',
    ubicacion: '',
    busqueda: ''
  });

  useEffect(() => {
    if (!isShelterAccount || !userShelterId) return;
    if (activeShelterId !== userShelterId) {
      setSearchParams({ shelter: userShelterId }, { replace: true });
    }
  }, [isShelterAccount, userShelterId, activeShelterId, setSearchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadPets = async () => {
      if (shelterProfileIncomplete) {
        if (!cancelled) {
          setMascotas([]);
          setError('');
          setLoading(false);
        }
        return;
      }
      if (!shelterIdForApi) {
        if (!cancelled) {
          setMascotas([]);
          setError('');
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        setError('');
        const raw = await getPetsByShelter(shelterIdForApi);
        const availablePets = raw
          .filter((pet) => pet.status === 'AVAILABLE')
          .map((pet) => mapBackendToFrontend(pet));
        if (!cancelled) setMascotas(availablePets);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar las mascotas');
          console.error('Error al cargar mascotas:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPets();
    return () => {
      cancelled = true;
    };
  }, [shelterIdForApi, shelterProfileIncomplete]);

  const applyShelter = (id) => {
    setSearchParams(id ? { shelter: id } : {});
  };

  const clearShelter = () => {
    setSearchParams({});
  };

  const mascotasFiltradas = mascotas.filter((mascota) => {
    const coincideTipo = !filtros.tipo || mascota.tipo.toLowerCase() === filtros.tipo.toLowerCase();
    const coincideUbicacion =
      !filtros.ubicacion || mascota.ubicacion.toLowerCase().includes(filtros.ubicacion.toLowerCase());
    const coincideBusqueda =
      !filtros.busqueda ||
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
        {shelterProfileIncomplete && (
          <div className="error-alert" style={{ marginBottom: '1rem' }}>
            <span className="error-icon">⚠️</span>
            <span>
              Tu cuenta es de refugio pero no tiene un ID de refugio asignado. Pide a un administrador que
              actualice tu usuario en la base de datos.
            </span>
          </div>
        )}
        <BuscarPorRefugio
          lockedShelterId={isShelterAccount && userShelterId ? userShelterId : undefined}
          activeShelterId={isShelterAccount && userShelterId ? userShelterId : activeShelterId}
          onApply={applyShelter}
          onClear={clearShelter}
          disabled={loading || shelterProfileIncomplete}
        />
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
      ) : shelterProfileIncomplete ? (
        <div className="no-results no-results-hint">
          <p>No se puede cargar el listado hasta que tu usuario tenga un refugio asociado.</p>
        </div>
      ) : !shelterIdForApi ? (
        <div className="no-results no-results-hint">
          <p>Indica el ID del refugio arriba y pulsa <strong>Buscar</strong> para ver las mascotas en adopción de ese refugio.</p>
        </div>
      ) : (
        <div className="mascotas-grid">
          {mascotasFiltradas.length > 0 ? (
            mascotasFiltradas.map((mascota) => <MascotaCard key={mascota.id} mascota={mascota} />)
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
