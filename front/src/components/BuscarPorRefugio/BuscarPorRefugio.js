import React, { useEffect, useState } from 'react';
import './BuscarPorRefugio.css';

/**
 * Búsqueda de mascotas por ID de refugio (GET /pets/shelter/{id}).
 * Si `lockedShelterId` está definido (cuenta refugio), no se permite buscar otro ID.
 *
 * @param {string} [lockedShelterId] - Modo refijo: solo este refugio (usuarios SHELTER)
 * @param {string} activeShelterId - ID aplicado en la URL (modo libre)
 * @param {(id: string) => void} onApply
 * @param {() => void} onClear
 * @param {boolean} [disabled]
 */
const BuscarPorRefugio = ({
  lockedShelterId,
  activeShelterId,
  onApply,
  onClear,
  disabled,
}) => {
  const [input, setInput] = useState(activeShelterId || '');

  useEffect(() => {
    setInput(activeShelterId || '');
  }, [activeShelterId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = input.trim();
    if (!id) return;
    onApply(id);
  };

  const handleClear = () => {
    setInput('');
    onClear();
  };

  if (lockedShelterId) {
    return (
      <div className="buscar-refugio buscar-refugio-locked">
        <span className="buscar-refugio-title">Tu refugio</span>
        <p className="buscar-refugio-locked-msg">
          Solo puedes ver mascotas del refugio con ID <strong>{lockedShelterId}</strong>. El listado usa
          automáticamente este identificador.
        </p>
      </div>
    );
  }

  return (
    <div className="buscar-refugio">
      <span className="buscar-refugio-title">Buscar por refugio</span>
      <form className="buscar-refugio-form" onSubmit={handleSubmit}>
        <label htmlFor="refugio-id-input" className="visually-hidden">
          ID del refugio
        </label>
        <input
          id="refugio-id-input"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          placeholder="ID del refugio"
          className="buscar-refugio-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
        />
        <button type="submit" className="buscar-refugio-btn" disabled={disabled}>
          Buscar
        </button>
        {activeShelterId ? (
          <button
            type="button"
            className="buscar-refugio-clear"
            onClick={handleClear}
            disabled={disabled}
          >
            Ver todas las mascotas
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default BuscarPorRefugio;
