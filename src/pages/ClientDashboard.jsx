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
    try {
      setDownloadingId(saleItem.id);
      setError('');

      // Buscar el archivo generado para este sale_item
      const { data: generatedFiles, error: filesError } = await supabase
        .from('generated_files')
        .select('id, file_path, file_url, expires_at')
        .eq('sale_item_id', saleItem.id)
        .single();

      if (filesError) {
        console.error('Error fetching file:', filesError);
        throw new Error('No se encontró el archivo. Por favor, contacta soporte.');
      }

      if (!generatedFiles) {
        throw new Error('El archivo aún no está disponible. Por favor, intenta más tarde.');
      }

      // Verificar si la URL firmada ha expirado
      const expiresAt = new Date(generatedFiles.expires_at);
      const now = new Date();

      if (expiresAt < now) {
        // URL expirada, generar nueva URL firmada
        console.log('URL expired, generating new signed URL...');

        // Determinar bucket según tipo de producto
        const bucketName = generatedFiles.file_path.startsWith('routines/') ? 'Rutinas' : 'Libros';

        const { data: signedUrl, error: urlError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(generatedFiles.file_path, 604800); // 7 días

        if (urlError) {
          console.error('Error generating signed URL:', urlError);
          throw new Error('Error al generar el enlace de descarga.');
        }

        // Actualizar la URL en la base de datos
        await supabase
          .from('generated_files')
          .update({
            file_url: signedUrl.signedUrl,
            expires_at: new Date(Date.now() + 604800000).toISOString()
          })
          .eq('id', generatedFiles.id);

        // Usar la nueva URL
        generatedFiles.file_url = signedUrl.signedUrl;
      }

      // Registrar la descarga
      await supabase.from('downloads').insert({
        user_id: user.id,
        user_email: user.email,
        generated_file_id: generatedFiles.id,
        product_id: saleItem.product_id
      });

      // Incrementar contador de descargas
      const { data: fileData } = await supabase
        .from('generated_files')
        .select('download_count')
        .eq('id', generatedFiles.id)
        .single();

      await supabase
        .from('generated_files')
        .update({
          download_count: (fileData?.download_count || 0) + 1,
          last_downloaded_at: new Date().toISOString()
        })
        .eq('id', generatedFiles.id);

      // Abrir URL de descarga en nueva pestaña
      window.open(generatedFiles.file_url, '_blank');

      console.log('File downloaded successfully:', saleItem.product_name);

    } catch (err) {
      console.error('Error downloading file:', err);
      setError(err.message || 'Error al descargar el archivo. Por favor, intenta nuevamente.');
    } finally {
      setDownloadingId(null);
    }
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
    <div className="min-h-screen bg-base">
      {/* Custom Client Dashboard Header */}
      <header className="sticky top-0 z-50 border-b border-brand-border bg-[#050505]/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 text-white">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/landing")}
            className="flex items-center space-x-2 sm:space-x-3 rounded-full border border-transparent px-1 sm:px-2 py-1 transition hover:border-[#0EF2A0]"
          >
            <div className="rounded-2xl bg-[#050505] p-1.5 sm:p-2">
              <img src="/mz-logo-mark.PNG" alt="Logo MZ" className="h-8 sm:h-10 w-auto" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm uppercase tracking-[0.4em] text-[#00C0A3]">
                MZ Training
              </p>
              <p className="text-base sm:text-xl font-semibold">
                Matias Ortiz
              </p>
            </div>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 rounded-lg border border-brand-border bg-surface px-2 sm:px-4 py-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#0EF2A0]" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  {profile?.full_name || 'Cliente'}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-red-500/30"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Mis Compras</h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-400">
            Accede a todas tus rutinas y productos
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0EF2A0]" />
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
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 sm:p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-neutral-600" />
            <h3 className="mt-4 text-lg sm:text-xl font-bold text-white">
              No tienes compras aún
            </h3>
            <p className="mt-2 text-sm sm:text-base text-neutral-400">
              Explora nuestras rutinas y comienza tu transformación
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 rounded-lg bg-[#0EF2A0] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black transition-all hover:bg-[#00C0A3]"
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
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-6 shadow-lg backdrop-blur"
              >
                {/* Sale Header */}
                <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-neutral-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-white">
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
                  <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm text-neutral-400">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#0EF2A0]">
                      {formatPrice(sale.total_amount)}
                    </p>
                  </div>
                </div>

                {/* Sale Items */}
                <div className="space-y-3">
                  {sale.sale_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-lg border border-neutral-800 bg-neutral-800/30 p-3 sm:p-4"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0EF2A0]/10">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[#0EF2A0]" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-white">
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
                        className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#0EF2A0] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-[#00C0A3] disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto justify-center"
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
