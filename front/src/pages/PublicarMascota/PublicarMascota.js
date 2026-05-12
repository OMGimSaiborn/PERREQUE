import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createPet, mapFrontendToBackend } from '../../services/petsService';
import './PublicarMascota.css';

const PublicarMascota = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isShelterUser = user?.role === 'SHELTER';
  const userShelterId =
    user?.shelterId != null && user?.shelterId !== '' ? String(user.shelterId) : '';

  const [formData, setFormData] = useState({
    tipo: 'adopcion',
    nombre: '',
    tipoAnimal: '',
    raza: '',
    sexo: '',
    color: '',
    edad: '',
    ubicacion: '',
    descripcion: '',
    contacto: '',
    telefono: '',
    imagen: null,
    shelterId: '',
  });

  useEffect(() => {
    if (isShelterUser && userShelterId) {
      setFormData((prev) => ({ ...prev, shelterId: userShelterId }));
    }
  }, [isShelterUser, userShelterId]);

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file
      });
    }
  };

  const validateForm = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.tipoAnimal) {
      nuevosErrores.tipoAnimal = 'El tipo de animal es requerido';
    }

    if (!formData.sexo) {
      nuevosErrores.sexo = 'El sexo es requerido';
    }

    if (!formData.ubicacion.trim()) {
      nuevosErrores.ubicacion = 'La ubicación es requerida';
    }

    if (isShelterUser) {
      if (!userShelterId) {
        nuevosErrores.shelterId = 'Tu cuenta refugio no tiene un ID asignado; contacta al administrador';
      }
    } else {
      const sid = (formData.shelterId || '').trim();
      if (!sid) {
        nuevosErrores.shelterId = 'Indica el ID del refugio al que se asocia la mascota';
      } else {
        const n = parseInt(sid, 10);
        if (!Number.isFinite(n) || n < 1) {
          nuevosErrores.shelterId = 'El ID del refugio debe ser un número válido';
        }
      }
    }

    // Validar edad si se proporciona
    if (formData.edad && isNaN(parseInt(formData.edad))) {
      nuevosErrores.edad = 'La edad debe ser un número';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el backend
      const resolvedShelterId = isShelterUser
        ? parseInt(userShelterId, 10)
        : parseInt(String(formData.shelterId).trim(), 10);

      const petData = {
        nombre: formData.nombre,
        tipoAnimal: formData.tipoAnimal,
        raza: formData.raza || '',
        sexo: formData.sexo,
        color: formData.color || '',
        edad: formData.edad ? parseInt(formData.edad) : null,
        edadNumero: formData.edad ? parseInt(formData.edad) : null,
        descripcion: formData.descripcion || '',
        ubicacion: formData.ubicacion,
        tipo: formData.tipo,
        shelterId: resolvedShelterId,
      };

      // Mapear al formato del backend
      const backendData = mapFrontendToBackend(petData);

      // Crear la mascota
      await createPet(backendData);

      const listPath = formData.tipo === 'adopcion' ? '/adopcion' : '/mascotas-perdidas';
      navigate(`${listPath}?shelter=${resolvedShelterId}`);
    } catch (error) {
      setErrorGeneral(error.message || 'Error al publicar el anuncio. Por favor, intenta de nuevo.');
      console.error('Error al crear mascota:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publicar-mascota-page">
      <div className="page-header">
        <h1>Publicar Anuncio</h1>
        <p>Comparte información sobre una mascota en adopción o perdida</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="publicar-form">
          {errorGeneral && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{errorGeneral}</span>
            </div>
          )}

          <div className="form-section">
            <h2>Tipo de Anuncio</h2>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo"
                  value="adopcion"
                  checked={formData.tipo === 'adopcion'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Mascota en Adopción</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipo"
                  value="perdida"
                  checked={formData.tipo === 'perdida'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Mascota Perdida</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h2>Refugio</h2>
            {isShelterUser ? (
              <div className="form-group">
                <label>Refugio asociado</label>
                <input
                  type="text"
                  readOnly
                  disabled={loading}
                  value={userShelterId ? `ID ${userShelterId} (tu refugio)` : 'Sin ID asignado'}
                  className="input-readonly"
                />
                {errores.shelterId && <span className="error-message">{errores.shelterId}</span>}
                <small>Las mascotas que publicas quedan vinculadas a tu refugio.</small>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="shelterId">ID del refugio *</label>
                <input
                  type="number"
                  id="shelterId"
                  name="shelterId"
                  min="1"
                  step="1"
                  value={formData.shelterId}
                  onChange={handleChange}
                  className={errores.shelterId ? 'error' : ''}
                  placeholder="Ej: 1"
                  disabled={loading}
                />
                {errores.shelterId && <span className="error-message">{errores.shelterId}</span>}
                <small>La mascota quedará afiliada a este refugio en el sistema.</small>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Información de la Mascota</h2>

            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errores.nombre ? 'error' : ''}
                placeholder="Nombre de la mascota"
                disabled={loading}
              />
              {errores.nombre && <span className="error-message">{errores.nombre}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoAnimal">Tipo de Animal *</label>
                <select
                  id="tipoAnimal"
                  name="tipoAnimal"
                  value={formData.tipoAnimal}
                  onChange={handleChange}
                  className={errores.tipoAnimal ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Selecciona...</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Otro">Otro</option>
                </select>
                {errores.tipoAnimal && <span className="error-message">{errores.tipoAnimal}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="raza">Raza</label>
                <input
                  type="text"
                  id="raza"
                  name="raza"
                  value={formData.raza}
                  onChange={handleChange}
                  placeholder="Ej: Labrador, Persa..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sexo">Sexo *</label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className={errores.sexo ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Selecciona...</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
                {errores.sexo && <span className="error-message">{errores.sexo}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ej: Marrón, Blanco..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edad">Edad (años)</label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej: 2"
                  className={errores.edad ? 'error' : ''}
                  disabled={loading}
                />
                {errores.edad && <span className="error-message">{errores.edad}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ubicacion">Ubicación *</label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className={errores.ubicacion ? 'error' : ''}
                placeholder="Ciudad, Provincia"
                disabled={loading}
              />
              {errores.ubicacion && <span className="error-message">{errores.ubicacion}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="5"
                placeholder="Describe a la mascota, su personalidad, características especiales..."
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="imagen">Imagen</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              <small>Formatos aceptados: JPG, PNG, GIF (máx. 5MB) - Opcional por ahora</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Publicando...' : 'Publicar Anuncio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicarMascota;

