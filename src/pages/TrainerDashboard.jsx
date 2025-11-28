import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  DollarSign,
  Layers,
  TrendingUp,
  Users,
  Clock,
  Mail,
  Plus,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";

import { useAppContext } from "../context/AppContext.jsx";
import usePDFExport from "../hooks/usePDFExport.js";
import useRoutineSync from "../hooks/useRoutineSync.js";
import TemplateCard from "../components/Trainer/TemplateCard.jsx";
import { TRAINING_GOAL_LABELS } from "../constants/objectives.js";
import Navbar from "../components/Shared/Navbar.jsx";
import Footer from "../components/Shared/Footer.jsx";
import ConfirmDialog from "../components/Shared/ConfirmDialog.jsx";
import { toast } from "../utils/toast.js";

const PLAN_VARIANTS = {
  premium: { label: "Premium", className: "text-accent" },
  essential: { label: "Essential", className: "text-gray-400" },
  basic: { label: "Basic", className: "text-gray-500" },
};

const PLAN_ORDER = ["premium", "essential", "basic"];

const addMonths = (monthKey, offset) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + offset, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("es-AR", {
    month: "short",
  });
};

const formatCurrency = (value = 0) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const calculateVariation = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : null;
  }
  return ((current - previous) / previous) * 100;
};

const formatVariation = (value) => {
  if (value === null || Number.isNaN(value)) return "N/A";
  const rounded = Math.abs(value).toFixed(1);
  return `${value >= 0 ? "+" : "-"}${rounded}%`;
};

const DashboardHeader = ({ onCreateTemplate, onGoToTemplates }) => (
  <header className="flex flex-col gap-6 rounded-3xl border border-brand-border bg-surface p-8 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.85)] md:flex-row md:items-center md:justify-between">
    <div className="space-y-3">
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-1 text-xs uppercase tracking-[0.3em] text-gray-400">
        Panel Fitter
      </span>
      <h1 className="text-3xl font-semibold text-white md:text-4xl">
        Rendimiento del negocio fitness
      </h1>
      <p className="max-w-2xl text-sm !text-white md:text-base">
        Seguimiento integral de ingresos, plantillas y comportamiento de tus
        clientes para tomar decisiones basadas en datos.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onGoToTemplates}
        className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-surface-alt px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-accent/60 hover:text-white"
      >
        <FileText className="h-4 w-4 text-accent" />
        Gestionar plantillas
      </button>
      <button
        onClick={onCreateTemplate}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
      >
        <Plus className="h-4 w-4" />
        Nueva plantilla
      </button>
    </div>
  </header>
);

const MetricCard = ({ title, value, subtitle, icon: Icon }) => (
  <article className="rounded-2xl border border-brand-border bg-surface-alt p-5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.8)]">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-surface text-accent">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  </article>
);

