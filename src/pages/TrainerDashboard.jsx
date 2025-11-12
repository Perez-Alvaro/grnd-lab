import React, { useMemo, useState } from "react";
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
} from "lucide-react";

import { useAppContext } from "../context/AppContext.jsx";
import usePDFExport from "../hooks/usePDFExport.js";
import TemplateCard from "../components/Trainer/TemplateCard.jsx";
import {
  TRAINING_GOAL_LABELS,
  TRAINING_GOALS,
} from "../constants/objectives.js";

const planLabel = {
  basic: "Básico",
  Basic: "Básico",
  premium: "Premium",
  Premium: "Premium",
  essential: "Essential",
  Essential: "Essential",
};

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

const formatVariation = (value) => {
  if (value === null || Number.isNaN(value)) return "N/A";
  const rounded = Math.abs(value).toFixed(1);
  return `${value >= 0 ? "+" : "-"}${rounded}%`;
};

const DashboardHeader = ({ onCreateTemplate, onGoToTemplates }) => (
  <header className="flex flex-col gap-6 rounded-3xl border border-[#2E2E2E] bg-[#0E0E0E] p-8 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.85)] md:flex-row md:items-center md:justify-between">
    <div className="space-y-3">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#2E2E2E] px-4 py-1 text-xs uppercase tracking-[0.3em] text-gray-400">
        Panel Fitter
      </span>
      <h1 className="text-3xl font-semibold text-white md:text-4xl">
        Rendimiento del negocio fitness
      </h1>
      <p className="max-w-2xl text-sm text-gray-400 md:text-base">
        Seguimiento integral de ingresos, plantillas y comportamiento de tus
        clientes para tomar decisiones basadas en datos.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onGoToTemplates}
        className="inline-flex items-center gap-2 rounded-full border border-[#2E2E2E] bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-[#B5FF00]/60 hover:text-white"
      >
        <FileText className="h-4 w-4 text-[#B5FF00]" />
        Gestionar plantillas
      </button>
      <button
        onClick={onCreateTemplate}
        className="inline-flex items-center gap-2 rounded-full bg-[#B5FF00] px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
      >
        <Plus className="h-4 w-4" />
        Nueva plantilla
      </button>
    </div>
  </header>
);

