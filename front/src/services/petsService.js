/**
 * Servicio para manejar las operaciones relacionadas con mascotas
 * 
 * Endpoints:
 * - GET http://localhost:8080/pets/shelter/{shelterId} - Mascotas de un refugio (listados por refugio)
 * - GET http://localhost:8080/pets/details/{id} - Obtener detalles de una mascota
 * - POST http://localhost:8080/pets - Crear una nueva mascota
 */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Mascotas asociadas a un refugio: GET /pets/shelter/{shelterId}.
 * Para sesiones con rol SHELTER, el front debe pasar siempre el shelterId del usuario (no el de la URL).
 *
 * @param {number|string} shelterId - ID del refugio a consultar
 * @returns {Promise<Array>} Lista de mascotas en formato backend
 */
export const getPetsByShelter = async (shelterId) => {
  try {
    const token = localStorage.getItem('token');
    const id = String(shelterId).trim();
    if (!id) {
      throw new Error('Indica un ID de refugio');
    }
    const qs = new URLSearchParams({ page: '0', size: '5000' });
    const response = await fetch(
      `${API_BASE_URL}/pets/shelter/${encodeURIComponent(id)}?${qs}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        errorData.error ||
        `Error al obtener mascotas del refugio (${response.status})`
      );
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data.content && Array.isArray(data.content)) return data.content;
    return [];
  } catch (error) {
    console.error('Error al obtener mascotas por refugio:', error);
    throw error;
  }
};

/**
 * Obtiene los detalles de una mascota por su ID
 * 
 * @param {number|string} petId - ID de la mascota
 * @returns {Promise<Object>} Detalles de la mascota
 */
export const getPetDetails = async (petId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/pets/details/${petId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        errorData.error ||
        `Error al obtener los detalles de la mascota (${response.status})`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener detalles de la mascota:', error);
    throw error;
  }
};

/**
 * Crea una nueva mascota
 * 
 * @param {Object} petData - Datos de la mascota
 * @param {string} petData.name - Nombre de la mascota
 * @param {string} petData.species - Especie (DOG, CAT, OTHER)
 * @param {string} petData.breed - Raza
 * @param {string} petData.sex - Sexo (MALE, FEMALE)
 * @param {string} petData.color - Color
 * @param {number} petData.age - Edad
 * @param {string} petData.description - Descripción
 * @param {string} petData.location - Ubicación
 * @param {string} petData.status - Estado (AVAILABLE, ADOPTED, LOST)
 * @returns {Promise<Object>} Mascota creada
 */
export const createPet = async (petData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        errorData.error ||
        `Error al crear la mascota (${response.status})`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear mascota:', error);
    throw error;
  }
};

/**
 * Convierte los datos del backend al formato del frontend
 * 
 * @param {Object} backendPet - Mascota del backend
 * @returns {Object} Mascota en formato del frontend
 */
export const mapBackendToFrontend = (backendPet) => {
  // Mapear species: DOG/CAT/OTHER -> Perro/Gato/Otro
  const speciesMap = {
    DOG: 'Perro',
    CAT: 'Gato',
    OTHER: 'Otro',
  };

  // Mapear status: AVAILABLE/ADOPTED/LOST -> adopcion/perdida/adoptada
  const statusMap = {
    AVAILABLE: 'adopcion',
    ADOPTED: 'adoptada',
    LOST: 'perdida',
  };

  // Mapear sex: MALE/FEMALE -> Macho/Hembra
  const sexMap = {
    MALE: 'Macho',
    FEMALE: 'Hembra',
  };

  return {
    id: backendPet.petId,
    shelterId: backendPet.shelterId,
    nombre: backendPet.name,
    tipo: speciesMap[backendPet.species] || backendPet.species,
    raza: backendPet.breed || '',
    sexo: sexMap[backendPet.sex] || backendPet.sex,
    color: backendPet.color || '',
    edad: backendPet.age ? `${backendPet.age} ${backendPet.age === 1 ? 'año' : 'años'}` : '',
    edadNumero: backendPet.age, // Guardamos el número para filtros
    descripcion: backendPet.description || '',
    ubicacion: backendPet.location || '',
    estado: statusMap[backendPet.status] || backendPet.status,
    estadoBackend: backendPet.status, // Guardamos el estado original
    imagen: (backendPet.images && backendPet.images.length > 0) 
            ? backendPet.images[0] 
            : 'https://via.placeholder.com/400x300?text=Sin+Imagen',
    ownerId: backendPet.ownerId,
    createdAt: backendPet.createdAt,
  };
};

/**
 * Convierte los datos del frontend al formato del backend
 * 
 * @param {Object} frontendPet - Mascota del frontend
 * @returns {Object} Mascota en formato del backend
 */
export const mapFrontendToBackend = (frontendPet) => {
  // Mapear tipo: Perro/Gato/Otro -> DOG/CAT/OTHER
  const typeMap = {
    Perro: 'DOG',
    Gato: 'CAT',
    Otro: 'OTHER',
  };

  // Mapear estado: adopcion/perdida -> AVAILABLE/LOST
  const statusMap = {
    adopcion: 'AVAILABLE',
    perdida: 'LOST',
    adoptada: 'ADOPTED',
  };

  // Mapear sexo: Macho/Hembra -> MALE/FEMALE
  const sexMap = {
    Macho: 'MALE',
    Hembra: 'FEMALE',
  };

  // Extraer número de edad si viene como string "2 años"
  let age = frontendPet.age;
  if (typeof age === 'string') {
    const ageMatch = age.match(/(\d+)/);
    age = ageMatch ? parseInt(ageMatch[1]) : null;
  }

  const sid = frontendPet.shelterId;
  const shelterId =
    sid === '' || sid === undefined || sid === null ? null : parseInt(String(sid), 10);

  return {
    shelterId: Number.isFinite(shelterId) ? shelterId : null,
    name: frontendPet.nombre,
    species: typeMap[frontendPet.tipoAnimal] || frontendPet.tipoAnimal,
    breed: frontendPet.raza || '',
    sex: sexMap[frontendPet.sexo] || frontendPet.sexo,
    color: frontendPet.color || '',
    age: age || frontendPet.edadNumero || null,
    description: frontendPet.descripcion || '',
    location: frontendPet.ubicacion || '',
    status: statusMap[frontendPet.tipo] || frontendPet.tipo,
  };
};

export const mapFrontendToBackendUpdate = (frontendPet) => {
  const statusMap = {
    adopcion: 'AVAILABLE',
    perdida: 'LOST',
    adoptada: 'ADOPTED',
  };
  let age = frontendPet.age;
  if (typeof age === 'string') {
    const ageMatch = age.match(/(\d+)/);
    age = ageMatch ? parseInt(ageMatch[1], 10) : null;
  } else if (typeof age === 'number') {
    age = age;
  } else {
    age = frontendPet.edadNumero || null;
  }
  return {
    name: frontendPet.nombre,
    breed: frontendPet.raza || '',
    color: frontendPet.color || '',
    age,
    description: frontendPet.descripcion || '',
    location: frontendPet.ubicacion || '',
    status: statusMap[frontendPet.estado] || frontendPet.estadoBackend || 'AVAILABLE',
  };
};

export const updatePet = async (petId, petData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/pets/updatePet/${petId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(petData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `Error al actualizar la mascota (${response.status})`
    );
  }
  return response.json();
};

export const deletePet = async (petId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/pets/${petId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `Error al eliminar la mascota (${response.status})`
    );
  }
};
