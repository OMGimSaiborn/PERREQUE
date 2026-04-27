import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetDetails, updatePet, mapBackendToFrontend, mapFrontendToBackendUpdate } from '../../services/petsService';
import './EditarMascota.css';

const EditarMascota = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    color: '',
    edad: '',
    descripcion: '',
    ubicacion: '',
    estado: 'adopcion',
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar datos de la mascota al montar
  useEffect(() => {
    const loadPetData = async () => {
      try {
        setLoadingData(true);
        const petData = await getPetDetails(id);
        const mappedPet = mapBackendToFrontend(petData);
        
        // Extraer número de edad
        let edadNumero = mappedPet.edadNumero || '';
        if (typeof mappedPet.edad === 'string' && mappedPet.edad) {
          const ageMatch = mappedPet.edad.match(/(\d+)/);
          edadNumero = ageMatch ? ageMatch[1] : '';
        }

        setFormData({
          nombre: mappedPet.nombre || '',
          raza: mappedPet.raza || '',
          color: mappedPet.color || '',
          edad: edadNumero,
          descripcion: mappedPet.descripcion || '',
          ubicacion: mappedPet.ubicacion || '',
          estado: mappedPet.estado || 'adopcion',
        });
      } catch (err) {
        setErrorGeneral(err.message || 'Error al cargar los datos de la mascota');
        console.error('Error al cargar datos de la mascota:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      loadPetData();
    }
  }, [id]);

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
    if (errorGeneral) {
      setErrorGeneral('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.ubicacion.trim()) {
      nuevosErrores.ubicacion = 'La ubicación es requerida';
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
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el backend (solo los campos que acepta el endpoint)
      const petData = {
        nombre: formData.nombre,
        raza: formData.raza || '',
        color: formData.color || '',
        edad: formData.edad ? parseInt(formData.edad) : null,
        edadNumero: formData.edad ? parseInt(formData.edad) : null,
        descripcion: formData.descripcion || '',
        ubicacion: formData.ubicacion,
        estado: formData.estado,
      };

      // Mapear al formato del backend para actualización
      const backendData = mapFrontendToBackendUpdate(petData);

      // Actualizar la mascota
      await updatePet(id, backendData);

      setSuccessMessage('Mascota actualizada exitosamente');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate(`/mascota/${id}`);
      }, 1500);
    } catch (error) {
      setErrorGeneral(error.message || 'Error al actualizar la mascota. Por favor, intenta de nuevo.');
      console.error('Error al actualizar mascota:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="editar-mascota-page">
        <div className="loading-container">
          <div className="loading-spinner">Cargando datos de la mascota...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-mascota-page">
      <div className="page-header">
        <h1>Editar Mascota</h1>
        <p>Actualiza la información de la mascota</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="editar-form">
          {errorGeneral && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{errorGeneral}</span>
            </div>
          )}

          {successMessage && (
            <div className="success-alert">
              <span className="success-icon">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

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
              <label htmlFor="estado">Estado *</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={loading}
                className="select-estado"
              >
                <option value="adopcion">En Adopción (AVAILABLE)</option>
                <option value="adoptada">Adoptada (ADOPTED)</option>
                <option value="perdida">Perdida (LOST)</option>
              </select>
              <small className="estado-hint">
                Selecciona el estado actual de la mascota
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/mascota/${id}`)} 
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarMascota;
