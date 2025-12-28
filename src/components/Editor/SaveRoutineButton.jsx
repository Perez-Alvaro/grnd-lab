import { useState } from 'react';
import { useRoutinesAPI } from '../../hooks/useRoutinesAPI';
import { editorToAPI } from '../../lib/utils/routineTransform';

/**
 * Botón para guardar rutinas en la base de datos local
 * Puede integrarse fácilmente en el RoutineEditor existente
 * 
 * Uso:
 * <SaveRoutineButton routineData={planEditor} />
 */
export function SaveRoutineButton({
    routineData,
    onSaveSuccess,
    onSaveError,
    className = '',
    children
}) {
    const { saveRoutine, serverAvailable } = useRoutinesAPI();
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!serverAvailable) {
            const msg = 'El servidor no está disponible. Ejecuta "npm run server"';
            alert(msg);
            onSaveError?.(new Error(msg));
            return;
        }

        setSaving(true);
        try {
            // Transformar datos del editor al formato API
            const apiData = editorToAPI(routineData);

            // Validar que tenga nombre
            if (!apiData.meta?.nombre || apiData.meta.nombre.trim() === '') {
                throw new Error('La rutina debe tener un nombre');
            }

            // Guardar en la BD
            const saved = await saveRoutine(apiData);

            // Notificar éxito
            const action = routineData.id ? 'actualizada' : 'guardada';
            alert(`✅ Rutina ${action} exitosamente: ${saved.nombre}`);

            onSaveSuccess?.(saved);
        } catch (error) {
            console.error('Error al guardar rutina:', error);
            alert(`❌ Error al guardar: ${error.message}`);
            onSaveError?.(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={saving || !serverAvailable}
            className={className}
            title={serverAvailable ? 'Guardar en base de datos local' : 'Servidor no disponible'}
            style={{
                opacity: serverAvailable ? 1 : 0.5,
                cursor: serverAvailable ? 'pointer' : 'not-allowed',
            }}
        >
            {saving ? (
                <>⏳ Guardando...</>
            ) : (
                children || <>💾 Guardar Rutina</>
            )}
        </button>
    );
}

export default SaveRoutineButton;
