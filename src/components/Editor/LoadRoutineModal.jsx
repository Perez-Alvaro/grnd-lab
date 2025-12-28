import { useState, useEffect } from 'react';
import { useRoutinesAPI } from '../../hooks/useRoutinesAPI';
import { apiToEditor } from '../../lib/utils/routineTransform';

/**
 * Modal para cargar rutinas desde la base de datos
 * Se puede integrar en el editor existente
 * 
 * Uso:
 * const [showLoad, setShowLoad] = useState(false);
 * <LoadRoutineModal 
 *   isOpen={showLoad} 
 *   onClose={() => setShowLoad(false)}
 *   onSelect={(routine) => importToEditor(routine)}
 * />
 */
export function LoadRoutineModal({ isOpen, onClose, onSelect }) {
    const { routines, loading, loadRoutines, serverAvailable, deleteRoutine } = useRoutinesAPI();
    const [filters, setFilters] = useState({ nivel: '', equipamiento: '', search: '' });
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (isOpen && serverAvailable) {
            loadRoutines();
        }
    }, [isOpen, serverAvailable, loadRoutines]);

    const handleSearch = () => {
        loadRoutines(filters);
    };

    const handleSelect = (routine) => {
        if (onSelect) {
            const editorData = apiToEditor(routine);
            onSelect(editorData);
            onClose();
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('¿Eliminar esta rutina?')) return;

        try {
            await deleteRoutine(id);
            if (selectedId === id) setSelectedId(null);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2>Cargar Rutina</h2>
                    <button onClick={onClose} style={styles.closeButton}>✕</button>
                </div>

                {!serverAvailable ? (
                    <div style={styles.warning}>
                        ⚠️ Servidor no disponible. Ejecuta <code>npm run server</code>
                    </div>
                ) : (
                    <>
                        {/* Filtros */}
                        <div style={styles.filters}>
                            <select
                                value={filters.nivel}
                                onChange={(e) => setFilters(prev => ({ ...prev, nivel: e.target.value }))}
                                style={styles.select}
                            >
                                <option value="">Todos los niveles</option>
                                <option value="novato">Novato</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                            </select>

                            <select
                                value={filters.equipamiento}
                                onChange={(e) => setFilters(prev => ({ ...prev, equipamiento: e.target.value }))}
                                style={styles.select}
                            >
                                <option value="">Todo equipamiento</option>
                                <option value="casa">Casa</option>
                                <option value="gimnasio">Gimnasio</option>
                                <option value="bandas">Bandas</option>
                                <option value="mixto">Mixto</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                style={styles.input}
                            />

                            <button onClick={handleSearch} style={styles.searchButton}>
                                🔍
                            </button>
                        </div>

                        {/* Lista */}
                        <div style={styles.list}>
                            {loading && <div style={styles.loading}>⏳ Cargando...</div>}

                            {!loading && routines.length === 0 && (
                                <div style={styles.empty}>
                                    No hay rutinas guardadas. Crea y guarda una primero!
                                </div>
                            )}

                            {routines.map((routine) => (
                                <div
                                    key={routine.id}
                                    style={{
                                        ...styles.item,
                                        ...(selectedId === routine.id ? styles.itemActive : {}),
                                    }}
                                    onClick={() => setSelectedId(routine.id)}
                                    onDoubleClick={() => handleSelect(routine)}
                                >
                                    <div style={styles.itemMain}>
                                        <h4 style={styles.itemTitle}>{routine.nombre}</h4>
                                        <div style={styles.itemMeta}>
                                            <span>📊 {routine.nivel || 'N/A'}</span>
                                            <span>🏠 {routine.equipamiento || 'N/A'}</span>
                                            <span>📅 {routine.duracion || '?'}sem</span>
                                        </div>
                                        {routine.descripcion && (
                                            <p style={styles.itemDesc}>{routine.descripcion}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, routine.id)}
                                        style={styles.deleteButton}
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div style={styles.footer}>
                            <button onClick={onClose} style={styles.cancelButton}>
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    const selected = routines.find(r => r.id === selectedId);
                                    if (selected) handleSelect(selected);
                                }}
                                disabled={!selectedId}
                                style={styles.selectButton}
                            >
                                Cargar Seleccionada
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    modal: {
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    header: {
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#6b7280',
    },
    warning: {
        padding: '20px',
        background: '#fef3c7',
        border: '1px solid #f59e0b',
        margin: '20px',
        borderRadius: '6px',
    },
    filters: {
        padding: '15px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '10px',
    },
    select: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
    },
    input: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        flex: 1,
    },
    searchButton: {
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        background: 'white',
        cursor: 'pointer',
    },
    list: {
        flex: 1,
        overflowY: 'auto',
        padding: '15px 20px',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
    },
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        marginBottom: '10px',
        border: '2px solid transparent',
        borderRadius: '8px',
        background: '#f9fafb',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    itemActive: {
        borderColor: '#3b82f6',
        background: '#eff6ff',
    },
    itemMain: {
        flex: 1,
    },
    itemTitle: {
        margin: '0 0 8px 0',
        fontSize: '16px',
    },
    itemMeta: {
        display: 'flex',
        gap: '10px',
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '5px',
    },
    itemDesc: {
        margin: '5px 0 0 0',
        fontSize: '13px',
        color: '#6b7280',
    },
    deleteButton: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '5px',
    },
    footer: {
        padding: '15px 20px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    cancelButton: {
        padding: '10px 20px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        background: 'white',
        cursor: 'pointer',
    },
    selectButton: {
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        background: '#3b82f6',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '500',
    },
};

export default LoadRoutineModal;
