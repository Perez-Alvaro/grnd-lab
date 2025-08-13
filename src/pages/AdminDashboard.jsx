import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { generateRoutinePdf } from '../utils/pdf.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import {
  Users,
  CreditCard,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  PieChart,
  Monitor,
  MessageCircle,


  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const planLabel = { basic: 'básico', premium: 'premium' };

function AdminDashboard() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Eye },
    { id: 'templates', label: 'Plantillas', icon: FileText },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'sales', label: 'Ventas', icon: CreditCard }
  ];

  const currentMonth = new Date().toISOString().slice(0, 7);
  const stats = {
    totalUsers: state.users.length,
    totalSales: state.sales.reduce((sum, sale) => sum + sale.amount, 0),
    monthlySales: state.sales
      .filter(sale => sale.date.startsWith(currentMonth))
      .reduce((sum, sale) => sum + sale.amount, 0),
    totalTemplates: state.templates.length,
    salesCount: state.sales.length,
    activeRoutines: state.users.filter(u => u.plan === 'premium').length,
  };

  const salesByPlan = state.sales.reduce((acc, sale) => {
    acc[sale.plan] = (acc[sale.plan] || 0) + 1;
    return acc;
  }, {});
  const totalSalesCount = Object.values(salesByPlan).reduce((a, b) => a + b, 0);
  const salesPercentages = {
    basic: totalSalesCount ? ((salesByPlan.basic || 0) / totalSalesCount) * 100 : 0,
    premium: totalSalesCount ? ((salesByPlan.premium || 0) / totalSalesCount) * 100 : 0,
  };

  const handleCreateTemplate = () => {
    navigate('/admin/plantillas/nueva');
  };

  const handleEditTemplate = (template) => {
    navigate(`/admin/plantillas/${template.id}/editar`);
  };

  const handleDuplicateTemplate = (template) => {
    const clone = JSON.parse(JSON.stringify(template));
    clone.id = Date.now();
    clone.name = `${template.name} (copia)`;
    clone.createdAt = new Date().toISOString().slice(0, 10);
    dispatch({ type: 'ADD_TEMPLATE', payload: clone });
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      dispatch({ type: 'DELETE_TEMPLATE', payload: templateId });
    }
  };

  const handleDownloadPDF = (template) => {
    const migrate = (tmpl) => {
      if (tmpl.days && tmpl.days.every(d => d.bloques)) return tmpl;
      const convert = ex => ({
        ejercicio: ex.name || '',
        variantes: [{
          series: ex.sets != null ? String(ex.sets) : '',
          reps: ex.reps || '',
          descanso: ex.rest || '',
          cadencia: ex.cadence || 'S/D',
          rir: ex.rir != null ? String(ex.rir) : 'S/D'
        }],
        videoUrl: ex.youtubeLink || '',
        notes: ex.notes || ''
      });
      const days = tmpl.days.map((day, i) => {
        if (day.bloques) return day;
        const items = [];
        if (day.warmup) items.push(...day.warmup.map(convert));
        if (day.exercises) items.push(...day.exercises.map(convert));
        return {
          title: day.title || `Día ${i + 1}`,
          bloques: [{ titulo: 'Entrenamiento', tipo: 'normal', items }]
        };
      });
      return { ...tmpl, days };
    };

    const migrated = migrate(template);

    const data = {
      planName: migrated.name,
      objective: migrated.objective,
      frecuencia: `${migrated.frequency} días/semana`,
      dias: migrated.days,
    };

    generateRoutinePdf(data);
  };

  const handleSendWhatsApp = (user) => {
    const message = `Hola ${user.email}! Gracias por sumarte al plan premium. Acá tenés el grupo con atención personalizada: https://chat.whatsapp.com/tu-enlace`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-[#787878]">Gestiona plantillas, usuarios y seguimiento de ventas</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Usuarios Totales</p>
              <p className="text-2xl font-bold text-[#CBFF00]">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold text-[#CBFF00]">${stats.totalSales.toFixed(2)}</p>
              <p className="text-sm text-[#787878]">Este mes: ${stats.monthlySales.toFixed(2)}</p>
              <p className="text-sm text-[#787878]">Ventas: {stats.salesCount}</p>
            </div>
            <DollarSign className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Plantillas</p>
              <p className="text-2xl font-bold text-[#CBFF00]">{stats.totalTemplates}</p>
              <p className="text-sm text-[#787878]">Rutinas activas: {stats.activeRoutines}</p>
            </div>
            <FileText className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Distribución de Planes</p>
              <p className="text-lg font-bold text-[#CBFF00]">
                Básico {salesPercentages.basic.toFixed(0)}% • Premium {salesPercentages.premium.toFixed(0)}%
              </p>
            </div>
            <PieChart className="h-8 w-8 text-[#787878]" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#2D2D2D] rounded-2xl border border-[#787878]/20 overflow-hidden">
        <div className="flex border-b border-[#787878]/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#CBFF00]/10 text-[#CBFF00] border-b-2 border-[#CBFF00]'
                    : 'text-[#787878] hover:text-white hover:bg-[#787878]/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab state={state} />}
          {activeTab === 'templates' && (
            <TemplatesTab
              state={state}
              onCreateTemplate={handleCreateTemplate}
              onEditTemplate={handleEditTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onDownloadPDF={handleDownloadPDF}
              onDuplicateTemplate={handleDuplicateTemplate}
            />
          )}
          {activeTab === 'users' && <UsersTab state={state} onSendWhatsApp={handleSendWhatsApp} />}
          {activeTab === 'sales' && <SalesTab state={state} />}
        </div>
      </div>

    </div>
  );
}

function OverviewTab({ state }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonth = prevDate.toISOString().slice(0, 7);

  const countByMonth = (items, field) =>
    items.filter((item) => item[field]?.startsWith(currentMonth)).length;
  const countPrevByMonth = (items, field) =>
    items.filter((item) => item[field]?.startsWith(prevMonth)).length;

  const currentNewUsers = countByMonth(state.users, 'createdAt');
  const prevNewUsers = countPrevByMonth(state.users, 'createdAt');
  const userVar =
    prevNewUsers !== 0
      ? ((currentNewUsers - prevNewUsers) / prevNewUsers) * 100
      : null;

  const currentTemplates = countByMonth(state.templates, 'createdAt');
  const prevTemplates = countPrevByMonth(state.templates, 'createdAt');
  const templateVar =
    prevTemplates !== 0
      ? ((currentTemplates - prevTemplates) / prevTemplates) * 100
      : null;

  const monthlyIncome = state.sales
    .filter((s) => s.date.startsWith(currentMonth))
    .reduce((sum, s) => sum + s.amount, 0);
  const prevIncome = state.sales
    .filter((s) => s.date.startsWith(prevMonth))
    .reduce((sum, s) => sum + s.amount, 0);
  const incomeVar =
    prevIncome !== 0 ? ((monthlyIncome - prevIncome) / prevIncome) * 100 : null;



  const objectiveLabel = {
    volume: 'Volumen',
    fat_loss: 'Pérdida de grasa',
    definition: 'Definición',
  };

  const templateStats = state.sales.reduce((acc, sale) => {
    if (sale.templateId) {
      const stat = acc[sale.templateId] || { count: 0, lastDate: '', plan: sale.plan };
      stat.count += 1;
      stat.plan = sale.plan;
      if (!stat.lastDate || stat.lastDate < sale.date) stat.lastDate = sale.date;
      acc[sale.templateId] = stat;
    }
    return acc;
  }, {});

  const templateRows = Object.entries(templateStats).map(([id, data]) => {
    const template = state.templates.find((t) => t.id === Number(id));
    return {
      id: Number(id),
      name: template ? template.name : `Plantilla ${id}`,
      objective: template ? template.objective : '-',
      plan: data.plan,
      count: data.count,
      lastDate: data.lastDate,
    };
  });

  const [sortField, setSortField] = useState('count');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const sortedTemplates = [...templateRows].sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * dir;
    if (a[sortField] > b[sortField]) return 1 * dir;
    return 0;
  });
  const pageCount = Math.ceil(sortedTemplates.length / pageSize);
  const displayedTemplates = sortedTemplates.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clientStats = state.sales.reduce((acc, sale) => {
    const stat = acc[sale.userEmail] || { count: 0, total: 0, plan: sale.plan };
    stat.count += 1;
    stat.total += sale.amount;
    stat.plan = sale.plan;
    acc[sale.userEmail] = stat;
    return acc;
  }, {});
  const topClients = Object.entries(clientStats)
    .map(([email, data]) => ({
      email,
      plan: data.plan,
      routines: data.count,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);



  const variationClass = (v) =>
    v === null ? 'text-[#787878]' : v >= 0 ? 'text-[#CBFF00]' : 'text-[#FF6B6B]';

  const formatVar = (v) =>
    v === null ? 'N/A' : `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b-2 border-[#CBFF00]">
            Rutinas más solicitadas
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#787878]">
                <th className="py-2 px-2 cursor-pointer" onClick={() => handleSort('name')}>
                  Nombre
                </th>
                <th className="py-2 px-2">Objetivo</th>
                <th className="py-2 px-2">Plan</th>
                <th
                  className="py-2 px-2 cursor-pointer"
                  onClick={() => handleSort('count')}
                >
                  Descargas
                </th>
                <th className="py-2 px-2">Última descarga</th>
              </tr>
            </thead>
            <tbody>
              {displayedTemplates.map((tpl) => (
                <tr key={tpl.id} className="hover:bg-[#2A2A2A]">
                  <td className="py-2 px-2">{tpl.name}</td>
                  <td className="py-2 px-2 capitalize">
                    {objectiveLabel[tpl.objective] || '-'}
                  </td>
                  <td className="py-2 px-2 capitalize">
                    {planLabel[tpl.plan] || '-'}
                  </td>
                  <td className="py-2 px-2 text-[#CBFF00] font-semibold">
                    {tpl.count}
                  </td>
                  <td className="py-2 px-2">{tpl.lastDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pageCount > 1 && (
            <div className="flex justify-end items-center space-x-2 mt-2">
              <button
                onClick={() => setPage(Math.max(page - 1, 0))}
                className="p-1 rounded hover:bg-[#2A2A2A]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-[#787878]">
                {page + 1}/{pageCount}
              </span>
              <button
                onClick={() => setPage(Math.min(page + 1, pageCount - 1))}
                className="p-1 rounded hover:bg-[#2A2A2A]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 border-b-2 border-[#CBFF00]">
            Top clientes
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#787878]">
                <th className="py-2 px-2">Cliente</th>
                <th className="py-2 px-2">Plan</th>
                <th className="py-2 px-2">Rutinas</th>
                <th className="py-2 px-2">Total gastado</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((c) => (
                <tr key={c.email} className="hover:bg-[#2A2A2A]">
                  <td className="py-2 px-2">{c.email}</td>
                  <td className="py-2 px-2 capitalize">
                    {planLabel[c.plan] || '-'}
                  </td>
                  <td className="py-2 px-2">{c.routines}</td>
                  <td className="py-2 px-2 text-[#CBFF00] font-semibold">
                    ${c.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b-2 border-[#CBFF00]">
            Métricas clave
          </h3>
          <div className="grid gap-4">
            <div className="bg-[#202020] rounded-lg p-4 border border-[#787878]/20">
              <p className="text-[#787878] text-sm">Clientes nuevos este mes</p>
              <p className="text-xl font-bold text-[#CBFF00]">
                {currentNewUsers}
              </p>
              <p className={`text-sm ${variationClass(userVar)}`}>
                {formatVar(userVar)}
              </p>
            </div>
            <div className="bg-[#202020] rounded-lg p-4 border border-[#787878]/20">
              <p className="text-[#787878] text-sm">Rutinas creadas este mes</p>
              <p className="text-xl font-bold text-[#CBFF00]">
                {currentTemplates}
              </p>
              <p className={`text-sm ${variationClass(templateVar)}`}>
                {formatVar(templateVar)}
              </p>
            </div>
            <div className="bg-[#202020] rounded-lg p-4 border border-[#787878]/20">

              <p className="text-[#787878] text-sm">Ingresos del mes actual</p>
              <p className="text-xl font-bold text-[#CBFF00]">
                ${monthlyIncome.toFixed(2)}
              </p>
              <p className={`text-sm ${variationClass(incomeVar)}`}>
                {formatVar(incomeVar)}
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

function TemplatesTab({ state, onCreateTemplate, onEditTemplate, onDeleteTemplate, onDownloadPDF, onDuplicateTemplate }) {
  const genderLabel = { male: 'masculino', female: 'femenino' };
  const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa' };
  const [filters, setFilters] = useState({ tag: '', gender: '', frequency: '', objective: '' });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredTemplates = state.templates.filter((template) => {
    if (filters.tag && !(template.tags || []).some(t => t.includes(filters.tag.toLowerCase()))) return false;
    if (filters.gender && template.gender !== filters.gender) return false;
    if (filters.frequency && template.frequency !== parseInt(filters.frequency)) return false;
    if (filters.objective && template.objective !== filters.objective) return false;
    return true;
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Plantillas de Entrenamiento</h3>
        <button
          onClick={onCreateTemplate}
          className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Plantilla</span>
        </button>
      </div>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          value={filters.tag}
          onChange={(e) => handleFilterChange('tag', e.target.value.toLowerCase())}
          placeholder="Tag"
          className="bg-[#202020] border border-[#787878]/30 rounded-xl px-3 py-2 text-white"
        />
        <select
          value={filters.gender}
          onChange={(e) => handleFilterChange('gender', e.target.value)}
          className="bg-[#202020] border border-[#787878]/30 rounded-xl px-3 py-2 text-white"
        >
          <option value="">Género</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
        </select>
        <select
          value={filters.frequency}
          onChange={(e) => handleFilterChange('frequency', e.target.value)}
          className="bg-[#202020] border border-[#787878]/30 rounded-xl px-3 py-2 text-white"
        >
          <option value="">Frecuencia</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <select
          value={filters.objective}
          onChange={(e) => handleFilterChange('objective', e.target.value)}
          className="bg-[#202020] border border-[#787878]/30 rounded-xl px-3 py-2 text-white"
        >
          <option value="">Objetivo</option>
          <option value="volume">Volumen</option>
          <option value="fat_loss">Pérdida de Grasa</option>
        </select>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => onEditTemplate(template)}
              onDuplicate={() => onDuplicateTemplate(template)}
              onDelete={() => onDeleteTemplate(template.id)}
              onExportPdf={() => onDownloadPDF(template)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#787878]">
          <p>No hay plantillas con estos filtros. Crea una nueva.</p>
          <button
            onClick={onCreateTemplate}
            className="mt-4 bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium"
          >
            Agregar Plantilla
          </button>
        </div>
      )}
    </div>
  );
}

function UsersTab({ state, onSendWhatsApp }) {
  const genderLabel = { male: 'masculino', female: 'femenino' };
  const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa' };
  const [planFilter, setPlanFilter] = useState('');
  const filteredUsers = planFilter
    ? state.users.filter((user) => user.plan === planFilter)
    : state.users;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Gestión de Usuarios</h3>

      <div className="mb-4">
        <label className="text-sm text-[#787878] mr-2">Filtrar por plan:</label>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="bg-[#202020] border border-[#787878]/30 rounded px-3 py-2 text-white"
        >
          <option value="">Todos</option>
          <option value="basic">Básico</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#787878]/20">
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Email</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Género</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Frecuencia</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Objetivo</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Fecha</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Contacto</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[#787878]/10 hover:bg-[#787878]/5">
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 capitalize">{genderLabel[user.gender]}</td>
                <td className="py-3 px-4">{user.frequency}x/semana</td>
                <td className="py-3 px-4 capitalize">{objectiveLabel[user.objective]}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.plan === 'premium'
                        ? 'bg-[#CBFF00]/20 text-[#CBFF00]'
                        : 'bg-[#787878]/20 text-[#787878]'
                    }`}
                  >
                    {planLabel[user.plan]}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#787878]">{user.createdAt}</td>
                <td className="py-3 px-4">
                  {user.plan === 'premium' && (
                    <button
                      onClick={() => onSendWhatsApp(user)}
                      className="p-2 hover:bg-[#CBFF00]/20 text-[#CBFF00] rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SalesTab({ state }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const statusLabel = { completed: 'completado' };

  const overallRevenue = state.sales.reduce((sum, sale) => sum + sale.amount, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthRevenue = state.sales
    .filter((sale) => sale.date.startsWith(currentMonth))
    .reduce((sum, sale) => sum + sale.amount, 0);

  const filteredSales = state.sales.filter((sale) => {
    const date = new Date(sale.date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Historial de Ventas</h3>
        <div className="flex items-center space-x-4">
          <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-lg px-4 py-2">
            <span className="text-[#CBFF00] font-semibold">
              Total Histórico: ${overallRevenue.toFixed(2)}
            </span>
          </div>
          <div className="bg-[#DBFE52]/10 border border-[#DBFE52]/20 rounded-lg px-4 py-2">
            <span className="text-[#DBFE52] font-semibold">
              Total Mensual: ${currentMonthRevenue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm text-[#787878] mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#202020] border border-[#787878]/30 rounded px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-[#787878] mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#202020] border border-[#787878]/30 rounded px-3 py-2 text-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#787878]/20">
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Email</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Monto</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Fecha</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="border-b border-[#787878]/10 hover:bg-[#787878]/5">
                <td className="py-3 px-4">{sale.userEmail}</td>
                <td className="py-3 px-4 capitalize">{planLabel[sale.plan]}</td>
                <td className="py-3 px-4 font-semibold text-[#CBFF00]">${sale.amount}</td>
                <td className="py-3 px-4 text-[#787878]">{sale.date}</td>
                <td className="py-3 px-4">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                    {statusLabel[sale.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
