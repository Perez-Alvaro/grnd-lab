import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
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
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Filter,
  Layers3,
  Mail,
  PieChart,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { useAppContext } from "../context/AppContext.jsx";
import usePDFExport from "../hooks/usePDFExport.js";
import TemplateCard from "../components/TemplateCard.jsx";
import {
  TRAINING_GOAL_LABELS,
  TRAINING_GOALS,
} from "../constants/objectives.js";

const planLabel = { basic: "Básico", premium: "Premium" };

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

const formatCurrency = (value) =>
  value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const variationColor = (value) => {
  if (value === null || Number.isNaN(value)) return "text-gray-400";
  return value >= 0 ? "text-lime-400" : "text-orange-400";
};

const variationIcon = (value) => {
  if (value === null || Number.isNaN(value)) return null;
  return value >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
};

const formatVariation = (value) => {
  if (value === null || Number.isNaN(value)) return "N/A";
  const rounded = Math.abs(value).toFixed(1);
  return `${value >= 0 ? "+" : "-"}${rounded}%`;
};

const DashboardNavbar = ({ sections, activeSection, onSelect }) => (
  <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur border-b border-neutral-900">
    <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Panel</p>
        <h1 className="text-2xl font-semibold text-white">Entrenador Personal</h1>
      </div>
      <div className="flex items-center gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
              activeSection === section.id
                ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_rgba(181,255,0,0.25)]"
                : "bg-neutral-900/60 text-gray-400 border-neutral-800 hover:text-white hover:border-lime-400/40"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  </header>
);

const DashboardHeader = ({ onCreateTemplate, onGoToTemplates }) => (
  <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6" id="resumen">
    <div>
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <Sparkles className="h-5 w-5 text-lime-400" />
        <span>Resumen actualizado</span>
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2">
        Rendimiento del negocio fitness
      </h2>
      <p className="text-gray-400 mt-2 max-w-2xl">
        Seguimiento integral de ingresos, plantillas y comportamiento de tus clientes para tomar decisiones comerciales con foco en resultados.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onGoToTemplates}
        className="px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/70 text-gray-200 hover:border-lime-400/50 transition-all"
      >
        <FileText className="h-4 w-4 inline-block mr-2 text-lime-400" />
        Gestionar plantillas
      </button>
      <button
        onClick={onCreateTemplate}
        className="px-4 py-2 rounded-full bg-lime-400 text-black font-semibold hover:bg-lime-500 transition-all shadow-[0_0_12px_rgba(181,255,0,0.3)]"
      >
        <Plus className="h-4 w-4 inline-block mr-2" />
        Nueva plantilla
      </button>
    </div>
  </section>
);

