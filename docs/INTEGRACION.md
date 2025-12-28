# Integración del Sistema de Persistencia con el Editor

Esta guía muestra cómo integrar el sistema de persistencia con tu editor de rutinas existente.

## 1. Agregar botones al Editor

En tu componente `RoutineEditorPage.jsx` o similar:

```jsx
import { useState } from 'react';
import SaveRoutineButton from './components/Editor/SaveRoutineButton';
import LoadRoutineModal from './components/Editor/LoadRoutineModal';
import { useRoutineEditor } from './hooks/useRoutineEditor';

export function RoutineEditorPage() {
  const { planEditor, importToEditor } = useRoutineEditor();
  const [showLoadModal, setShowLoadModal] = useState(false);

  return (
    <div className="editor-page">
      {/* Barra de herramientas superior */}
      <div className="toolbar">
        <h1>Editor de Rutinas</h1>
        
        <div className="toolbar-actions">
          {/* Botón para cargar rutinas guardadas */}
          <button onClick={() => setShowLoadModal(true)}>
            📂 Cargar Rutina
          </button>

          {/* Botón para guardar la rutina actual */}
          <SaveRoutineButton 
            routineData={planEditor}
            onSaveSuccess={(saved) => {
              console.log('Rutina guardada:', saved);
              // Opcional: actualizar el ID en el editor
              // setPlanEditor(prev => ({ ...prev, id: saved.id }));
            }}
            onSaveError={(error) => {
              console.error('Error al guardar:', error);
            }}
          />
        </div>
      </div>

      {/* Tu editor existente */}
      <div className="editor-content">
        {/* ... componentes del editor ... */}
      </div>

      {/* Modal para cargar rutinas */}
      <LoadRoutineModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onSelect={(routine) => {
          importToEditor(routine);
          console.log('Rutina cargada en el editor');
        }}
      />
    </div>
  );
}
```

## 2. Agregar estilos personalizados

Si quieres personalizar el aspecto de los botones:

```jsx
<SaveRoutineButton 
  routineData={planEditor}
  className="btn btn-primary"
>
  💾 Guardar
</SaveRoutineButton>
```

## 3. Auto-guardar (opcional)

Para implementar auto-guardado cada X segundos:

```jsx
import { useEffect } from 'react';
import { useRoutinesAPI } from './hooks/useRoutinesAPI';
import { editorToAPI } from './lib/utils/routineTransform';

export function RoutineEditorPage() {
  const { planEditor } = useRoutineEditor();
  const { saveRoutine } = useRoutinesAPI();

  // Auto-guardar cada 2 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (planEditor.id) { // Solo auto-guardar si ya existe
        const apiData = editorToAPI(planEditor);
        saveRoutine(apiData)
          .then(() => console.log('Auto-guardado'))
          .catch(err => console.error('Error en auto-guardado:', err));
      }
    }, 120000); // 2 minutos

    return () => clearInterval(interval);
  }, [planEditor, saveRoutine]);

  // ... resto del componente
}
```

## 4. Guardar antes de salir

Para evitar perder cambios al cerrar la página:

```jsx
useEffect(() => {
  const handleBeforeUnload = (e) => {
    // Verificar si hay cambios sin guardar
    if (planEditor.modified && !planEditor.id) {
      e.preventDefault();
      e.returnValue = '¿Guardar cambios antes de salir?';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [planEditor]);
```

## 5. Listar rutinas en una página separada

Si quieres crear una página de "Mis Rutinas":

```jsx
import { useEffect } from 'react';
import { useRoutinesAPI } from './hooks/useRoutinesAPI';
import { useNavigate } from 'react-router-dom';

export function MyRoutinesPage() {
  const { routines, loadRoutines, deleteRoutine } = useRoutinesAPI();
  const navigate = useNavigate();

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const handleEdit = (routineId) => {
    navigate(`/editor/${routineId}`);
  };

  return (
    <div>
      <h1>Mis Rutinas</h1>
      
      <div className="routines-grid">
        {routines.map(routine => (
          <div key={routine.id} className="routine-card">
            <h3>{routine.nombre}</h3>
            <p>{routine.descripcion}</p>
            
            <div className="card-actions">
              <button onClick={() => handleEdit(routine.id)}>
                ✏️ Editar
              </button>
              <button onClick={() => deleteRoutine(routine.id)}>
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 6. Cargar rutina desde URL

Para cargar una rutina específica desde la URL:

```jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRoutinesAPI } from './hooks/useRoutinesAPI';
import { useRoutineEditor } from './hooks/useRoutineEditor';
import { apiToEditor } from './lib/utils/routineTransform';

