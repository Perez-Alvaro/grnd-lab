/**
 * src/pages/CoachDashboard.jsx
 * Dashboard del entrenador: gestiona atletas y, dentro de cada uno, sus rutinas.
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconUsers, IconPlus, IconBarbell, IconPencil, IconTrash, IconChevronRight, IconChevronLeft, IconLogout, IconBolt, IconTarget, IconSalad, IconShieldLock, IconPalette } from '@tabler/icons-react';
import { useAuth } from '../store/authStore.jsx';
import { useProtectedLink } from '../lib/routeObfuscator.js';
import { listAthletes, createAthlete, updateAthlete, deleteAthlete } from '../lib/athletes.js';
import { listRoutines, deleteRoutine } from '../lib/routines.js';
import { listNutritionPlans, deleteNutritionPlan } from '../lib/nutritionPlans.js';
import { Button, Input, Select, Textarea, Modal, ModalFooter, Badge } from '../components/ui';
import SubscriptionSection from '../components/Dashboard/SubscriptionSection.jsx';
import FeedbackSection from '../components/Dashboard/FeedbackSection.jsx';
import BrandSettingsModal from '../components/Dashboard/BrandSettingsModal.jsx';
import { toast } from '../utils/toast.js';

/** "0 rutinas" / "1 rutina" / "3 rutinas" — el `2 rut · 1 nutri` anterior era críptico. */
const countLabel = (n, singular, plural) => `${n} ${n === 1 ? singular : plural}`;