const MetricCard = ({ title, value, icon: Icon, subtitle }) => (
  <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 shadow-lime-400/5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-2 rounded-full bg-neutral-950 border border-neutral-800 text-lime-400">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const DashboardSummary = ({ metrics, variations, topRoutines, newTemplates, staleTemplates }) => (
  <section id="summary" className="flex flex-col gap-8">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      <MetricCard title="Usuarios totales" value={metrics.totalClients} icon={Users} />
      <MetricCard title="Ingresos totales" value={formatCurrency(metrics.totalRevenue)} icon={DollarSign} subtitle={`Ticket promedio ${formatCurrency(metrics.averageTicket)}`} />
      <MetricCard title="Ingresos mensuales" value={formatCurrency(metrics.monthlyRevenue)} icon={TrendingUp} subtitle={`Var: ${formatVariation(variations.monthlyRevenue)} vs. mes anterior`} />
      <MetricCard title="Rutinas activas" value={metrics.activeTemplates} icon={Layers3} subtitle={`Descargas totales ${metrics.totalDownloads}`} />
      <MetricCard title="Descargas del mes" value={metrics.monthlyDownloads} icon={PieChart} subtitle={`Var: ${formatVariation(variations.monthlyDownloads)} vs. mes anterior`} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Top 5 rutinas más vendidas</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-lime-400">Performance</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-xs uppercase">
            <tr className="border-b border-neutral-800">
              <th className="py-3 text-left font-medium">Rutina</th>
              <th className="py-3 text-left font-medium">Plan</th>
              <th className="py-3 text-left font-medium">Ventas</th>
              <th className="py-3 text-left font-medium">Última descarga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {topRoutines.map((routine) => (
              <tr key={routine.id} className="hover:bg-neutral-950/60 transition-colors">
                <td className="py-3 pr-4">
                  <p className="text-white font-medium">{routine.name}</p>
                  <p className="text-xs text-gray-500">{TRAINING_GOAL_LABELS[routine.objective] || routine.objective}</p>
                </td>
                <td className="py-3 text-sm text-gray-300">{planLabel[routine.plan] || "-"}</td>
                <td className="py-3 text-lime-400 font-semibold">{routine.count}</td>
                <td className="py-3 text-sm text-gray-400">{routine.lastDate}</td>
              </tr>
            ))}
            {topRoutines.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Aún no hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-5">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Rutinas nuevas este mes</h3>
            <Calendar className="h-5 w-5 text-lime-400" />
          </div>
          {newTemplates.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {newTemplates.map((template) => (
                <li key={template.id} className="text-sm">
                  <p className="text-white font-medium">{template.name}</p>
                  <p className="text-xs text-gray-500">{new Date(template.createdAt).toLocaleDateString("es-AR")}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">Sin nuevas rutinas en el mes actual.</p>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Rutinas para actualizar</h3>
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>
          {staleTemplates.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {staleTemplates.map((template) => (
                <li key={template.id} className="text-sm">
                  <p className="text-white font-medium">{template.name}</p>
                  <p className="text-xs text-gray-500">
                    Última venta: {template.lastSale ?? "Sin ventas"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">Todas las rutinas tuvieron ventas recientes.</p>
          )}
        </div>
      </div>
    </div>
  </section>
);

const DashboardCharts = ({ monthlyRevenueData, topRoutineChartData, variations }) => (
  <section id="charts" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Evolución de ingresos</h3>
          <p className="text-sm text-gray-500">Últimos 6 meses • Variación {formatVariation(variations.monthlyRevenue)}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${variationColor(variations.monthlyRevenue)} border-lime-400/30`}>
          {variationIcon(variations.monthlyRevenue)}
          <span className="text-xs font-semibold">
            {formatVariation(variations.monthlyRevenue)}
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#565656" />
            <YAxis stroke="#565656" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                borderRadius: "0.75rem",
                border: "1px solid #333",
                color: "#F5F5F5",
              }}
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Line type="monotone" dataKey="revenue" stroke="#B5FF00" strokeWidth={2} dot={{ stroke: "#B5FF00", r: 4 }} fill="#1A1A1A" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Rutinas destacadas</h3>
          <p className="text-sm text-gray-500">Top 5 por descargas</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${variationColor(variations.monthlyDownloads)} border-lime-400/30`}>
          <CreditCard className="h-4 w-4 text-lime-400" />
          <span className="text-xs font-semibold text-gray-200">
            {formatVariation(variations.monthlyDownloads)}
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topRoutineChartData} layout="vertical" margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
            <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
            <XAxis type="number" stroke="#565656" allowDecimals={false} />
            <YAxis dataKey="name" type="category" stroke="#565656" width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                borderRadius: "0.75rem",
                border: "1px solid #333",
                color: "#F5F5F5",
              }}
            />
            <Bar dataKey="sales" fill="#B5FF00" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </section>
);

const DashboardTemplates = ({
  templates,
  onCreate,
  onEdit,
  onDuplicate,
  onDelete,
  onExport,
}) => {
  const [filters, setFilters] = useState({
    tag: "",
    gender: "",
    frequency: "",
    objective: "",
  });

  const availableTags = useMemo(() => {
    const set = new Set();
    templates.forEach((template) => (template.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      if (filters.tag && !template.tags?.includes(filters.tag)) return false;
      if (filters.gender && template.gender !== filters.gender) return false;
      if (filters.frequency && String(template.frequency) !== filters.frequency) return false;
      if (filters.objective && template.objective !== filters.objective) return false;
      return true;
    });
  }, [templates, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="templates" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Plantillas</p>
          <h3 className="text-2xl font-semibold text-white">Gestión de rutinas</h3>
          <p className="text-sm text-gray-400 mt-1">Editá, duplicá o exportá tus planes personalizados.</p>
        </div>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-full bg-lime-400 text-black font-semibold hover:bg-lime-500 transition-all"
        >
          <Plus className="h-4 w-4 inline-block mr-2" />
          Nueva plantilla
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
        <label className="flex flex-col gap-2">
          <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Etiqueta</span>
          <select
            value={filters.tag}
            onChange={(event) => handleFilterChange("tag", event.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Género</span>
          <select
            value={filters.gender}
            onChange={(event) => handleFilterChange("gender", event.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Frecuencia</span>
          <select
            value={filters.frequency}
            onChange={(event) => handleFilterChange("frequency", event.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {[1, 2, 3, 4, 5, 6].map((freq) => (
              <option key={freq} value={String(freq)}>
                {freq}x / semana
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Objetivo</span>
          <select
            value={filters.objective}
            onChange={(event) => handleFilterChange("objective", event.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            {TRAINING_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {TRAINING_GOAL_LABELS[goal]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={() => onEdit(template)}
            onDuplicate={() => onDuplicate(template)}
            onDelete={() => onDelete(template.id)}
            onExportPdf={() => onExport(template)}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-neutral-800 rounded-2xl">
          <Filter className="h-8 w-8 text-gray-600" />
          <p className="mt-3 text-sm text-gray-400">Sin plantillas para los filtros seleccionados.</p>
          <button
            onClick={() => setFilters({ tag: "", gender: "", frequency: "", objective: "" })}
            className="mt-4 px-4 py-2 rounded-full border border-neutral-800 text-gray-200 hover:border-lime-400/50"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  );
};

const DashboardMailExport = ({ onExport, emailCount }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div>
      <h3 className="text-lg font-semibold text-lime-400">Lista de contactos</h3>
      <p className="text-sm text-gray-400">
        Descargá todos los correos de tus clientes para impulsar campañas de marketing directas.
      </p>
      <p className="text-xs text-gray-500 mt-2">Correos únicos disponibles: {emailCount}</p>
    </div>
    <button
      onClick={onExport}
      className="px-4 py-2 rounded-full bg-lime-400 text-black font-semibold hover:bg-lime-500 transition-all shadow-[0_0_12px_rgba(181,255,0,0.3)]"
    >
      <Mail className="h-4 w-4 inline-block mr-2" />
      Descargar Emails (.txt)
    </button>
  </div>
);

const DashboardSalesTable = ({ sales, onExportEmails, emailCount }) => {
  const [planFilter, setPlanFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const filteredSales = useMemo(() => {
    const filtered = sales.filter((sale) =>
      planFilter === "all" ? true : sale.plan === planFilter,
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

  const totalAmount = useMemo(() => {
    return filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
  }, [filteredSales]);

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

  const sortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <section id="ventas" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Ventas</p>
          <h3 className="text-2xl font-semibold text-white">Historial de ingresos</h3>
          <p className="text-sm text-gray-400">Seguimiento detallado de clientes, planes y montos.</p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-full p-1 text-sm">
          {[{ id: "all", label: "Todos" }, { id: "premium", label: "Premium" }, { id: "basic", label: "Básico" }].map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setPlanFilter(filter.id);
                setPage(0);
              }}
              className={`px-4 py-1.5 rounded-full transition-all ${
                planFilter === filter.id
                  ? "bg-lime-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-neutral-900 text-lime-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rutina</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("date")}>Fecha {sortIndicator("date")}</th>
              <th className="px-4 py-3 text-right cursor-pointer" onClick={() => handleSort("amount")}>Monto {sortIndicator("amount")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {paginatedSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-neutral-950/70 transition-colors">
                <td className="px-4 py-3 text-left text-white">{sale.clientName}</td>
                <td className="px-4 py-3 text-center text-gray-400">{sale.email}</td>
                <td className="px-4 py-3 text-center text-gray-200">{sale.templateName}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    sale.plan === "premium"
                      ? "bg-lime-400/20 text-lime-300 border border-lime-400/40"
                      : "bg-neutral-800/80 text-gray-300 border border-neutral-700"
                  }`}>
                    {planLabel[sale.plan]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-300">
                  {new Date(sale.date).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3 text-right text-lime-400 font-semibold">
                  {formatCurrency(sale.amount)}
                </td>
              </tr>
            ))}
            {paginatedSales.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No hay ventas para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-sm text-gray-300">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-gray-200">
            Total filtrado: <span className="text-lime-400 font-semibold">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-gray-200">
            Descargas: <span className="text-lime-400 font-semibold">{totalDownloads}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(currentPage - 1, 0))}
            className="px-3 py-1 rounded-full border border-neutral-800 text-gray-300 hover:border-lime-400/40"
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <span className="text-xs text-gray-500">
            Página {currentPage + 1} de {pageCount}
          </span>
          <button
            onClick={() => setPage(Math.min(currentPage + 1, pageCount - 1))}
            className="px-3 py-1 rounded-full border border-neutral-800 text-gray-300 hover:border-lime-400/40"
            disabled={currentPage >= pageCount - 1}
          >
            Siguiente
          </button>
        </div>
      </div>

      <DashboardMailExport onExport={onExportEmails} emailCount={emailCount} />
    </section>
  );
};

function AdminDashboard() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const exportPlan = usePDFExport();
  const [activeSection, setActiveSection] = useState("summary");

  const sectionRefs = {
    summary: useRef(null),
    charts: useRef(null),
    templates: useRef(null),
    ventas: useRef(null),
  };

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);
  const previousMonthKey = useMemo(() => addMonths(currentMonthKey, -1), [currentMonthKey]);

  const templateMap = useMemo(() => {
    const map = new Map();
    state.templates.forEach((template) => {
      map.set(template.id, template);
    });
    return map;
  }, [state.templates]);

  const userByEmail = useMemo(() => {
    const map = new Map();
    state.users.forEach((user) => {
      map.set(user.email, user);
    });
    return map;
  }, [state.users]);

  const salesRecords = useMemo(() => {
    return state.sales.map((sale) => {
      const user = userByEmail.get(sale.userEmail);
      const template = templateMap.get(sale.templateId);
      const clientName = user
        ? `${user.firstName} ${user.lastName}`.trim()
        : sale.userEmail;
      return {
        id: sale.id,
        clientName,
        email: sale.userEmail,
        plan: sale.plan,
        templateName: template ? template.name : "Sin plantilla",
        templateObjective: template?.objective,
        date: sale.date,
        amount: sale.amount,
        templateId: sale.templateId,
      };
    });
  }, [state.sales, templateMap, userByEmail]);

  const metrics = useMemo(() => {
    const totalRevenue = state.sales.reduce((sum, sale) => sum + sale.amount, 0);
    const monthlyRevenue = state.sales
      .filter((sale) => sale.date.startsWith(currentMonthKey))
      .reduce((sum, sale) => sum + sale.amount, 0);
    const previousRevenue = state.sales
      .filter((sale) => sale.date.startsWith(previousMonthKey))
      .reduce((sum, sale) => sum + sale.amount, 0);

    const monthlyDownloads = state.sales.filter((sale) => sale.date.startsWith(currentMonthKey)).length;
    const previousDownloads = state.sales.filter((sale) => sale.date.startsWith(previousMonthKey)).length;

    const monthlyRevenueVariation = previousRevenue
      ? ((monthlyRevenue - previousRevenue) / previousRevenue) * 100
      : previousRevenue === 0 && monthlyRevenue > 0
        ? 100
        : null;

    const monthlyDownloadsVariation = previousDownloads
      ? ((monthlyDownloads - previousDownloads) / previousDownloads) * 100
      : previousDownloads === 0 && monthlyDownloads > 0
        ? 100
        : null;

    const totalClients = state.users.length;
    const totalDownloads = state.sales.length;
    const activeTemplates = state.templates.length;
    const averageTicket = totalDownloads ? totalRevenue / totalDownloads : 0;

    return {
      values: {
        totalClients,
        totalRevenue,
        monthlyRevenue,
        monthlyDownloads,
        totalDownloads,
        activeTemplates,
        averageTicket,
      },
      variations: {
        monthlyRevenue: monthlyRevenueVariation,
        monthlyDownloads: monthlyDownloadsVariation,
      },
    };
  }, [state.sales, state.users, state.templates, currentMonthKey, previousMonthKey]);

  const templatePerformance = useMemo(() => {
    const stats = new Map();
    state.sales.forEach((sale) => {
      if (!stats.has(sale.templateId)) {
        stats.set(sale.templateId, {
          count: 0,
          lastDate: null,
          plans: {},
        });
      }
      const entry = stats.get(sale.templateId);
      entry.count += 1;
      entry.plans[sale.plan] = (entry.plans[sale.plan] || 0) + 1;
      if (!entry.lastDate || entry.lastDate < sale.date) {
        entry.lastDate = sale.date;
      }
    });

    const topRoutines = Array.from(stats.entries())
      .map(([templateId, data]) => {
        const template = templateMap.get(templateId) || {};
        const plan = Object.entries(data.plans).sort((a, b) => b[1] - a[1])[0]?.[0];
        return {
          id: templateId,
          name: template.name || `Plantilla ${templateId}`,
          objective: template.objective,
          count: data.count,
          plan,
          lastDate: data.lastDate,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const newTemplates = state.templates.filter((template) => template.createdAt?.startsWith(currentMonthKey));

    const staleThreshold = addMonths(currentMonthKey, -2);
    const staleTemplates = state.templates
      .map((template) => {
        const perf = stats.get(template.id);
        return {
          id: template.id,
          name: template.name,
          lastSale: perf?.lastDate || null,
        };
      })
      .filter((template) => {
        if (!template.lastSale) return true;
        return template.lastSale < `${staleThreshold}-01`;
      })
      .sort((a, b) => {
        const dateA = a.lastSale || "";
        const dateB = b.lastSale || "";
        return dateA.localeCompare(dateB);
      })
      .slice(0, 5);

    const monthsRange = Array.from({ length: 6 })
      .map((_, index) => addMonths(currentMonthKey, index - 5));

    const monthlyRevenueData = monthsRange.map((monthKey) => {
      const revenue = state.sales
        .filter((sale) => sale.date.startsWith(monthKey))
        .reduce((sum, sale) => sum + sale.amount, 0);
      const downloads = state.sales.filter((sale) => sale.date.startsWith(monthKey)).length;
      return {
        key: monthKey,
        month: formatMonthLabel(monthKey),
        revenue,
        downloads,
      };
    });

    const topRoutineChartData = topRoutines.map((routine) => ({
      name: routine.name,
      sales: routine.count,
    }));

    return {
      topRoutines,
      newTemplates,
      staleTemplates,
      monthlyRevenueData,
      topRoutineChartData,
    };
  }, [state.sales, state.templates, templateMap, currentMonthKey]);

  const uniqueEmails = useMemo(() => {
    return Array.from(new Set(salesRecords.map((sale) => sale.email)));
  }, [salesRecords]);

  const handleCreateTemplate = () => {
    navigate("/admin/plantillas/nueva");
  };

  const handleEditTemplate = (template) => {
    navigate(`/admin/plantillas/${template.id}/editar`);
  };

  const handleDuplicateTemplate = (template) => {
    const clone = JSON.parse(JSON.stringify(template));
    clone.id = Date.now();
    clone.name = `${template.name} (copia)`;
    clone.createdAt = new Date().toISOString().slice(0, 10);
    dispatch({ type: "ADD_TEMPLATE", payload: clone });
  };

  const handleDeleteTemplate = (templateId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta plantilla?")
    ) {
      dispatch({ type: "DELETE_TEMPLATE", payload: templateId });
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

  const handleExportEmails = () => {
    const emails = uniqueEmails.join(", ");
    const blob = new Blob([emails], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "clientes_fitter_emails.txt");
  };

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    const ref = sectionRefs[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sections = [
    { id: "summary", label: "Resumen" },
    { id: "charts", label: "Analítica" },
    { id: "templates", label: "Plantillas" },
    { id: "ventas", label: "Ventas" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-950 text-gray-200">
      <DashboardNavbar
        sections={sections}
        activeSection={activeSection}
        onSelect={handleSelectSection}
      />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
        <div ref={sectionRefs.summary} className="flex flex-col gap-10">
          <DashboardHeader
            onCreateTemplate={handleCreateTemplate}
            onGoToTemplates={() => handleSelectSection("templates")}
          />

          <DashboardSummary
            metrics={metrics.values}
            variations={metrics.variations}
            topRoutines={templatePerformance.topRoutines}
            newTemplates={templatePerformance.newTemplates}
            staleTemplates={templatePerformance.staleTemplates}
          />
        </div>

        <div ref={sectionRefs.charts}>
          <DashboardCharts
            monthlyRevenueData={templatePerformance.monthlyRevenueData}
            topRoutineChartData={templatePerformance.topRoutineChartData}
            variations={metrics.variations}
          />
        </div>

        <div ref={sectionRefs.templates}>
          <DashboardTemplates
            templates={state.templates}
            onCreate={handleCreateTemplate}
            onEdit={handleEditTemplate}
            onDuplicate={handleDuplicateTemplate}
            onDelete={handleDeleteTemplate}
            onExport={handleDownloadPDF}
          />
        </div>

        <div ref={sectionRefs.ventas}>
          <DashboardSalesTable
            sales={salesRecords}
            onExportEmails={handleExportEmails}
            emailCount={uniqueEmails.length}
          />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
