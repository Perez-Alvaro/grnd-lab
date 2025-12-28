import { useState, useEffect } from 'react';
import { useRoutinesAPI } from '../hooks/useRoutinesAPI';
import { editorToAPI, apiToEditor, createEmptyRoutine } from '../lib/utils/routineTransform';

/**
 * Componente de demostración para el sistema de persistencia de rutinas
 * Muestra cómo usar el hook useRoutinesAPI y las utilidades de transformación
 */
export function RoutinesPersistenceDemo() {
    const {
        routines,
        loading,
        error,
        serverAvailable,
        loadRoutines,
        saveRoutine,
        deleteRoutine,
        duplicateRoutine,
        checkServer,
    } = useRoutinesAPI();

    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [filters, setFilters] = useState({
        nivel: '',
        equipamiento: '',
        search: '',
    });

    // Cargar rutinas al montar
    useEffect(() => {
        if (serverAvailable) {
            loadRoutines(filters);
        }
    }, [serverAvailable, loadRoutines]);

    // Handlers
    const handleRefresh = () => {
        loadRoutines(filters);
    };

    const handleCreateNew = async () => {
        try {
            const newRoutine = createEmptyRoutine();
            const apiData = editorToAPI(newRoutine);
            const saved = await saveRoutine(apiData);
            alert(`Rutina creada: ${saved.nombre}`);
            setSelectedRoutine(saved);
        } catch (err) {
            alert(`Error al crear rutina: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta rutina?')) return;

        try {
            await deleteRoutine(id);
            alert('Rutina eliminada');
            if (selectedRoutine?.id === id) {
                setSelectedRoutine(null);
            }
        } catch (err) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    const handleDuplicate = async (id) => {
        try {
            const duplicated = await duplicateRoutine(id);
            alert(`Rutina duplicada: ${duplicated.nombre}`);
        } catch (err) {
            alert(`Error al duplicar: ${err.message}`);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        loadRoutines(filters);
    };

    return (
        <div className="routines-persistence-demo" style={styles.container}>
            <header style={styles.header}>
                <h1>🏋️ Sistema de Persistencia de Rutinas</h1>
                <div style={styles.status}>
                    {serverAvailable ? (
                        <span style={styles.statusOnline}>✅ Servidor conectado</span>
                    ) : (
                        <span style={styles.statusOffline}>
                            ⚠️ Servidor desconectado
                            <button onClick={checkServer} style={styles.retryButton}>
                                Reintentar
                            </button>
                        </span>
                    )}
                </div>
            </header>

            {!serverAvailable && (
                <div style={styles.alert}>
                    <strong>⚠️ Servidor no disponible</strong>
                    <p>Ejecuta <code>npm run server</code> o <code>npm run dev:all</code> para iniciar el backend</p>
                </div>
            )}

            {/* Filtros */}
            <div style={styles.filters}>
                <h3>Filtros</h3>
                <div style={styles.filterRow}>
                    <select
                        value={filters.nivel}
                        onChange={(e) => handleFilterChange('nivel', e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Todos los niveles</option>
                        <option value="novato">Novato</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                    </select>

                    <select
                        value={filters.equipamiento}
                        onChange={(e) => handleFilterChange('equipamiento', e.target.value)}
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
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={styles.input}
                    />

                    <button onClick={handleSearch} style={styles.button}>
                        🔍 Buscar
                    </button>
                </div>
            </div>

            {/* Acciones */}
            <div style={styles.actions}>
                <button
                    onClick={handleCreateNew}
                    disabled={!serverAvailable || loading}
                    style={{ ...styles.button, ...styles.primaryButton }}
                >
                    ➕ Nueva Rutina
                </button>
                <button
                    onClick={handleRefresh}
                    disabled={!serverAvailable || loading}
                    style={styles.button}
                >
                    🔄 Actualizar
                </button>
            </div>

            {/* Estado de carga/error */}
            {loading && <div style={styles.loading}>⏳ Cargando...</div>}
            {error && <div style={styles.error}>❌ Error: {error}</div>}

            {/* Lista de rutinas */}
            <div style={styles.content}>
                <div style={styles.list}>
                    <h3>Rutinas ({routines.length})</h3>
                    {routines.length === 0 && !loading && (
                        <p style={styles.empty}>No hay rutinas. Crea una nueva!</p>
                    )}
                    {routines.map((routine) => (
                        <div
                            key={routine.id}
                            style={{
                                ...styles.card,
                                ...(selectedRoutine?.id === routine.id ? styles.cardActive : {}),
                            }}
                            onClick={() => setSelectedRoutine(routine)}
                        >
                            <h4>{routine.nombre}</h4>
                            <div style={styles.cardMeta}>
                                <span>📊 {routine.nivel || 'N/A'}</span>
                                <span>🏠 {routine.equipamiento || 'N/A'}</span>
                                <span>📅 {routine.duracion || '?'} sem</span>
                                <span>🔢 {routine.frecuencia || '?'} días/sem</span>
                            </div>
                            <div style={styles.cardActions}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicate(routine.id);
                                    }}
                                    style={styles.smallButton}
                                    title="Duplicar"
                                >
                                    📋
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(routine.id);
                                    }}
                                    style={{ ...styles.smallButton, ...styles.dangerButton }}
                                    title="Eliminar"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Panel de detalles */}
                <div style={styles.details}>
                    <h3>Detalles</h3>
                    {selectedRoutine ? (
                        <div>
                            <h2>{selectedRoutine.nombre}</h2>
                            <p><strong>ID:</strong> {selectedRoutine.id}</p>
                            <p><strong>Nivel:</strong> {selectedRoutine.nivel || 'N/A'}</p>
                            <p><strong>Equipamiento:</strong> {selectedRoutine.equipamiento || 'N/A'}</p>
                            <p><strong>Duración:</strong> {selectedRoutine.duracion || '?'} semanas</p>
                            <p><strong>Frecuencia:</strong> {selectedRoutine.frecuencia || '?'} días/semana</p>
                            <p><strong>Foco:</strong> {selectedRoutine.foco || 'N/A'}</p>
                            <p><strong>Autor:</strong> {selectedRoutine.autor || 'N/A'}</p>
                            <p><strong>Descripción:</strong> {selectedRoutine.descripcion || 'Sin descripción'}</p>
                            <p><strong>Tags:</strong> {(selectedRoutine.tags || []).join(', ') || 'Sin tags'}</p>
                            <p><strong>Semanas:</strong> {(selectedRoutine.semanas || []).length}</p>
                            <p><strong>Creado:</strong> {new Date(selectedRoutine.createdAt).toLocaleString()}</p>
                            <p><strong>Actualizado:</strong> {new Date(selectedRoutine.updatedAt).toLocaleString()}</p>

                            <details style={{ marginTop: '20px' }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                    Ver JSON completo
                                </summary>
                                <pre style={styles.json}>
                                    {JSON.stringify(selectedRoutine, null, 2)}
                                </pre>
                            </details>
                        </div>
                    ) : (
                        <p style={styles.empty}>Selecciona una rutina para ver sus detalles</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Estilos inline para el demo
const styles = {
    container: {
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
        marginBottom: '20px',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '10px',
    },
    status: {
        marginTop: '10px',
    },
    statusOnline: {
        color: '#22c55e',
        fontWeight: 'bold',
    },
    statusOffline: {
        color: '#ef4444',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    retryButton: {
        fontSize: '12px',
        padding: '4px 8px',
    },
    alert: {
        background: '#fef3c7',
        border: '1px solid #f59e0b',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    filters: {
        background: '#f9fafb',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    filterRow: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
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
        flex: '1',
        minWidth: '200px',
    },
    actions: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        background: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    primaryButton: {
        background: '#3b82f6',
        color: 'white',
        border: 'none',
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        fontSize: '18px',
    },
    error: {
        background: '#fee2e2',
        border: '1px solid #ef4444',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        color: '#dc2626',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    list: {
        background: '#f9fafb',
        padding: '15px',
        borderRadius: '8px',
        maxHeight: '600px',
        overflowY: 'auto',
    },
    card: {
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
        border: '2px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    cardActive: {
        borderColor: '#3b82f6',
        background: '#eff6ff',
    },
    cardMeta: {
        display: 'flex',
        gap: '10px',
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '8px',
        flexWrap: 'wrap',
    },
    cardActions: {
        display: 'flex',
        gap: '5px',
        marginTop: '10px',
    },
    smallButton: {
        padding: '4px 8px',
        fontSize: '16px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        background: 'white',
        cursor: 'pointer',
    },
    dangerButton: {
        background: '#fee2e2',
        borderColor: '#ef4444',
    },
    details: {
        background: '#f9fafb',
        padding: '15px',
        borderRadius: '8px',
        maxHeight: '600px',
        overflowY: 'auto',
    },
    empty: {
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    json: {
        background: '#1f2937',
        color: '#10b981',
        padding: '15px',
        borderRadius: '6px',
        fontSize: '12px',
        overflowX: 'auto',
        marginTop: '10px',
    },
};

export default RoutinesPersistenceDemo;
