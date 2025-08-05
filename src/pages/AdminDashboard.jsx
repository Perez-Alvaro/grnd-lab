import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import TemplateModal from '../components/TemplateModal.jsx';
import { generateMobilePDF, generateDesktopPDF } from '../components/PDFGenerator.jsx';
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
  Monitor
} from 'lucide-react';

function AdminDashboard() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sales', label: 'Sales', icon: CreditCard }
  ];

  const stats = {
    totalUsers: state.users.length,
    totalSales: state.sales.reduce((sum, sale) => sum + sale.amount, 0),
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
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch({ type: 'DELETE_TEMPLATE', payload: templateId });
    }
  };

  const handleDownloadPDF = (template, format) => {
    const pdf = format === 'mobile' 
      ? generateMobilePDF(template)
      : generateDesktopPDF(template);
    
    const fileName = `${template.name.replace(/\s+/g, '_')}_${format}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-[#787878]">Manage templates, users, and track sales</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Total Users</p>
              <p className="text-2xl font-bold text-[#CBFF00]">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-[#CBFF00]">${stats.totalSales.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Templates</p>
              <p className="text-2xl font-bold text-[#CBFF00]">{stats.totalTemplates}</p>
            </div>
            <FileText className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Basic Plans</p>
              <p className="text-2xl font-bold text-[#DBFE52]">{stats.basicPlans}</p>
            </div>
            <Target className="h-8 w-8 text-[#787878]" />
          </div>
        </div>

        <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#787878]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#787878] text-sm">Premium Plans</p>
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
          {activeTab === 'users' && <UsersTab state={state} />}
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

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="bg-[#202020] rounded-lg p-4 border border-[#787878]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-[#787878]">
                      {user.gender} • {user.frequency}x/week • {user.objective.replace('_', ' ')}
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
          <h3 className="text-xl font-semibold mb-4">Recent Sales</h3>
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
                    <p className="text-xs text-[#787878] capitalize">{sale.plan}</p>
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
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Workout Templates</h3>
        <button 
          onClick={onCreateTemplate}
          className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Template</span>
        </button>
      </div>

      <div className="grid gap-4">
        {state.templates.map((template) => (
          <div key={template.id} className="bg-[#202020] rounded-xl p-6 border border-[#787878]/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">{template.name}</h4>
                <div className="flex space-x-3 text-sm">
                  <span className="bg-[#787878]/20 px-2 py-1 rounded capitalize">
                    {template.gender}
                  </span>
                  <span className="bg-[#787878]/20 px-2 py-1 rounded">
                    {template.frequency}x/week
                  </span>
                  <span className="bg-[#787878]/20 px-2 py-1 rounded capitalize">
                    {template.objective.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => onDownloadPDF(template, 'mobile')}
                    className="p-2 hover:bg-[#CBFF00]/20 text-[#CBFF00] rounded-lg transition-colors group"
                    title="Download Mobile PDF"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDownloadPDF(template, 'desktop')}
                    className="p-2 hover:bg-[#DBFE52]/20 text-[#DBFE52] rounded-lg transition-colors group"
                    title="Download Desktop PDF"
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
                  <h5 className="font-medium text-[#CBFF00] mb-2">Exercises:</h5>
                  <ul className="text-sm text-[#787878] space-y-1">
                    {template.exercises.slice(0, 3).map((exercise, index) => (
                      <li key={index}>
                        {exercise.name} - {exercise.sets}x{exercise.reps}
                      </li>
                    ))}
                    {template.exercises.length > 3 && (
                      <li>... and {template.exercises.length - 3} more</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-[#CBFF00] mb-2">Actions:</h5>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onDownloadPDF(template, 'mobile')}
                      className="flex items-center space-x-2 text-sm bg-[#CBFF00]/20 hover:bg-[#CBFF00]/30 text-[#CBFF00] px-3 py-1 rounded transition-colors"
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>Mobile PDF</span>
                    </button>
                    <button
                      onClick={() => onDownloadPDF(template, 'desktop')}
                      className="flex items-center space-x-2 text-sm bg-[#DBFE52]/20 hover:bg-[#DBFE52]/30 text-[#DBFE52] px-3 py-1 rounded transition-colors"
                    >
                      <Monitor className="h-3 w-3" />
                      <span>Desktop PDF</span>
                    </button>
                    {template.youtubeLink && (
                      <a
                        href={template.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-[#F8FE9F] hover:text-[#CBFF00] transition-colors"
                      >
                        <span>📹 Videos</span>
                      </a>
                    )}
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

function UsersTab({ state }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">User Management</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#787878]/20">
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Email</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Gender</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Frequency</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Objective</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Date</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map((user) => (
              <tr key={user.id} className="border-b border-[#787878]/10 hover:bg-[#787878]/5">
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 capitalize">{user.gender}</td>
                <td className="py-3 px-4">{user.frequency}x/week</td>
                <td className="py-3 px-4 capitalize">{user.objective?.replace('_', ' ')}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.plan === 'premium' 
                      ? 'bg-[#CBFF00]/20 text-[#CBFF00]' 
                      : 'bg-[#787878]/20 text-[#787878]'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#787878]">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SalesTab({ state }) {
  const totalRevenue = state.sales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Sales History</h3>
        <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-lg px-4 py-2">
          <span className="text-[#CBFF00] font-semibold">
            Total Revenue: ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#787878]/20">
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Email</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Date</th>
              <th className="text-left py-3 px-4 font-medium text-[#787878]">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.sales.map((sale) => (
              <tr key={sale.id} className="border-b border-[#787878]/10 hover:bg-[#787878]/5">
                <td className="py-3 px-4">{sale.userEmail}</td>
                <td className="py-3 px-4 capitalize">{sale.plan}</td>
                <td className="py-3 px-4 font-semibold text-[#CBFF00]">${sale.amount}</td>
                <td className="py-3 px-4 text-[#787878]">{sale.date}</td>
                <td className="py-3 px-4">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                    {sale.status}
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