import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetDetails, mapBackendToFrontend } from '../../services/petsService';
import './DetalleMascota.css';

const DetalleMascota = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar detalles de la mascota al montar el componente
  useEffect(() => {
    const loadPetDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const petData = await getPetDetails(id);
        
        // Mapear los datos del backend al formato del frontend
        const mappedPet = mapBackendToFrontend(petData);
        setMascota(mappedPet);
      } catch (err) {
        setError(err.message || 'Error al cargar los detalles de la mascota');
        console.error('Error al cargar detalles de la mascota:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPetDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="detalle-mascota">
        <div className="loading-container">
          <div className="loading-spinner">Cargando detalles de la mascota...</div>
        </div>
      </div>
    );
  }

  if (error || !mascota) {
    return (
      <div className="detalle-mascota">
        <div className="error-message">
          <h2>Mascota no encontrada</h2>
          <p>{error || 'La mascota que buscas no existe o ha sido eliminada.'}</p>
          <button onClick={() => navigate('/home')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detalle-mascota">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Volver
      </button>

      <div className="detalle-container">
        <div className="detalle-imagen">
          {mascota.imagen ? (
            <img src={mascota.imagen} alt={mascota.nombre} />
          ) : (
            <div className="imagen-placeholder">
              <span className="placeholder-icon-large">🐾</span>
            </div>
          )}
        </div>

        <div className="detalle-info">
          <div className="detalle-header">
            <h1>{mascota.nombre}</h1>
            <span className={`badge ${mascota.estado}`}>
              {mascota.estado === 'adopcion' ? 'En Adopción' : 'Perdida'}
            </span>
          </div>

          <div className="detalle-datos">
            <div className="dato-item">
              <span className="dato-label">Tipo:</span>
              <span className="dato-valor">{mascota.tipo}</span>
            </div>
            {mascota.raza && (
              <div className="dato-item">
                <span className="dato-label">Raza:</span>
                <span className="dato-valor">{mascota.raza}</span>
              </div>
            )}
            {mascota.sexo && (
              <div className="dato-item">
                <span className="dato-label">Sexo:</span>
                <span className="dato-valor">{mascota.sexo}</span>
              </div>
            )}
            {mascota.color && (
              <div className="dato-item">
                <span className="dato-label">Color:</span>
                <span className="dato-valor">{mascota.color}</span>
              </div>
            )}
            {mascota.edad && (
              <div className="dato-item">
                <span className="dato-label">Edad:</span>
                <span className="dato-valor">{mascota.edad}</span>
              </div>
            )}
            <div className="dato-item">
              <span className="dato-label">📍 Ubicación:</span>
              <span className="dato-valor">{mascota.ubicacion}</span>
            </div>
          </div>

          {mascota.descripcion && (
            <div className="detalle-descripcion">
              <h3>Descripción</h3>
              <p>{mascota.descripcion}</p>
            </div>
          )}

          <div className="detalle-contacto">
            <h3>Información</h3>
            <p className="contacto-note">
              {mascota.estado === 'adopcion' 
                ? 'Si estás interesado en adoptar a esta mascota, puedes contactar a través de los canales oficiales de Perreque.'
                : 'Si has visto a esta mascota, por favor reporta el avistamiento a través de los canales oficiales de Perreque.'}
            </p>
            <button className="btn btn-primary btn-contacto">
              {mascota.estado === 'adopcion' ? 'Contactar para Adopción' : 'Reportar Avistamiento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleMascota;