const MetricCard = ({ title, value, subtitle, icon: Icon }) => (
  <article className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.8)]">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2E2E2E] bg-[#0E0E0E] text-[#B5FF00]">
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
    <div className="rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Ingresos mensuales
          </h3>
          <p className="text-sm text-gray-400">
            Últimos 6 meses • Variación {formatVariation(monthlyVariation)}
          </p>
        </div>
        <span className="rounded-full border border-[#B5FF00]/40 bg-[#1A1A1A] px-4 py-1 text-xs font-semibold text-[#B5FF00]">
          {formatVariation(monthlyVariation)}
        </span>
      </div>
      <div className="mt-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyRevenueData}>
            <CartesianGrid stroke="#2E2E2E" />
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
                border: "1px solid #2E2E2E",
                color: "#FFFFFF",
              }}
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#B5FF00"
              strokeWidth={2}
              dot={{ stroke: "#B5FF00", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Rutinas destacadas
          </h3>
          <p className="text-sm text-gray-400">Top 5 por descargas</p>
        </div>
        <span className="rounded-full border border-[#B5FF00]/40 bg-[#1A1A1A] px-4 py-1 text-xs font-semibold text-[#B5FF00]">
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
            <CartesianGrid stroke="#2E2E2E" />
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
                border: "1px solid #2E2E2E",
                color: "#FFFFFF",
              }}
            />
            <Bar
              dataKey="sales"
              fill="#B5FF00"
              barSize={25}
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const DashboardSales = ({ sales, onExportEmails }) => {
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
    <section className="flex h-full flex-col gap-6 rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
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
            className="rounded-full border border-[#2E2E2E] bg-[#1A1A1A] px-4 py-2 text-sm text-gray-200 focus:border-[#B5FF00] focus:outline-none"
          >
            <option value="all">Todos los planes</option>
            <option value="basic">Básico</option>
            <option value="premium">Premium</option>
          </select>
          <button
            type="button"
            onClick={onExportEmails}
            className="inline-flex items-center gap-2 rounded-full border border-[#B5FF00] px-4 py-2 text-sm font-semibold text-[#0E0E0E] transition-all hover:-translate-y-0.5 hover:bg-[#B5FF00]"
          >
            <Mail className="h-4 w-4 text-black" />
            Descargar emails
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#2E2E2E]">
        <table className="min-w-full divide-y divide-[#2E2E2E] text-sm">
          <thead className="bg-[#101010] text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Cliente</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Plan</th>
              <th className="px-4 py-3 text-left font-medium">Rutina</th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("amount")}
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-[#B5FF00]"
                >
                  Monto
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("date")}
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-[#B5FF00]"
                >
                  Fecha
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E2E2E] bg-[#0E0E0E] text-gray-300">
            {paginatedSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-[#1A1A1A]">
                <td className="px-4 py-3 text-white">{sale.clientName}</td>
                <td className="px-4 py-3">{sale.email}</td>
                <td className="px-4 py-3 capitalize text-[#B5FF00]">
                  {planLabel[sale.plan] || sale.plan}
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

      <div className="flex flex-col gap-4 border-t border-[#2E2E2E] pt-4 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
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
            className="rounded-full border border-[#2E2E2E] px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-[#B5FF00]/60 hover:text-white"
          >
            Anterior
          </button>
          <span className="text-xs text-gray-500">
            Página {currentPage + 1} de {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(pageCount - 1, prev + 1))}
            className="rounded-full border border-[#2E2E2E] px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-[#B5FF00]/60 hover:text-white"
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
  onExport,
}) => {
  const [filters, setFilters] = useState({
    tag: "",
    gender: "",
    objective: "",
  });

  const availableTags = useMemo(() => {
    const set = new Set();
    routines.forEach((template) =>
      (template.tags || []).forEach((tag) => set.add(tag)),
    );
    return Array.from(set);
  }, [routines]);

  const filteredRoutines = useMemo(() => {
    return routines.filter((template) => {
      if (filters.tag && !template.tags?.includes(filters.tag)) return false;
      if (filters.gender && template.gender !== filters.gender) return false;
      if (filters.objective && template.objective !== filters.objective)
        return false;
      return true;
    });
  }, [routines, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => setFilters({ tag: "", gender: "", objective: "" });

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
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
            className="rounded-full border border-[#2E2E2E] px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-[#B5FF00]/60 hover:text-white"
          >
            Limpiar filtros
          </button>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-full bg-[#B5FF00] px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
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
            className="rounded-lg border border-[#2E2E2E] bg-[#1A1A1A] px-3 py-2 text-sm text-gray-200 focus:border-[#B5FF00] focus:outline-none"
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
            className="rounded-lg border border-[#2E2E2E] bg-[#1A1A1A] px-3 py-2 text-sm text-gray-200 focus:border-[#B5FF00] focus:outline-none"
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
            className="rounded-lg border border-[#2E2E2E] bg-[#1A1A1A] px-3 py-2 text-sm text-gray-200 focus:border-[#B5FF00] focus:outline-none"
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredRoutines.map((template) => (
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

      {filteredRoutines.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#2E2E2E] bg-[#101010] py-12 text-center text-sm text-gray-500">
          No hay plantillas para los filtros seleccionados.
        </div>
      )}
    </section>
  );
};

const DashboardMailExport = ({ onExport, emailCount }) => (
  <section className="rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)]">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-[#B5FF00]">
          Exportar correos de clientes
        </h3>
        <p className="text-sm text-gray-400">
          Generá un archivo listo para Gmail con todos los contactos de tus
          compradores.
        </p>
        <p className="text-xs text-gray-500">
          Correos únicos disponibles: {emailCount}
        </p>
      </div>
      <button
        onClick={onExport}
        className="inline-flex items-center gap-2 rounded-full bg-[#B5FF00] px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
      >
        <Mail className="h-4 w-4" />
        Descargar (.txt)
      </button>
    </div>
  </section>
);

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

  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const previousMonthKey = addMonths(currentMonthKey, -1);

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
      return {
        id: sale.id,
        clientName,
        email: sale.userEmail,
        plan: sale.plan,
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
    const monthlyRevenue = state.sales
      .filter((sale) => sale.date.startsWith(currentMonthKey))
      .reduce((sum, sale) => sum + sale.amount, 0);
    const previousRevenue = state.sales
      .filter((sale) => sale.date.startsWith(previousMonthKey))
      .reduce((sum, sale) => sum + sale.amount, 0);

    const monthlyDownloads = state.sales.filter((sale) =>
      sale.date.startsWith(currentMonthKey),
    ).length;
    const previousDownloads = state.sales.filter((sale) =>
      sale.date.startsWith(previousMonthKey),
    ).length;

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
    const activeRoutines = state.routines.length;
    const averageTicket = totalDownloads ? totalRevenue / totalDownloads : 0;

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
    };
  }, [
    state.sales,
    state.users,
    state.routines,
    currentMonthKey,
    previousMonthKey,
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

    const monthsRange = Array.from({ length: 6 }).map((_, index) =>
      addMonths(currentMonthKey, index - 5),
    );

    const monthlyRevenueData = monthsRange.map((monthKey) => {
      const revenue = state.sales
        .filter((sale) => sale.date.startsWith(monthKey))
        .reduce((sum, sale) => sum + sale.amount, 0);
      return {
        key: monthKey,
        month: formatMonthLabel(monthKey),
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
  }, [state.sales, routineMap, currentMonthKey]);

  const uniqueEmails = useMemo(() => {
    return Array.from(new Set(salesRecords.map((sale) => sale.email)));
  }, [salesRecords]);

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
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta plantilla?")
    ) {
      dispatch({ type: "DELETE_ROUTINE", payload: templateId });
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
    downloadTextFile("clientes_fitter_emails.txt", emails);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-gray-200">
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

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <DashboardCharts
            monthlyRevenueData={routinePerformance.monthlyRevenueData}
            topRoutineChartData={routinePerformance.topRoutineChartData}
            monthlyVariation={metrics.variations.monthlyRevenue}
            downloadsVariation={metrics.variations.monthlyDownloads}
          />
          <DashboardSales
            sales={salesRecords}
            onExportEmails={handleExportEmails}
          />
        </section>

        <section id="templates-section">
          <DashboardTemplates
            routines={state.routines}
            onCreate={handleCreateTemplate}
            onEdit={handleEditTemplate}
            onDuplicate={handleDuplicateTemplate}
            onDelete={handleDeleteTemplate}
            onExport={handleDownloadPDF}
          />
        </section>

        <DashboardMailExport
          onExport={handleExportEmails}
          emailCount={uniqueEmails.length}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
