import React from 'react';
import { Link } from 'react-router-dom';
import './MascotaCard.css';

const MascotaCard = ({ mascota }) => {
  const {
    id,
    nombre,
    tipo,
    raza,
    edad,
    imagen,
    estado, // 'adopcion' o 'perdida'
    ubicacion
  } = mascota;

  return (
    <Link to={`/mascota/${id}`} className="mascota-card">
      <div className="mascota-card-image">
        {imagen ? (
          <img src={imagen} alt={nombre} />
        ) : (
          <div className="mascota-card-placeholder">
            <span className="placeholder-icon">🐾</span>
          </div>
        )}
        <span className={`mascota-card-badge ${estado}`}>
          {estado === 'adopcion' ? 'En Adopción' : 'Perdida'}
        </span>
      </div>
      
      <div className="mascota-card-content">
        <h3 className="mascota-card-nombre">{nombre}</h3>
        <div className="mascota-card-info">
          <span className="info-item">
            <span className="info-label">Tipo:</span> {tipo}
          </span>
          {raza && (
            <span className="info-item">
              <span className="info-label">Raza:</span> {raza}
            </span>
          )}
          {edad && (
            <span className="info-item">
              <span className="info-label">Edad:</span> {edad}
            </span>
          )}
          {ubicacion && (
            <span className="info-item">
              <span className="info-label">📍</span> {ubicacion}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MascotaCard;

