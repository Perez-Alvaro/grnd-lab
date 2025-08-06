import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import TemplateModal from '../components/TemplateModal.jsx';
import { downloadRoutinePDF } from '../utils/pdf.jsx';
import {
  Users,
  CreditCard,
  FileText,
  Plus,
  Edit,
  Trash2, 
  Eye,
  DollarSign,
  Calendar,
  Target,
  Download,
  Smartphone,
  Monitor,
  MessageCircle
} from 'lucide-react';

const planLabel = { basic: 'básico', premium: 'premium' };

function AdminDashboard() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

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
    basicPlans: state.users.filter(u => u.plan === 'basic').length,
    premiumPlans: state.users.filter(u => u.plan === 'premium').length
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: templateData });
    } else {
      dispatch({ type: 'ADD_TEMPLATE', payload: templateData });
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      dispatch({ type: 'DELETE_TEMPLATE', payload: templateId });
    }
  };

  const handleDownloadPDF = (template, format) => {
    const orientation = format === 'mobile' ? 'portrait' : 'landscape';
    downloadRoutinePDF(template, null, orientation, format);
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
            </div>
            <DollarSign className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Plantillas</p>
              <p className="text-2xl font-bold text-[#CBFF00]">{stats.totalTemplates}</p>
            </div>
            <FileText className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Planes Básicos</p>
              <p className="text-2xl font-bold text-[#DBFE52]">{stats.basicPlans}</p>
            </div>
            <Target className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Planes Premium</p>
              <p className="text-2xl font-bold text-[#F8FE9F]">{stats.premiumPlans}</p>
            </div>
            <Calendar className="h-8 w-8 text-[#787878]" />
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
            />
          )}
          {activeTab === 'users' && <UsersTab state={state} onSendWhatsApp={handleSendWhatsApp} />}
          {activeTab === 'sales' && <SalesTab state={state} />}
        </div>
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}

function OverviewTab({ state }) {
  const recentUsers = state.users.slice(-5);
  const recentSales = state.sales.slice(-5);
  const genderLabel = { male: 'masculino', female: 'femenino' };
  const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa', maintenance: 'mantenimiento corporal' };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Usuarios Recientes</h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="bg-[#202020] rounded-lg p-4 border border-[#787878]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-[#787878]">
                      {genderLabel[user.gender]} • {user.frequency}x/semana • {objectiveLabel[user.objective]}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.plan === 'premium' 
                      ? 'bg-[#CBFF00]/20 text-[#CBFF00]' 
                      : 'bg-[#787878]/20 text-[#787878]'
                  }`}>
                    {user.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Ventas Recientes</h3>
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="bg-[#202020] rounded-lg p-4 border border-[#787878]/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{sale.userEmail}</p>
                    <p className="text-sm text-[#787878]">{sale.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#CBFF00]">${sale.amount}</p>
                    <p className="text-xs text-[#787878] capitalize">{planLabel[sale.plan]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplatesTab({ state, onCreateTemplate, onEditTemplate, onDeleteTemplate, onDownloadPDF }) {
  const genderLabel = { male: 'masculino', female: 'femenino' };
  const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa', maintenance: 'mantenimiento corporal' };
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
          <option value="2">2</option>
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
          <option value="maintenance">Mantenimiento</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-[#202020] rounded-xl p-6 border border-[#787878]/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">{template.name}</h4>
                <div className="flex space-x-3 text-sm">
                  <span className="bg-[#787878]/20 px-2 py-1 rounded capitalize">
                    {genderLabel[template.gender]}
                  </span>
                  <span className="bg-[#787878]/20 px-2 py-1 rounded">
                    {template.frequency}x/semana
                  </span>
                  <span className="bg-[#787878]/20 px-2 py-1 rounded capitalize">
                    {objectiveLabel[template.objective]}
                  </span>
                </div>
                {template.tags && (
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    {template.tags.map((tag) => (
                      <span key={tag} className="bg-[#787878]/20 px-2 py-1 rounded">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => onDownloadPDF(template, 'mobile')}
                    className="p-2 hover:bg-[#CBFF00]/20 text-[#CBFF00] rounded-lg transition-colors group"
                    title="Descargar PDF móvil"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDownloadPDF(template, 'desktop')}
                    className="p-2 hover:bg-[#DBFE52]/20 text-[#DBFE52] rounded-lg transition-colors group"
                    title="Descargar PDF de escritorio"
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => onEditTemplate(template)}
                  className="p-2 hover:bg-[#787878]/20 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteTemplate(template.id)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[#787878] text-sm">{template.notes}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h5 className="font-medium text-[#CBFF00] mb-2">Ejercicios:</h5>
                  <ul className="text-sm text-[#787878] space-y-1">
                    {template.exercises.slice(0, 3).map((exercise, index) => (
                      <li key={index}>
                        {exercise.name} - {exercise.sets}x{exercise.reps}
                      </li>
                    ))}
                    {template.exercises.length > 3 && (
                      <li>... y {template.exercises.length - 3} más</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-[#CBFF00] mb-2">Acciones:</h5>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onDownloadPDF(template, 'mobile')}
                      className="flex items-center space-x-2 text-sm bg-[#CBFF00]/20 hover:bg-[#CBFF00]/30 text-[#CBFF00] px-3 py-1 rounded transition-colors"
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>PDF Móvil</span>
                    </button>
                    <button
                      onClick={() => onDownloadPDF(template, 'desktop')}
                      className="flex items-center space-x-2 text-sm bg-[#DBFE52]/20 hover:bg-[#DBFE52]/30 text-[#DBFE52] px-3 py-1 rounded transition-colors"
                    >
                      <Monitor className="h-3 w-3" />
                      <span>PDF de Escritorio</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ state, onSendWhatsApp }) {
  const genderLabel = { male: 'masculino', female: 'femenino' };
  const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa', maintenance: 'mantenimiento corporal' };
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

  const monthlyTotals = state.sales.reduce((acc, sale) => {
    const month = sale.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + sale.amount;
    return acc;
  }, {});
  const overallRevenue = Object.values(monthlyTotals).reduce((sum, val) => sum + val, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthRevenue = monthlyTotals[currentMonth] || 0;

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

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Totales por Mes</h4>
        <div className="grid md:grid-cols-2 gap-2">
          {Object.entries(monthlyTotals).sort().map(([month, amount]) => (
            <div
              key={month}
              className="flex justify-between bg-[#202020] border border-[#787878]/20 rounded-lg px-4 py-2"
            >
              <span>
                {new Date(month + '-01').toLocaleString('es-AR', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="font-medium text-[#CBFF00]">${amount.toFixed(2)}</span>
            </div>
          ))}
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
