import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ImageUploader({
  label = "Imagen",
  helperText = "Subí una imagen en formato JPG, PNG o WebP",
  value,
  onChange,
  accept = "image/png, image/jpeg, image/webp",
  inputProps = {},
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || "");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreview("");
      if (!fileName) {
        setFileName("");
      }
      return;
    }

    setPreview(value);
    if (!fileName && typeof value === "string" && !value.startsWith("data:")) {
      try {
        const url = new URL(value);
        setFileName(url.pathname.split("/").pop() || "Imagen seleccionada");
      } catch (error) {
        void error;
        setFileName("Imagen seleccionada");
      }
    }
  }, [value, fileName]);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setFileName(file.name);

      try {
        const dataUrl = await readFileAsDataUrl(file);
        setPreview(dataUrl);
        onChange?.(dataUrl, { file });
      } catch (error) {
        console.error("Error reading image", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    setPreview("");
    setFileName("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.("", { file: null });
  }, [onChange]);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-950/80 p-4">
        <div className="flex flex-col gap-2">
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="w-full cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 p-2 text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-lime-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black transition-colors hover:file:bg-lime-500 focus:border-lime-400 focus:outline-none"
            {...inputProps}
          />
          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/70">
          {preview ? (
            <img
              src={preview}
              alt="Vista previa de la imagen seleccionada"
              className="h-40 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <ImagePlus className="h-6 w-6 text-lime-400" />
              <span>{isLoading ? "Procesando imagen..." : "Sin imagen de portada"}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="line-clamp-1">
            {fileName || "Formatos soportados: JPG, PNG, WebP"}
          </span>
          {preview && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 font-medium text-red-400 transition-colors hover:border-red-500/40 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" /> Quitar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