const LEVELS = [
  { value: '', label: 'Sin especificar' },
  { value: 'inicial', label: 'Inicial' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
];

export default function CoachDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const editorPath = useProtectedLink();

  const [athletes, setAthletes] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [athleteTab, setAthleteTab] = useState('routines'); // 'routines' | 'nutrition'
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [brandModalOpen, setBrandModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, r, n] = await Promise.all([listAthletes(), listRoutines(), listNutritionPlans()]);
      setAthletes(a);
      setRoutines(r);
      setNutritionPlans(n);
      setSelected((prev) => (prev ? a.find((x) => x.id === prev.id) || null : null));
    } catch (e) {
      toast.error('No se pudieron cargar los datos. ¿Aplicaste las migraciones?');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const routinesOf = (athleteId) => routines.filter((r) => r.athlete_id === athleteId);
  const nutritionOf = (athleteId) => nutritionPlans.filter((p) => p.athlete_id === athleteId);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (a) => { setEditing(a); setModalOpen(true); };

  const handleDeleteAthlete = async (a) => {
    if (!window.confirm(`¿Eliminar a ${a.name}? Sus rutinas quedarán sin atleta asignado.`)) return;
    try {
      await deleteAthlete(a.id);
      toast.success('Atleta eliminado');
      if (selected?.id === a.id) setSelected(null);
      load();
    } catch (e) { toast.error('No se pudo eliminar'); console.error(e); }
  };

  const handleDeleteRoutine = async (r) => {
    if (!window.confirm(`¿Eliminar la rutina "${r.title}"?`)) return;
    try {
      await deleteRoutine(r.id);
      toast.success('Rutina eliminada');
      load();
    } catch (e) { toast.error('No se pudo eliminar'); console.error(e); }
  };

  const handleDeleteNutritionPlan = async (p) => {
    if (!window.confirm(`¿Eliminar el plan "${p.title}"?`)) return;
    try {
      await deleteNutritionPlan(p.id);
      toast.success('Plan nutricional eliminado');
      load();
    } catch (e) { toast.error('No se pudo eliminar'); console.error(e); }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Top bar */}
      <header className="border-b border-border bg-primary-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary-bg">
              <IconBolt stroke={1.75} className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary font-display leading-tight">Panel del entrenador</h1>
              <p className="text-xs text-text-muted">Hola, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="secondary" size="sm" onClick={() => setBrandModalOpen(true)}>
              <IconPalette stroke={1.75} className="h-4 w-4" />
              <span className="hidden sm:inline">Mi Marca / Logo</span>
            </Button>

            {/* Solo para admins: volver al panel de administración */}
            {user?.role === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                <IconShieldLock stroke={1.75} className="h-4 w-4" />
                <span className="hidden sm:inline">Panel de admin</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
              <IconLogout stroke={1.75} className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Suscripción: estado del pago + informar transferencia */}
        <SubscriptionSection />


        {/* En mobile es una navegación lista → detalle (con "Volver"), no dos
            bloques apilados: antes al tocar un atleta el detalle se rellenaba
            fuera de pantalla y parecía que no pasaba nada. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 lg:gap-8">
          {/* Athletes list */}
          <section className={selected ? 'hidden lg:block' : 'block'}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Tus atletas</h2>
              <Button size="sm" onClick={openNew}><IconPlus stroke={1.75} className="h-4 w-4" /> Nuevo atleta</Button>
            </div>

            {loading ? (
              <p className="text-sm text-text-muted">Cargando…</p>
            ) : athletes.length === 0 ? (
              <EmptyState
                icon={IconUsers}
                title="Todavía no tenés atletas"
                subtitle="Creá tu primer atleta para empezar a guardarle rutinas."
                action={<Button size="sm" onClick={openNew}><IconPlus stroke={1.75} className="h-4 w-4" /> Nuevo atleta</Button>}
              />
            ) : (
              <div className="space-y-2">
                {athletes.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className={`w-full text-left rounded-xl border p-4 transition-colors ${
                      selected?.id === a.id ? 'border-accent bg-accent/5' : 'border-border bg-primary-surface hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-text-primary font-medium truncate">{a.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {a.goal && <Badge>{a.goal}</Badge>}
                          {a.level && <Badge variant="secondary">{a.level}</Badge>}
                          <span className="text-xs text-text-muted">{countLabel(routinesOf(a.id).length, 'rutina', 'rutinas')} · {countLabel(nutritionOf(a.id).length, 'plan', 'planes')}</span>
                        </div>
                      </div>
                      <IconChevronRight stroke={1.75} className="h-4 w-4 text-text-muted flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Selected athlete detail */}
          <section className={selected ? 'block' : 'hidden lg:block'}>
            {selected ? (
              <div className="rounded-xl border border-border bg-primary-surface p-4 sm:p-6">
                {/* Back a la lista — sin esto, en mobile no hay salida del detalle */}
                <button
                  onClick={() => setSelected(null)}
                  className="lg:hidden -ml-2 mb-3 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <IconChevronLeft stroke={1.75} className="h-4 w-4" /> Tus atletas
                </button>

                <div className="flex items-start justify-between gap-3 mb-6">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-text-primary font-display">{selected.name}</h2>
                    {selected.email && <p className="text-sm text-text-muted">{selected.email}</p>}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {selected.goal && <Badge><IconTarget stroke={1.75} className="h-3 w-3" /> {selected.goal}</Badge>}
                      {selected.level && <Badge variant="secondary">{selected.level}</Badge>}
                    </div>
                    {selected.notes && <p className="text-sm text-text-secondary mt-3">{selected.notes}</p>}
                  </div>
                  {/* Eliminar separado de Editar: pegados y a 32px se toca el equivocado */}
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(selected)} aria-label={`Editar a ${selected.name}`}>
                      <IconPencil stroke={1.75} className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAthlete(selected)} aria-label={`Eliminar a ${selected.name}`} className="text-error hover:bg-error/10">
                      <IconTrash stroke={1.75} className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Toggle Rutinas | Nutrición */}
                <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-border bg-primary-bg p-1">
                  {[
                    { id: 'routines', label: 'Rutinas', icon: IconBarbell, count: routinesOf(selected.id).length },
                    { id: 'nutrition', label: 'Nutrición', icon: IconSalad, count: nutritionOf(selected.id).length },
                  ].map(({ id, label, icon: Icon, count }) => (
                    <button
                      key={id}
                      onClick={() => setAthleteTab(id)}
                      aria-pressed={athleteTab === id}
                      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
                        athleteTab === id ? 'bg-accent text-primary-bg shadow-sm' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon stroke={1.75} className="h-4 w-4" /> {label}
                      <span className={athleteTab === id ? 'opacity-80' : 'text-text-muted'}>({count})</span>
                    </button>
                  ))}
                </div>

                {athleteTab === 'routines' ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Rutinas</h3>
                      <Button size="sm" variant="accent" onClick={() => navigate(`${editorPath}?athleteId=${selected.id}`)}>
                        <IconPlus stroke={1.75} className="h-4 w-4" /> Nueva rutina
                      </Button>
                    </div>

                    {routinesOf(selected.id).length === 0 ? (
                      <p className="text-sm text-text-muted py-6 text-center">Sin rutinas todavía.</p>
                    ) : (
                      <div className="space-y-2">
                        {routinesOf(selected.id).map((r) => (
                          <div key={r.id} className="flex items-center justify-between rounded-lg border border-border bg-primary-bg px-4 py-3">
                            <button
                              onClick={() => navigate(`${editorPath}?routineId=${r.id}`)}
                              className="flex items-center gap-3 min-w-0 text-left flex-1"
                            >
                              <IconBarbell stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-text-primary text-sm truncate">{r.title}</p>
                                <p className="text-xs text-text-muted">Editada {new Date(r.updated_at).toLocaleDateString('es-AR')}</p>
                              </div>
                            </button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRoutine(r)} aria-label={`Eliminar la rutina ${r.title}`} className="ml-2 text-error hover:bg-error/10">
                              <IconTrash stroke={1.75} className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Planes nutricionales</h3>
                      <Button size="sm" variant="accent" onClick={() => navigate(`${editorPath}?planType=nutrition&athleteId=${selected.id}`)}>
                        <IconPlus stroke={1.75} className="h-4 w-4" /> Nuevo plan
                      </Button>
                    </div>

                    {nutritionOf(selected.id).length === 0 ? (
                      <p className="text-sm text-text-muted py-6 text-center">Sin planes nutricionales todavía.</p>
                    ) : (
                      <div className="space-y-2">
                        {nutritionOf(selected.id).map((p) => (
                          <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-primary-bg px-4 py-3">
                            <button
                              onClick={() => navigate(`${editorPath}?planType=nutrition&planId=${p.id}`)}
                              className="flex items-center gap-3 min-w-0 text-left flex-1"
                            >
                              <IconSalad stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-text-primary text-sm truncate">{p.title}</p>
                                <p className="text-xs text-text-muted">Editado {new Date(p.updated_at).toLocaleDateString('es-AR')}</p>
                              </div>
                            </button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteNutritionPlan(p)} aria-label={`Eliminar el plan ${p.title}`} className="ml-2 text-error hover:bg-error/10">
                              <IconTrash stroke={1.75} className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <EmptyState
                icon={IconBarbell}
                title="Elegí un atleta"
                subtitle="Seleccioná un atleta de la lista para ver y crear sus rutinas."
              />
            )}
          </section>
        </div>

        {/* Buzón de reclamos y bugs */}
        <FeedbackSection />
      </main>

      <AthleteModal
        open={modalOpen}
        athlete={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); load(); }}
      />

      <BrandSettingsModal
        open={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
      />
    </div>
  );
}

/* ── Subcomponentes ─────────────────────────────────────────── */


function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-primary-surface/50 p-10 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-3">
        <Icon stroke={1.75} className="h-6 w-6 text-accent" />
      </div>
      <p className="text-text-primary font-medium">{title}</p>
      <p className="text-sm text-text-muted mt-1 max-w-xs mx-auto">{subtitle}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function AthleteModal({ open, athlete, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', email: '', goal: '', level: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(athlete
        ? { name: athlete.name || '', email: athlete.email || '', goal: athlete.goal || '', level: athlete.level || '', notes: athlete.notes || '' }
        : { name: '', email: '', goal: '', level: '', notes: '' });
    }
  }, [open, athlete]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
    setSaving(true);
    try {
      if (athlete) await updateAthlete(athlete.id, form);
      else await createAthlete(form);
      toast.success(athlete ? 'Atleta actualizado' : 'Atleta creado');
      onSaved();
    } catch (e) { toast.error('No se pudo guardar'); console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={athlete ? 'Editar atleta' : 'Nuevo atleta'}>
      <div className="space-y-4">
        <Input label="Nombre *" value={form.name} onChange={set('name')} placeholder="Nombre del atleta" />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="opcional" />
        <Input label="Objetivo" value={form.goal} onChange={set('goal')} placeholder="Ej: hipertrofia, pérdida de grasa" />
        <Select label="Nivel" value={form.level} onChange={set('level')}>
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </Select>
        <Textarea label="Notas" value={form.notes} onChange={set('notes')} placeholder="Lesiones, disponibilidad, preferencias…" rows={3} />
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="accent" onClick={handleSave} loading={saving}>{athlete ? 'Guardar' : 'Crear'}</Button>
      </ModalFooter>
    </Modal>
  );
}