const DashboardCharts = ({
  monthlyRevenueData,
  topRoutineChartData,
  monthlyVariation,
  downloadsVariation,
}) => (
  <div className="flex flex-col gap-6">
    <div className="rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Ingresos mensuales
          </h3>
          <p className="text-sm text-gray-400">
            Últimos 6 meses • Variación {formatVariation(monthlyVariation)}
          </p>
        </div>
        <span className="rounded-full border border-accent/40 bg-surface-alt px-4 py-1 text-xs font-semibold text-accent">
          {formatVariation(monthlyVariation)}
        </span>
      </div>
      <div className="mt-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyRevenueData}>
            <CartesianGrid stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              stroke="#BDBDBD"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#BDBDBD"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0E0E0E",
                borderRadius: "0.75rem",
                border: "1px solid var(--color-border)",
                color: "#FFFFFF",
              }}
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ stroke: "var(--color-accent)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Rutinas destacadas
          </h3>
          <p className="text-sm text-gray-400">Top 5 por descargas</p>
        </div>
        <span className="rounded-full border border-accent/40 bg-surface-alt px-4 py-1 text-xs font-semibold text-accent">
          {formatVariation(downloadsVariation)}
        </span>
      </div>
      <div className="mt-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topRoutineChartData}
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          >
            <CartesianGrid stroke="var(--color-border)" />
            <XAxis
              type="number"
              stroke="#BDBDBD"
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#BDBDBD"
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0E0E0E",
                borderRadius: "0.75rem",
                border: "1px solid var(--color-border)",
                color: "#FFFFFF",
              }}
            />
            <Bar
              dataKey="sales"
              fill="var(--color-accent)"
              barSize={25}
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const DashboardSales = ({ sales }) => {
  const [planFilter, setPlanFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const planOptions = useMemo(() => {
    const present = new Set();
    sales.forEach((sale) => {
      if (sale.planKey) {
        present.add(sale.planKey);
      }
    });
    return Array.from(present).sort((a, b) => {
      const indexA = PLAN_ORDER.indexOf(a);
      const indexB = PLAN_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [sales]);

  const filteredSales = useMemo(() => {
    const filtered = sales.filter((sale) =>
      planFilter === "all" ? true : sale.planKey === planFilter,
    );
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortField === "date") {
        return (new Date(a.date) - new Date(b.date)) * dir;
      }
      if (sortField === "amount") {
        return (a.amount - b.amount) * dir;
      }
      return 0;
    });
    return sorted;
  }, [sales, planFilter, sortField, sortDirection]);

  const totalAmount = useMemo(
    () => filteredSales.reduce((sum, sale) => sum + sale.amount, 0),
    [filteredSales],
  );

  const totalDownloads = filteredSales.length;
  const pageCount = Math.max(1, Math.ceil(filteredSales.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paginatedSales = filteredSales.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <section className="flex h-full flex-col gap-6 rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Ventas completadas
          </h3>
          <p className="text-sm text-gray-400">
            Filtros por plan y ordenamientos personalizables
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={planFilter}
            onChange={(event) => {
              setPage(0);
              setPlanFilter(event.target.value);
            }}
            className="rounded-full border border-brand-border bg-base px-4 py-2 text-sm text-gray-200 transition-colors focus:border-accent focus:outline-none"
          >
            <option value="all">Todos los planes</option>
            {planOptions.map((option) => (
              <option key={option} value={option}>
                {PLAN_VARIANTS[option]?.label || option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-border">
        <table className="min-w-full divide-y divide-neutral-800 text-sm">
          <thead className="bg-base text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Cliente</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Tipo de plan</th>
              <th className="px-4 py-3 text-left font-medium">Rutina</th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("amount")}
                  className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-accent"
                >
                  Monto
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("date")}
                  className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-accent"
                >
                  Fecha
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-surface text-gray-300">
            {paginatedSales.map((sale) => (
              <tr
                key={sale.id}
                className="transition-colors hover:bg-surface-alt"
              >
                <td className="px-4 py-3 text-white">{sale.clientName}</td>
                <td className="px-4 py-3">{sale.email}</td>
                <td className={`px-4 py-3 font-semibold capitalize ${sale.planClass}`}>
                  {sale.planLabel}
                </td>
                <td className="px-4 py-3 text-white">{sale.routineName}</td>
                <td className="px-4 py-3 text-white">
                  {formatCurrency(sale.amount)}
                </td>
                <td className="px-4 py-3 text-gray-400">{sale.date}</td>
              </tr>
            ))}
            {paginatedSales.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No se registran ventas para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-brand-border pt-4 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
        <p>
          Total filtrado:{" "}
          <span className="font-semibold text-white">
            {formatCurrency(totalAmount)}
          </span>{" "}
          · Descargas: {totalDownloads}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            className="rounded-full border border-brand-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-accent/60 hover:text-white"
          >
            Anterior
          </button>
          <span className="text-xs text-gray-500">
            Página {currentPage + 1} de {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(pageCount - 1, prev + 1))}
            className="rounded-full border border-brand-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-accent/60 hover:text-white"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
};

const DashboardTemplates = ({
  routines,
  onCreate,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleActive,
  onExport,
  onUploadToStorage,
  onGenerateAllPDFs,
  uploadingPDFs = new Set(),
  generatingAllPDFs = false,
}) => {
  const [filters, setFilters] = useState({
    tag: "",
    gender: "",
    objective: "",
  });

  // Helper: convierte lo que tenga la rutina (key o label) al key real
  const getObjectiveKey = (objectiveValue) => {
    if (!objectiveValue) return null;

    // Caso 1: la rutina ya guarda el key (ej: "hypertrophy")
    if (TRAINING_GOAL_LABELS[objectiveValue]) return objectiveValue;

    // Caso 2: la rutina guarda el label (ej: "Volumen (Fuerza e Hipertrofia)")
    const entry = Object.entries(TRAINING_GOAL_LABELS).find(
      ([, label]) => label === objectiveValue,
    );
    return entry ? entry[0] : null;
  };

  const availableTags = useMemo(() => {
    const set = new Set();
    routines.forEach((template) =>
      (template.tags || []).forEach((tag) => set.add(tag)),
    );
    return Array.from(set);
  }, [routines]);

  // Objetivos que realmente existen en las rutinas
  const availableObjectives = useMemo(() => {
    const set = new Set();
    routines.forEach((template) => {
      const key = getObjectiveKey(template.objective);
      if (key) set.add(key);
    });
    return Array.from(set);
  }, [routines]);

  const filteredRoutines = useMemo(() => {
    return routines.filter((template) => {
      if (filters.tag && !template.tags?.includes(filters.tag)) return false;
      if (filters.gender && template.gender !== filters.gender) return false;

      if (filters.objective) {
        const routineObjectiveKey = getObjectiveKey(template.objective);
        if (routineObjectiveKey !== filters.objective) return false;
      }

      return true;
    });
  }, [routines, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () =>
    setFilters({ tag: "", gender: "", objective: "" });

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Plantillas
          </p>
          <h3 className="text-2xl font-semibold text-white">
            Gestión de rutinas
          </h3>
          <p className="text-sm text-gray-400">
            Editá, duplicá o exportá tus planes personalizados.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetFilters}
            className="rounded-full border border-brand-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-accent/60 hover:text-white"
          >
            Limpiar filtros
          </button>
          <button
            onClick={onGenerateAllPDFs}
            disabled={generatingAllPDFs}
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
            title="Generar y subir PDFs de todas las rutinas al Storage"
          >
            <Upload className="h-4 w-4" />
            {generatingAllPDFs ? 'Generando...' : 'Regenerar todos los PDFs'}
          </button>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
          >
            <Plus className="h-4 w-4" />
            Nueva plantilla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm text-gray-400">
          Etiqueta
          <select
            value={filters.tag}
            onChange={(event) => handleFilterChange("tag", event.target.value)}
            className="rounded-lg border border-brand-border bg-surface-alt px-3 py-2 text-sm text-gray-200 focus:border-accent focus:outline-none"
          >
            <option value="">Todas</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-gray-400">
          Género
          <select
            value={filters.gender}
            onChange={(event) =>
              handleFilterChange("gender", event.target.value)
            }
            className="rounded-lg border border-brand-border bg-surface-alt px-3 py-2 text-sm text-gray-200 focus:border-accent focus:outline-none"
          >
            <option value="">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-gray-400 md:col-span-2">
          Objetivo
          <select
            value={filters.objective}
            onChange={(event) =>
              handleFilterChange("objective", event.target.value)
            }
            className="rounded-lg border border-brand-border bg-surface-alt px-3 py-2 text-sm text-gray-200 focus:border-accent focus:outline-none"
          >
            <option value="">Todos</option>
            {availableObjectives.map((goalKey) => (
              <option key={goalKey} value={goalKey}>
                {TRAINING_GOAL_LABELS[goalKey] || goalKey}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredRoutines.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={() => onEdit(template)}
            onDuplicate={() => onDuplicate(template)}
            onDelete={() => onDelete(template.id)}
            onToggleActive={() => onToggleActive(template.id)}
            onExportPdf={() => onExport(template)}
            onUploadToStorage={() => onUploadToStorage(template)}
            uploadingPDF={uploadingPDFs.has(template.id)}
          />
        ))}
      </div>

      {filteredRoutines.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-border bg-base py-12 text-center text-sm text-gray-500">
          No hay plantillas para los filtros seleccionados.
        </div>
      )}
    </section>
  );
};

const DashboardMailExport = ({ onExport, emailCount, salesCount, usersCount, loading }) => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <section className="rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-accent">
            Exportar correos de clientes
          </h3>
          <p className="text-sm text-gray-400">
            Descargá un archivo con todos los emails de tus clientes para campañas de marketing.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {loading ? (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                Cargando emails...
              </span>
            ) : (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {emailCount} {emailCount === 1 ? 'email' : 'emails'} únicos
              </span>
            )}
            {emailCount === 0 && !loading && (
              <span className="text-xs text-gray-500">
                Los emails aparecerán aquí cuando tengas ventas o clientes registrados
              </span>
            )}
            {emailCount > 0 && !loading && (
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-gray-500 hover:text-accent underline"
              >
                {showDebug ? 'Ocultar' : 'Ver'} detalles
              </button>
            )}
          </div>

          {showDebug && emailCount > 0 && (
            <div className="mt-3 rounded-lg border border-brand-border bg-base p-3 text-xs">
              <p className="text-gray-400">
                <strong className="text-white">Fuente de emails:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-gray-500">
                <li>• Emails de ventas completadas (tabla <code>sales</code>)</li>
                <li className="text-gray-600 italic">→ Total de emails únicos: {emailCount}</li>
              </ul>
              <p className="mt-2 text-gray-600 italic">
                Estos son los emails donde los clientes recibieron sus rutinas. Se obtienen directamente desde la base de datos sin duplicados.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onExport}
          disabled={emailCount === 0 || loading}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mail className="h-4 w-4" />
          Descargar (.txt)
        </button>
      </div>
    </section>
  );
};

const DashboardEbookManager = () => {
  const [ebookFile, setEbookFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [existingBook, setExistingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Cargar libro existente al montar el componente
  useEffect(() => {
    loadExistingBook();
  }, []);

  const loadExistingBook = async () => {
    try {
      setLoading(true);
      const { bookService } = await import('../services/bookService.js');
      const books = await bookService.getAllBooks();

      // Buscar el libro oficial de nutrición
      const nutritionBook = books.find(book => book.slug === 'ebook-nutricion-mz');

      if (nutritionBook) {
        setExistingBook(nutritionBook);

        // Generar URL firmada para mostrar preview de la portada existente
        if (nutritionBook.image_url) {
          const { supabase } = await import('../lib/supabase.js');

          // Determinar el path correcto en el bucket
          let imagePath = nutritionBook.image_url;

          // Si es una URL completa, extraer solo el path
          if (imagePath.includes('supabase')) {
            const urlParts = imagePath.split('/storage/v1/object/public/Libros/');
            imagePath = urlParts[1] || imagePath;
          }

          // Generar URL firmada (válida por 1 hora)
          const { data: signedUrl, error } = await supabase.storage
            .from('Libros')
            .createSignedUrl(imagePath, 3600);

          if (!error && signedUrl) {
            setCoverPreview(signedUrl.signedUrl);
          } else {
            console.warn('No se pudo generar URL firmada para la portada:', error);
          }
        }
      }
    } catch (err) {
      console.error('Error loading existing book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setEbookFile(file);
      setError(null);
    }
  };

  const handleCoverUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!ebookFile || !coverFile) {
      setError('Debes seleccionar el PDF y la portada');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const { bookService } = await import('../services/bookService.js');

      // Datos fijos del único libro
      const bookData = {
        name: 'Ebook Oficial de Nutrición MZ',
        slug: 'ebook-nutricion-mz',
        description: 'Guía completa de nutrición deportiva con estrategias prácticas para maximizar tus resultados. Incluye planes de alimentación, recetas y protocolos de suplementación.',
        price: '6000',
        author: 'Matías Ortiz',
        pages: '150',
        active: true,
        featured: true
      };

      const book = await bookService.createBook(
        bookData,
        ebookFile,
        coverFile
      );

      console.log('✅ Libro creado exitosamente:', book);
      setSuccess(true);

      // Limpiar después de 3 segundos
      setTimeout(() => {
        setEbookFile(null);
        setCoverFile(null);
        setCoverPreview(null);
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('❌ Error al crear el libro:', err);
      setError(err.message || 'Error al crear el libro');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingBook) {
      setError('No hay libro para eliminar');
      return;
    }

    const confirmDelete = window.confirm(
      '¿Estás seguro de que quieres eliminar el ebook? Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    setDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      const { bookService } = await import('../services/bookService.js');

      console.log('🗑️ Deleting book:', existingBook.id);

      await bookService.deleteBook(existingBook.id);

      console.log('✅ Book deleted successfully');

      // Limpiar estados
      setExistingBook(null);
      setCoverPreview(null);
      setEbookFile(null);
      setCoverFile(null);
      setSuccess(true);

      // Mensaje de éxito
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('❌ Error al eliminar el libro:', err);
      setError(err.message || 'Error al eliminar el libro');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <h2 className="text-lg font-semibold text-accent">📘 Ebook de Nutrición</h2>
      <p className="mt-1 text-sm text-gray-400">
        Subí el PDF oficial y la portada que se entregarán junto al Plan Premium ($6,000 ARS).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Upload de archivos */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Archivo PDF *</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              disabled={uploading}
              className="mt-2 w-full rounded-md border border-brand-border bg-base p-3 text-sm text-gray-200 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black disabled:opacity-50"
            />
            {ebookFile && (
              <p className="mt-2 text-xs text-gray-500">
                ✅ <span className="text-white">{ebookFile.name}</span> ({(ebookFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-400">Portada (imagen) *</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleCoverUpload}
              disabled={uploading}
              className="mt-2 w-full rounded-md border border-brand-border bg-base p-3 text-sm text-gray-200 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black disabled:opacity-50"
            />
            {coverFile && (
              <p className="mt-2 text-xs text-gray-500">
                ✅ <span className="text-white">{coverFile.name}</span>
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={uploading || !ebookFile || !coverFile}
              className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? 'Subiendo archivos...' : 'Guardar Ebook'}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || !existingBook || loading}
              className="rounded-full bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : '🗑️ Eliminar'}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-brand-border bg-base p-6">
          {coverPreview ? (
            <>
              <img
                src={coverPreview}
                alt="Portada Ebook"
                className="w-48 rounded-md border border-brand-border shadow-lg"
              />
              <p className="text-xs text-center text-gray-400">
                Vista previa de la portada seleccionada
              </p>
            </>
          ) : (
            <div className="flex h-60 w-full items-center justify-center rounded-lg border border-dashed border-brand-border text-sm text-gray-500">
              Seleccioná una portada para ver la vista previa
            </div>
          )}
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-sm text-green-400">✅ Ebook guardado correctamente y listo para ser vendido</p>
        </div>
      )}
    </section>
  );
};

const downloadTextFile = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const exportPlan = usePDFExport();
  const { deleteRoutine, toggleRoutineActive } = useRoutineSync();
  const [uploadingPDFs, setUploadingPDFs] = useState(new Set());
  const [generatingAllPDFs, setGeneratingAllPDFs] = useState(false);

  // Estados para modales de confirmación
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, routineId: null, routineName: "" });
  const [toggleConfirm, setToggleConfirm] = useState({ open: false, routineId: null, routineName: "", isActive: false });

  const monthKeys = useMemo(() => {
    const set = new Set();
    state.sales.forEach((sale) => {
      if (sale.date) {
        set.add(sale.date.slice(0, 7));
      }
    });
    return Array.from(set).sort();
  }, [state.sales]);

  const latestMonthKey = state.metrics?.meses?.actual
    ?? (monthKeys.length ? monthKeys[monthKeys.length - 1] : null);
  const previousMonthKey = state.metrics?.meses?.anterior
    ?? (monthKeys.length > 1 ? monthKeys[monthKeys.length - 2] : null);

  const userByEmail = useMemo(() => {
    const map = new Map();
    state.users.forEach((user) => {
      map.set(user.email, user);
    });
    return map;
  }, [state.users]);

  const routineMap = useMemo(() => {
    const map = new Map();
    state.routines.forEach((routine) => {
      map.set(routine.id, routine);
    });
    return map;
  }, [state.routines]);

  const salesRecords = useMemo(() => {
    return state.sales.map((sale) => {
      const user = userByEmail.get(sale.userEmail);
      const routine = routineMap.get(sale.routineId);
      const clientName = user
        ? `${user.firstName} ${user.lastName}`.trim()
        : sale.userEmail;
      const planKey = (sale.planType || sale.plan || "").toLowerCase();
      const planInfo = PLAN_VARIANTS[planKey] || {
        label: sale.plan,
        className: "text-gray-400",
      };
      return {
        id: sale.id,
        clientName,
        email: sale.userEmail,
        plan: sale.plan,
        planKey,
        planLabel: planInfo.label || sale.plan,
        planClass: planInfo.className,
        planType: planKey,
        routineName: routine ? routine.name || routine.title : "Sin rutina",
        routineObjective: routine?.objective,
        date: sale.date,
        amount: sale.amount,
        routineId: sale.routineId,
      };
    });
  }, [state.sales, routineMap, userByEmail]);

  const metrics = useMemo(() => {
    const totalRevenue = state.sales.reduce(
      (sum, sale) => sum + sale.amount,
      0,
    );

    const revenueForMonth = (monthKey) =>
      monthKey
        ? state.sales
          .filter((sale) => sale.date.startsWith(monthKey))
          .reduce((sum, sale) => sum + sale.amount, 0)
        : 0;

    const downloadsForMonth = (monthKey) =>
      monthKey
        ? state.sales.filter((sale) => sale.date.startsWith(monthKey)).length
        : 0;

    const monthlyRevenue = state.metrics?.ingresosMensuales
      ?? revenueForMonth(latestMonthKey);
    const previousRevenue = revenueForMonth(previousMonthKey);

    const monthlyDownloads = state.metrics?.descargasMes
      ?? downloadsForMonth(latestMonthKey);
    const previousDownloads = downloadsForMonth(previousMonthKey);

    const totalClients = state.metrics?.totalUsuarios ?? state.users.length;
    const activeRoutines = state.metrics?.rutinasActivas ?? state.routines.length;
    const totalDownloads = state.sales.length;
    const averageTicket = state.metrics?.ticketPromedio
      ?? (totalDownloads ? totalRevenue / totalDownloads : 0);

    const monthlyRevenueVariation = state.metrics?.variacionIngresos
      ?? calculateVariation(monthlyRevenue, previousRevenue);
    const monthlyDownloadsVariation = state.metrics?.variacionDescargas
      ?? calculateVariation(monthlyDownloads, previousDownloads);

    return {
      values: {
        totalClients,
        totalRevenue,
        monthlyRevenue,
        monthlyDownloads,
        activeTemplates: activeRoutines,
        averageTicket,
      },
      variations: {
        monthlyRevenue: monthlyRevenueVariation,
        monthlyDownloads: monthlyDownloadsVariation,
      },
      months: {
        latest: latestMonthKey,
        previous: previousMonthKey,
        all: monthKeys,
      },
    };
  }, [
    state.metrics,
    state.sales,
    state.users,
    state.routines,
    latestMonthKey,
    previousMonthKey,
    monthKeys,
  ]);

  const routinePerformance = useMemo(() => {
    const stats = new Map();
    state.sales.forEach((sale) => {
      if (!stats.has(sale.routineId)) {
        stats.set(sale.routineId, {
          count: 0,
          lastDate: null,
        });
      }
      const entry = stats.get(sale.routineId);
      entry.count += 1;
      if (!entry.lastDate || entry.lastDate < sale.date) {
        entry.lastDate = sale.date;
      }
    });

    const topRoutines = Array.from(stats.entries())
      .map(([routineId, data]) => {
        const routine = routineMap.get(routineId) || {};
        return {
          id: routineId,
          name: routine.name || routine.title || `Rutina ${routineId}`,
          objective: routine.objective,
          count: data.count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const monthsRange = metrics.months?.latest
      ? Array.from({ length: 6 }).map((_, index) =>
        addMonths(metrics.months.latest, index - 5),
      )
      : (metrics.months?.all || monthKeys).slice(-6);

    const monthlyRevenueData = monthsRange.map((monthKey) => {
      const revenue = state.sales
        .filter((sale) => sale.date.startsWith(monthKey))
        .reduce((sum, sale) => sum + sale.amount, 0);
      return {
        key: monthKey,
        month: monthKey ? formatMonthLabel(monthKey) : "",
        revenue,
      };
    });

    const topRoutineChartData = topRoutines.map((routine) => ({
      name: routine.name,
      sales: routine.count,
    }));

    return {
      topRoutines,
      monthlyRevenueData,
      topRoutineChartData,
    };
  }, [state.sales, routineMap, metrics.months, monthKeys]);

  // Obtener emails únicos desde Supabase (solo de sales)
  const [uniqueEmails, setUniqueEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setEmailsLoading(true);
      try {
        const { supabase } = await import('../lib/supabase');

        // Llamar a la función RPC que obtiene emails únicos de sales
        const { data, error } = await supabase.rpc('get_sales_emails');

        if (error) {
          console.error('Error fetching emails via RPC:', error);
          // Fallback: usar emails del estado de sales
          const emailSet = new Set();
          state.sales.forEach((sale) => {
            if (sale.userEmail && sale.userEmail.trim()) {
              emailSet.add(sale.userEmail.trim().toLowerCase());
            }
          });
          setUniqueEmails(Array.from(emailSet).sort());
        } else if (data) {
          // Usar emails desde RPC
          setUniqueEmails(data.map(row => row.email).filter(Boolean));
        }
      } catch (err) {
        console.error('Error in fetchEmails:', err);
        // Fallback final
        const emailSet = new Set();
        state.sales.forEach((sale) => {
          if (sale.userEmail && sale.userEmail.trim()) {
            emailSet.add(sale.userEmail.trim().toLowerCase());
          }
        });
        setUniqueEmails(Array.from(emailSet).sort());
      } finally {
        setEmailsLoading(false);
      }
    };

    fetchEmails();
  }, [state.sales]);

  const handleCreateTemplate = () => {
    navigate("/admin/plantillas/nueva");
  };

  const handleGoToTemplates = () => {
    document
      .getElementById("templates-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEditTemplate = (template) => {
    navigate(`/admin/plantillas/${template.id}/editar`);
  };

  const handleDuplicateTemplate = (template) => {
    const clone = JSON.parse(JSON.stringify(template));
    clone.id = Date.now();
    clone.name = `${template.name} (copia)`;
    clone.createdAt = new Date().toISOString().slice(0, 10);
    dispatch({ type: "ADD_ROUTINE", payload: clone });
  };

  const handleDeleteTemplate = (templateId) => {
    const routine = state.routines.find(r => r.id === templateId);
    setDeleteConfirm({
      open: true,
      routineId: templateId,
      routineName: routine?.name || routine?.title || "esta rutina"
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRoutine(deleteConfirm.routineId);
      toast.success("Rutina eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando rutina:", error);
      toast.error("No se pudo eliminar la rutina. Intenta nuevamente.");
    }
  };

  const handleToggleActive = (templateId) => {
    const routine = state.routines.find(r => r.id === templateId);
    setToggleConfirm({
      open: true,
      routineId: templateId,
      routineName: routine?.name || routine?.title || "esta rutina",
      isActive: routine?.active || false
    });
  };

  const confirmToggle = async () => {
    try {
      const updated = await toggleRoutineActive(toggleConfirm.routineId);
      toast.success(`Rutina ${updated.active ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      console.error("Error cambiando estado de rutina:", error);
      toast.error("No se pudo cambiar el estado de la rutina. Intenta nuevamente.");
    }
  };

  const handleDownloadPDF = (template) => {
    const convertExercise = (exercise) => ({
      name: exercise.name || "",
      series: exercise.sets ?? exercise.series ?? "",
      reps: exercise.reps || "",
      rest: exercise.rest || "",
      rir: exercise.rir ?? "",
      tempo: exercise.tempo || "",
      video: exercise.video || "",
      notes: exercise.notes || exercise.note || "",
    });

    const weeks = (template.weeks || []).map((week, weekIndex) => ({
      title: week.title || `Semana ${weekIndex + 1}`,
      summary: week.summary || "",
      notes: week.notes || "",
      days: (week.days || []).map((day, dayIndex) => ({
        name: day.name || day.title || `Día ${dayIndex + 1}`,
        type: day.type || "ENTRENAMIENTO",
        exercises: (day.exercises || []).map(convertExercise),
      })),
    }));

    const planData = {
      planName: template.name,
      frequency: template.frequency ? `${template.frequency} días/semana` : "",
      objective: template.objective,
      weeks,
      notes: template.notes || "",
    };

    exportPlan(planData);
  };

  const handleUploadPDFToStorage = async (template) => {
    try {
      // Marcar como "subiendo"
      setUploadingPDFs(prev => new Set(prev).add(template.id));

      // Importar el servicio dinámicamente
      const { default: pdfGeneratorService } = await import('../services/pdfGeneratorService.jsx');

      // Generar y subir
      const result = await pdfGeneratorService.regenerateRoutinePDF(template);

      if (result.success) {
        // Mostrar toast de éxito (opcional, puedes usar tu sistema de toast)
        console.log(`✅ PDF de "${template.name}" subido exitosamente`);
        alert(`✅ PDF de "${template.name}" generado y subido al Storage correctamente`);
      } else {
        console.error(`❌ Error al generar PDF de "${template.name}":`, result.error);
        alert(`❌ Error al generar PDF: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al subir PDF:', error);
      alert(`❌ Error al subir PDF: ${error.message}`);
    } finally {
      // Quitar marca de "subiendo"
      setUploadingPDFs(prev => {
        const next = new Set(prev);
        next.delete(template.id);
        return next;
      });
    }
  };

  const handleGenerateAllPDFs = async () => {
    const confirmation = window.confirm(
      `¿Generar PDFs de todas las ${state.routines.length} rutinas?\n\nEsto puede tardar varios minutos.`
    );

    if (!confirmation) return;

    setGeneratingAllPDFs(true);

    try {
      const { default: pdfGeneratorService } = await import('../services/pdfGeneratorService.jsx');

      let successful = 0;
      let failed = 0;
      const errors = [];

      console.log(`🚀 Generando PDFs de ${state.routines.length} rutinas...`);

      for (let i = 0; i < state.routines.length; i++) {
        const routine = state.routines[i];

        try {
          console.log(`📄 [${i + 1}/${state.routines.length}] Procesando: ${routine.name}`);

          const result = await pdfGeneratorService.regenerateRoutinePDF(routine);

          if (result.success) {
            successful++;
            console.log(`  ✅ Completado`);
          } else {
            failed++;
            errors.push(`${routine.name}: ${result.error}`);
            console.error(`  ❌ Error:`, result.error);
          }
        } catch (error) {
          failed++;
          errors.push(`${routine.name}: ${error.message}`);
          console.error(`  ❌ Error:`, error);
        }

        // Pequeña pausa entre rutinas
        if (i < state.routines.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Mostrar resumen
      const summary = `
📊 RESUMEN DE GENERACIÓN:

✅ Exitosos: ${successful}/${state.routines.length}
❌ Fallidos: ${failed}/${state.routines.length}

${errors.length > 0 ? `\nErrores:\n${errors.map(e => `• ${e}`).join('\n')}` : ''}
      `.trim();

      console.log('\n' + summary);
      alert(summary);

    } catch (error) {
      console.error('Error en generación masiva:', error);
      alert(`❌ Error en generación masiva: ${error.message}`);
    } finally {
      setGeneratingAllPDFs(false);
    }
  };

  const handleExportEmails = () => {
    const emails = uniqueEmails.join(", ");
    downloadTextFile("clientes_fitter_emails.txt", emails);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const menuItems = [
    { label: "Dashboard", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "Plantillas", onClick: () => scrollToSection("templates-section") },
    { label: "Ventas", onClick: () => scrollToSection("sales-section") },
    { label: "Contactos", onClick: () => scrollToSection("contacts-section") }
  ];

  return (
    <div className="relative min-h-screen bg-base text-gray-200">
      {/* Navbar */}
      <div className="relative bg-gradient-to-b from-black/60 to-transparent pb-20">
        <Navbar menuItems={menuItems} />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
        <DashboardHeader
          onCreateTemplate={handleCreateTemplate}
          onGoToTemplates={handleGoToTemplates}
        />

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Usuarios totales"
            value={metrics.values.totalClients}
            icon={Users}
          />
          <MetricCard
            title="Ingresos totales"
            value={formatCurrency(metrics.values.totalRevenue)}
            subtitle={`Ticket promedio ${formatCurrency(metrics.values.averageTicket || 0)}`}
            icon={DollarSign}
          />
          <MetricCard
            title="Ingresos mensuales"
            value={formatCurrency(metrics.values.monthlyRevenue)}
            subtitle={`Var. ${formatVariation(metrics.variations.monthlyRevenue)}`}
            icon={TrendingUp}
          />
          <MetricCard
            title="Rutinas activas"
            value={metrics.values.activeTemplates}
            subtitle={`Descargas totales ${state.sales.length}`}
            icon={Layers}
          />
          <MetricCard
            title="Descargas del mes"
            value={metrics.values.monthlyDownloads}
            subtitle={`Var. ${formatVariation(metrics.variations.monthlyDownloads)}`}
            icon={Clock}
          />
        </section>

        <section id="sales-section" className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <DashboardCharts
            monthlyRevenueData={routinePerformance.monthlyRevenueData}
            topRoutineChartData={routinePerformance.topRoutineChartData}
            monthlyVariation={metrics.variations.monthlyRevenue}
            downloadsVariation={metrics.variations.monthlyDownloads}
          />
          <DashboardSales
            sales={salesRecords}
          />
        </section>

        <section id="templates-section">
          <DashboardTemplates
            routines={state.routines}
            onCreate={handleCreateTemplate}
            onEdit={handleEditTemplate}
            onDuplicate={handleDuplicateTemplate}
            onDelete={handleDeleteTemplate}
            onToggleActive={handleToggleActive}
            onExport={handleDownloadPDF}
            onUploadToStorage={handleUploadPDFToStorage}
            onGenerateAllPDFs={handleGenerateAllPDFs}
            uploadingPDFs={uploadingPDFs}
            generatingAllPDFs={generatingAllPDFs}
          />
        </section>

        <div id="contacts-section">
          <DashboardMailExport
            onExport={handleExportEmails}
            emailCount={uniqueEmails.length}
          />
        </div>

        <DashboardEbookManager />
      </div>

      {/* Footer */}
      <Footer />

      {/* Modales de Confirmación */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, routineId: null, routineName: "" })}
        onConfirm={confirmDelete}
        title="Eliminar Rutina"
        description={`¿Estás seguro de que deseas eliminar "${deleteConfirm.routineName}"? Esta acción no se puede deshacer y se eliminará permanentemente de la base de datos.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        icon="delete"
      />

      <ConfirmDialog
        open={toggleConfirm.open}
        onClose={() => setToggleConfirm({ open: false, routineId: null, routineName: "", isActive: false })}
        onConfirm={confirmToggle}
        title={toggleConfirm.isActive ? "Desactivar Rutina" : "Activar Rutina"}
        description={
          toggleConfirm.isActive
            ? `¿Deseas desactivar "${toggleConfirm.routineName}"? Los clientes no podrán verla en la landing hasta que la reactives.`
            : `¿Deseas activar "${toggleConfirm.routineName}"? Los clientes podrán verla y comprarla desde la landing.`
        }
        confirmText={toggleConfirm.isActive ? "Sí, Desactivar" : "Sí, Activar"}
        cancelText="Cancelar"
        variant={toggleConfirm.isActive ? "warning" : "success"}
        icon={toggleConfirm.isActive ? "toggle-off" : "toggle-on"}
      />
    </div>
  );
}

export default AdminDashboard;
