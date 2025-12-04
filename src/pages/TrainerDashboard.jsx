/**
 * Routine Forge - Dashboard
 * Simplified dashboard showing only routine templates
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Download } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import usePDFExport from "../hooks/usePDFExport.js";
import useRoutineSync from "../hooks/useRoutineSync.js";
import ConfirmDialog from "../components/Shared/ConfirmDialog.jsx";
import { toast } from "../utils/toast.js";
import { Button, Badge } from "../components/ui";

const RoutineCard = ({ routine, onEdit, onDuplicate, onDelete, onExport }) => {
  const [showActions, setShowActions] = useState(false);

  const handleEdit = () => {
    onEdit(routine);
  };

  const handleDuplicate = () => {
    onDuplicate(routine);
  };

  const handleDelete = () => {
    onDelete(routine.id);
  };

  const handleExport = () => {
    onExport(routine);
  };

  return (
    <div
      className="group relative rounded-xl border border-border bg-primary-surface p-6 transition-all hover:border-accent/50 hover:shadow-lg-accent"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-text-primary font-display truncate">
            {routine.name || 'Rutina sin nombre'}
          </h3>
          {routine.objective && (
            <p className="mt-1 text-sm text-text-secondary">{routine.objective}</p>
          )}
        </div>
        {routine.level && (
          <Badge variant="accent" size="sm">{routine.level}</Badge>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-muted">
        {routine.durationWeeks && (
          <span>{routine.durationWeeks} semanas</span>
        )}
        {routine.frequency && (
          <span>· {routine.frequency} días/semana</span>
        )}
        {routine.createdAt && (
          <span>· Creado {new Date(routine.createdAt).toLocaleDateString('es-AR')}</span>
        )}
      </div>

      {/* Tags */}
      {routine.tags && routine.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {routine.tags.map((tag, idx) => (
            <Badge key={idx} variant="default" size="sm">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div
        className={`mt-4 flex flex-wrap items-center gap-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <Button size="sm" variant="primary" onClick={handleEdit}>
          Editar
        </Button>
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          PDF
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDuplicate}>
          Duplicar
        </Button>
        <Button size="sm" variant="danger" onClick={handleDelete}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { routines } = state;
  const { exportRoutineAsPDF } = usePDFExport();
  const { addRoutine, deleteRoutine } = useRoutineSync();
  const [confirmDialog, setConfirmDialog] = useState({ open: false, routineId: null });

  const handleCreateRoutine = () => {
    navigate("/admin/plantillas/nueva");
  };

  const handleEditRoutine = (routine) => {
    navigate(`/admin/plantillas/${routine.id}/editar`);
  };

  const handleDuplicateRoutine = async (routine) => {
    try {
      const duplicated = {
        ...routine,
        name: `${routine.name} (Copia)`,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      await addRoutine(duplicated);
      toast.success("Rutina duplicada correctamente");
    } catch (error) {
      console.error("Error duplicating routine:", error);
      toast.error("Error al duplicar la rutina");
    }
  };

  const handleDeleteRoutine = (routineId) => {
    setConfirmDialog({ open: true, routineId });
  };

  const confirmDelete = async () => {
    try {
      await deleteRoutine(confirmDialog.routineId);
      toast.success("Rutina eliminada correctamente");
    } catch (error) {
      console.error("Error deleting routine:", error);
      toast.error("Error al eliminar la rutina");
    } finally {
      setConfirmDialog({ open: false, routineId: null });
    }
  };

  const handleExportPDF = async (routine) => {
    try {
      await exportRoutineAsPDF(routine);
      toast.success("PDF generado correctamente");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <header className="border-b border-border bg-primary-surface">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-text-primary font-display">
                Routine Forge
              </h1>
              <p className="mt-2 text-text-secondary">
                Crea, edita y exporta rutinas de entrenamiento profesionales
              </p>
            </div>
            <Button onClick={handleCreateRoutine} size="lg">
              <Plus className="h-5 w-5" />
              Nueva Rutina
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary font-display">
              Mis Rutinas
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {routines.length} {routines.length === 1 ? 'rutina' : 'rutinas'} creadas
            </p>
          </div>
        </div>

        {/* Routines Grid */}
        {routines.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onEdit={handleEditRoutine}
                onDuplicate={handleDuplicateRoutine}
                onDelete={handleDeleteRoutine}
                onExport={handleExportPDF}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-primary-surface py-16 px-6 text-center">
            <FileText className="h-16 w-16 text-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No tienes rutinas creadas
            </h3>
            <p className="text-text-secondary mb-6 max-w-md">
              Comienza creando tu primera rutina de entrenamiento. Podrás editarla,
              duplicarla y exportarla a PDF cuando quieras.
            </p>
            <Button onClick={handleCreateRoutine}>
              <Plus className="h-5 w-5" />
              Crear mi primera rutina
            </Button>
          </div>
        )}
      </main>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, routineId: null })}
        onConfirm={confirmDelete}
        title="Eliminar rutina"
        message="¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
