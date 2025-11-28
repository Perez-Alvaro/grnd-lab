import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import RoutinePreview from "../components/Trainer/preview/RoutinePreview.jsx";
import { FadeIn } from "../components/Shared/reactbits/index.js";

function RoutinePreviewPage() {
  const { id } = useParams();
  const { state } = useAppContext();

  const routine = useMemo(
    () => state.routines.find((item) => String(item.id) === String(id) && item.active === true),
    [id, state.routines],
  );

  if (!routine) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-neutral-950 px-6 py-24 text-white">
        <FadeIn className="max-w-lg text-center">
          <h1 className="text-3xl font-semibold uppercase">
            Rutina no encontrada
          </h1>
          <p className="mt-4 text-sm text-gray-400">
            Verificá el enlace o volvé al panel principal para seleccionar otra
            rutina.
          </p>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <FadeIn>
          <RoutinePreview routine={routine} />
        </FadeIn>
      </div>
    </div>
  );
}

export default RoutinePreviewPage;
