import React, { useState, useEffect } from 'react';
import { useClientAuth } from '@/context/UnifiedAuthContext';
import { supabase } from '@/lib/supabase';
import { downloadPurchasedFile } from '@/services/purchaseService';
import {
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
  User,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Shared/Header';

function ClientDashboard() {
  const { user, profile, signOut } = useClientAuth();
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  const fetchPurchases = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      // Fetch all sales for this user with their items
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(
          `
          id,
          total_amount,
          status,
          created_at,
          payment_id,
          sale_items (
            id,
            product_id,
            product_name,
            unit_price,
            quantity
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      setPurchases(salesData || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Error al cargar tus compras');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (saleItem) => {
    // TODO: Implementar descarga de archivos cuando estén generados
    alert('La descarga de archivos estará disponible próximamente');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Fit<span className="text-[#B5FF00]">ter</span>
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2">
                <User className="h-5 w-5 text-[#B5FF00]" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">
                    {profile?.full_name || 'Cliente'}
                  </p>
                  <p className="text-xs text-neutral-400">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-red-500/30"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Mis Compras</h2>
          <p className="mt-2 text-neutral-400">
            Accede a todas tus rutinas y productos
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#B5FF00]" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && purchases.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-12 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-neutral-600" />
            <h3 className="mt-4 text-xl font-bold text-white">
              No tienes compras aún
            </h3>
            <p className="mt-2 text-neutral-400">
              Explora nuestras rutinas y comienza tu transformación
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600]"
            >
              Ver Rutinas
            </button>
          </div>
        )}

        {/* Purchases List */}
        {!loading && !error && purchases.length > 0 && (
          <div className="space-y-6">
            {purchases.map((sale) => (
              <div
                key={sale.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-lg backdrop-blur"
              >
                {/* Sale Header */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">
                        Compra {sale.payment_id ? `#${sale.payment_id.substring(0, 8)}` : `#${sale.id.substring(0, 8)}`}
                      </h3>
                      {sale.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Completada
                        </span>
                      )}
                      {sale.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400">
                          <AlertCircle className="h-3 w-3" />
                          Pendiente
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(sale.created_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Total</p>
                    <p className="text-2xl font-bold text-[#B5FF00]">
                      {formatPrice(sale.total_amount)}
                    </p>
                  </div>
                </div>

                {/* Sale Items */}
                <div className="space-y-3">
                  {sale.sale_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-neutral-800/30 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#B5FF00]/10">
                          <FileText className="h-6 w-6 text-[#B5FF00]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {item.product_name}
                          </h4>
                          <p className="text-sm text-neutral-400">
                            ${item.unit_price.toLocaleString('es-AR')} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(item)}
                        disabled={downloadingId === item.id || sale.status !== 'completed'}
                        className="flex items-center gap-2 rounded-lg bg-[#B5FF00] px-4 py-2 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingId === item.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Descargando...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            {sale.status === 'completed' ? 'Descargar' : 'Pendiente'}
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientDashboard;
