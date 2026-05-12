import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MascotaCard from '../../components/MascotaCard/MascotaCard';
import Paginador from '../../components/Paginador/Paginador';
import BuscarPorRefugio from '../../components/BuscarPorRefugio/BuscarPorRefugio';
import { useAuth } from '../../context/AuthContext';
import { getPetsByShelter, mapBackendToFrontend } from '../../services/petsService';
import './MascotasPerdidas.css';

const MascotasPerdidas = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeShelterId = searchParams.get('shelter') || '';
  const isShelterAccount = user?.role === 'SHELTER';
  const userShelterId =
    user?.shelterId != null && user?.shelterId !== '' ? String(user.shelterId) : null;
  const shelterProfileIncomplete = isShelterAccount && !userShelterId;
  const shelterIdForApi =
    isShelterAccount && userShelterId ? userShelterId : activeShelterId.trim();

  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);

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
        const content = raw.filter((pet) => pet.status === 'LOST');
        if (!cancelled) {
          setMascotas(content.map((pet) => mapBackendToFrontend(pet)));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar las mascotas perdidas');
          console.error('Error al cargar mascotas perdidas:', err);
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
    setPage(0);
    setSearchParams(id ? { shelter: id } : {});
  };

  const clearShelter = () => {
    setPage(0);
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
          <p>
            Si has visto alguna de estas mascotas, por favor reporta el avistamiento. Los servicios de
            contacto estarán disponibles próximamente.
          </p>
        </div>
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
          <div className="loading-spinner">Cargando mascotas perdidas...</div>
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
          <p>Indica el ID del refugio arriba y pulsa <strong>Buscar</strong> para ver las mascotas perdidas reportadas por ese refugio.</p>
        </div>
      ) : (
        <>
          <div className="mascotas-grid">
            {mascotasPagina.length > 0 ? (
              mascotasPagina.map((mascota) => <MascotaCard key={mascota.id} mascota={mascota} />)
            ) : (
              <div className="no-results">
                <p>No se encontraron mascotas perdidas con esos filtros.</p>
                <p>Intenta ajustar tus criterios de búsqueda.</p>
              </div>
            )}
          </div>
          {totalElements > 0 && (
            <Paginador
              currentPage={pageClamped}
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