export function RoutineEditorPage() {
  const { routineId } = useParams(); // desde /editor/:routineId
  const { getRoutine } = useRoutinesAPI();
  const { importToEditor } = useRoutineEditor();

  useEffect(() => {
    if (routineId) {
      getRoutine(routineId)
        .then(routine => {
          const editorData = apiToEditor(routine);
          importToEditor(editorData);
        })
        .catch(err => console.error('Error cargando rutina:', err));
    }
  }, [routineId, getRoutine, importToEditor]);

  // ... resto del componente
}
```

## 7. Exportar/Importar JSON con persistencia

Combinar la funcionalidad de exportar JSON con guardar en BD:

```jsx
const handleExportAndSave = async () => {
  // 1. Guardar en BD
  const apiData = editorToAPI(planEditor);
  const saved = await saveRoutine(apiData);
  
  // 2. También exportar como JSON
  const jsonData = JSON.stringify(saved, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${saved.nombre}.json`;
  a.click();
};
```

## 8. Estado de conexión del servidor

Mostrar un indicador de estado:

```jsx
import { useRoutinesAPI } from './hooks/useRoutinesAPI';

export function ServerStatusIndicator() {
  const { serverAvailable, checkServer } = useRoutinesAPI();

  return (
    <div className={`status-indicator ${serverAvailable ? 'online' : 'offline'}`}>
      {serverAvailable ? (
        <span>✅ Conectado</span>
      ) : (
        <span>
          ⚠️ Desconectado
          <button onClick={checkServer}>Reconectar</button>
        </span>
      )}
    </div>
  );
}
```

## 9. Validación antes de guardar

Usar el esquema de validación existente:

```jsx
import { validateRoutineSchema } from './lib/schemas/routineSchema';

const handleSaveWithValidation = async () => {
  // Validar antes de guardar
  const validation = validateRoutineSchema(planEditor);
  
  if (!validation.isValid) {
    alert('Errores en la rutina:\n' + validation.getErrorMessages().join('\n'));
    return;
  }

  // Si pasa validación, guardar
  const apiData = editorToAPI(planEditor);
  await saveRoutine(apiData);
};
```

## 10. Filtrar y buscar en el editor

Implementar búsqueda rápida:

```jsx
const [searchTerm, setSearchTerm] = useState('');
const { loadRoutines } = useRoutinesAPI();

const handleQuickSearch = () => {
  loadRoutines({ search: searchTerm });
};

return (
  <div>
    <input 
      type="text"
      placeholder="Buscar rutinas..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
    />
  </div>
);
```

---

## ✨ Ejemplo completo integrado

Aquí hay un ejemplo completo de cómo podría verse:

```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SaveRoutineButton from './components/Editor/SaveRoutineButton';
import LoadRoutineModal from './components/Editor/LoadRoutineModal';
import { useRoutineEditor } from './hooks/useRoutineEditor';
import { useRoutinesAPI } from './hooks/useRoutinesAPI';
import { apiToEditor } from './lib/utils/routineTransform';

export function RoutineEditorPage() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { planEditor, importToEditor } = useRoutineEditor();
  const { serverAvailable, getRoutine } = useRoutinesAPI();
  const [showLoadModal, setShowLoadModal] = useState(false);

  // Cargar rutina si viene por URL
  useEffect(() => {
    if (routineId) {
      getRoutine(routineId)
        .then(routine => {
          const editorData = apiToEditor(routine);
          importToEditor(editorData);
        })
        .catch(err => {
          console.error('Error:', err);
          alert('No se pudo cargar la rutina');
          navigate('/editor');
        });
    }
  }, [routineId]);

  return (
    <div className="editor-page">
      {/* Header con acciones */}
      <header className="editor-header">
        <h1>Editor de Rutinas</h1>
        
        <div className="editor-actions">
          {/* Indicador de servidor */}
          {!serverAvailable && (
            <span className="warning" title="Servidor no disponible">
              ⚠️
            </span>
          )}

          {/* Cargar rutina */}
          <button 
            onClick={() => setShowLoadModal(true)}
            className="btn-secondary"
          >
            📂 Cargar
          </button>

          {/* Guardar rutina */}
          <SaveRoutineButton
            routineData={planEditor}
            className="btn-primary"
            onSaveSuccess={(saved) => {
              // Redirigir con el ID si es nueva
              if (!routineId) {
                navigate(`/editor/${saved.id}`, { replace: true });
              }
            }}
          >
            💾 Guardar
          </SaveRoutineButton>
        </div>
      </header>

      {/* Editor principal */}
      <main className="editor-content">
        {/* Aquí va tu editor existente */}
      </main>

      {/* Modal de carga */}
      <LoadRoutineModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onSelect={(routine) => {
          importToEditor(routine);
          if (routine.id) {
            navigate(`/editor/${routine.id}`);
          }
        }}
      />
    </div>
  );
}
```

---

¡Con esto tienes persistencia completa integrada en tu editor! 🎉
