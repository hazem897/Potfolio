import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Globe,
  Activity,
  Clock,
  Mail,
  Download,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Laptop,
  Smartphone,
  Tablet,
  FileText,
  AlertTriangle,
  X,
  Compass,
  CheckCircle2,
  Send
} from 'lucide-react';
import '../assets/styles/admin.css';

export default function AdminDashboard({ isOpen, onClose }) {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('hk_admin_token') || localStorage.getItem('hk_admin_token') || '';
    } catch {
      return '';
    }
  });

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [range, setRange] = useState('7d');
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Fetch stats from backend
  const fetchStats = useCallback(async (authToken, selectedRange) => {
    if (!authToken) return;
    setIsLoading(true);
    setLoadError('');

    try {
      const res = await fetch(`/api/admin/stats?range=${selectedRange}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (res.status === 401) {
        // Token invalid / expired
        setToken('');
        sessionStorage.removeItem('hk_admin_token');
        localStorage.removeItem('hk_admin_token');
        return;
      }

      if (!res.ok) {
        throw new Error('Erreur de chargement des statistiques');
      }

      const json = await res.json();
      setStatsData(json);
    } catch (err) {
      setLoadError(err.message || 'Impossible de charger les statistiques');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on token or range change
  useEffect(() => {
    if (token && isOpen) {
      fetchStats(token, range);
    }
  }, [token, range, isOpen, fetchStats]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setLoginError(json.error || 'Mot de passe incorrect');
        return;
      }

      const receivedToken = json.token;
      setToken(receivedToken);
      try {
        sessionStorage.setItem('hk_admin_token', receivedToken);
      } catch {
        // Fallback
      }
      setPassword('');
      fetchStats(receivedToken, range);
    } catch (err) {
      setLoginError('Erreur de connexion au serveur');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setToken('');
    setStatsData(null);
    try {
      sessionStorage.removeItem('hk_admin_token');
      localStorage.removeItem('hk_admin_token');
    } catch {
      // ignore
    }
  };

  // CSV Export trigger
  const handleExportCsv = () => {
    if (!token) return;
    const url = `/api/admin/export?range=${range}&token=${encodeURIComponent(token)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-visiteurs-${range}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  // Format seconds to 'Xm Ys'
  const formatDuration = (seconds = 0) => {
    if (!seconds || seconds <= 0) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  // Format date to Tunis time
  const formatDateTime = (isoString) => {
    if (!isoString) return '—';
    try {
      return new Intl.DateTimeFormat('fr-TN', {
        timeZone: 'Africa/Tunis',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="Tableau de bord Admin">
      {/* 1. LOGIN SCREEN (IF NOT AUTHENTICATED) */}
      {!token ? (
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <div className="admin-brand-icon">
                &lt;&nbsp;HK&nbsp;/&gt;
              </div>
              <h2>Tableau de Bord Privé</h2>
              <p>Système de tracking et d'analytics en temps réel</p>
            </div>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-field-group">
                <label htmlFor="admin-pwd">Mot de passe Administrateur</label>
                <div className="admin-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="admin-pwd"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre clé d'accès..."
                    className="admin-input"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    className="admin-toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="admin-error-box">
                  <AlertTriangle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="admin-btn-submit"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Vérification...' : 'Déverrouiller l’accès sécurisé'}
              </button>

              <button
                type="button"
                className="admin-btn-back"
                onClick={onClose}
              >
                Retourner sur le portfolio
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 2. MAIN DASHBOARD CONTENT */
        <div className="admin-container">
          {/* Topbar */}
          <header className="admin-topbar">
            <div className="admin-header-title">
              <div className="admin-brand-icon" style={{ fontSize: '24px', margin: 0 }}>
                &lt;&nbsp;HK&nbsp;/&gt;
              </div>
              <div>
                <h1>
                  Visitor Intelligence Dashboard
                  <span className="admin-live-badge">
                    <span className="pulse-circle" /> En direct
                  </span>
                </h1>
              </div>
            </div>

            <div className="admin-top-actions">
              <button
                type="button"
                className="admin-pill-btn"
                onClick={() => fetchStats(token, range)}
                disabled={isLoading}
                title="Actualiser les données"
              >
                <RefreshCw size={14} className={isLoading ? 'contact-spinner' : ''} />
                <span>Actualiser</span>
              </button>

              <button
                type="button"
                className="admin-pill-btn primary"
                onClick={handleExportCsv}
                title="Télécharger l'historique en fichier CSV"
              >
                <Download size={14} />
                <span>Exporter CSV</span>
              </button>

              <button
                type="button"
                className="admin-pill-btn"
                onClick={handleLogout}
                title="Se déconnecter"
              >
                <Lock size={14} />
                <span>Déconnexion</span>
              </button>

              <button
                type="button"
                className="admin-pill-btn"
                onClick={onClose}
                title="Fermer le dashboard"
              >
                <X size={15} />
                <span>Fermer</span>
              </button>
            </div>
          </header>

          {/* Setup Notice Banner if Supabase environment variables are missing */}
          {statsData && statsData.configured === false && (
            <div className="admin-setup-banner">
              <AlertTriangle size={24} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <div>
                <h4>Configuration Supabase Requise</h4>
                <p>
                  Votre base de données Supabase n’est pas encore connectée. Les tables et requêtes sont prêtes dans <code>supabase/schema.sql</code>.
                  Ajoutez simplement <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code> dans les variables d'environnement de votre projet Vercel.
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                  Une fois ces deux variables ajoutées, l'enregistrement des visites s'activera automatiquement de manière permanente !
                </p>
              </div>
            </div>
          )}

          {/* Time Range Filters */}
          <div className="admin-filters-bar">
            <div className="admin-range-tabs">
              {[
                ['today', "Aujourd'hui"],
                ['7d', '7 Derniers Jours'],
                ['30d', '30 Derniers Jours'],
                ['all', 'Tout l’historique']
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`admin-range-tab ${range === key ? 'active' : ''}`}
                  onClick={() => setRange(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="admin-timezone-indicator">
              <Clock size={13} style={{ color: '#2dd4bf' }} />
              <span>Fuseau : Afrique / Tunis (UTC+1)</span>
            </div>
          </div>

          {/* KPI Metric Cards */}
          {statsData && (
            <div className="admin-kpi-grid">
              {/* Total Visits */}
              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-title">Total Visites</span>
                  <div className="admin-kpi-icon">
                    <Activity size={17} />
                  </div>
                </div>
                <div className="admin-kpi-value">{statsData.summary.totalVisits}</div>
                <div className="admin-kpi-desc">Sessions enregistrées sur la période</div>
              </div>

              {/* Unique Visitors */}
              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-title">Visiteurs Uniques</span>
                  <div className="admin-kpi-icon">
                    <Users size={17} />
                  </div>
                </div>
                <div className="admin-kpi-value" style={{ color: '#2dd4bf' }}>
                  {statsData.summary.uniqueVisitors}
                </div>
                <div className="admin-kpi-desc">Dédoublonnés par ID anonyme</div>
              </div>

              {/* Active Sessions Now */}
              <div className="admin-kpi-card" style={{ borderColor: 'rgba(52, 211, 153, 0.4)' }}>
                <div className="admin-kpi-top">
                  <span className="admin-kpi-title">En Ligne Maintenant</span>
                  <div className="admin-kpi-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    <span className="pulse-circle" style={{ background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                  </div>
                </div>
                <div className="admin-kpi-value" style={{ color: '#34d399' }}>
                  {statsData.summary.activeSessions}
                </div>
                <div className="admin-kpi-desc">Actifs durant les 15 dernières minutes</div>
              </div>

              {/* Average Duration */}
              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-title">Durée Moyenne</span>
                  <div className="admin-kpi-icon">
                    <Clock size={17} />
                  </div>
                </div>
                <div className="admin-kpi-value">{formatDuration(statsData.summary.avgDurationSeconds)}</div>
                <div className="admin-kpi-desc">Temps d'attention moyen sur le portfolio</div>
              </div>

              {/* Contact Leads */}
              <div className="admin-kpi-card">
                <div className="admin-kpi-top">
                  <span className="admin-kpi-title">Leads & Contacts</span>
                  <div className="admin-kpi-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    <Mail size={17} />
                  </div>
                </div>
                <div className="admin-kpi-value" style={{ color: '#38bdf8' }}>
                  {statsData.summary.contactLeads}
                </div>
                <div className="admin-kpi-desc">Formulaires envoyés volontairement</div>
              </div>
            </div>
          )}

          {/* Visual Charts Grid */}
          {statsData && statsData.charts && (
            <div className="admin-charts-grid">
              {/* Daily Timeline Bar Chart */}
              <div className="admin-chart-card">
                <h3>
                  <span>Évolution Quotidienne des Visites</span>
                  <Calendar size={16} style={{ color: '#2dd4bf' }} />
                </h3>

                {statsData.charts.daily.length > 0 ? (
                  <div className="admin-bar-chart">
                    {(() => {
                      const maxVisits = Math.max(...statsData.charts.daily.map((d) => d.visits), 1);
                      return statsData.charts.daily.map((d) => {
                        const heightPct = Math.max(10, Math.round((d.visits / maxVisits) * 100));
                        return (
                          <div key={d.date} className="admin-chart-col">
                            <div className="admin-col-bar" style={{ height: `${heightPct}%` }}>
                              <div className="admin-col-tooltip">
                                {d.visits} visite(s) ({d.unique} unique)
                              </div>
                            </div>
                            <span className="admin-col-label">{d.date.slice(5)}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    Aucune visite enregistrée sur cette période
                  </div>
                )}
              </div>

              {/* Top Countries Breakdown */}
              <div className="admin-chart-card">
                <h3>
                  <span>Répartition Géographique</span>
                  <Globe size={16} style={{ color: '#2dd4bf' }} />
                </h3>

                {statsData.charts.countries.length > 0 ? (
                  <div className="admin-breakdown-list">
                    {statsData.charts.countries.slice(0, 5).map((c) => (
                      <div key={c.code} className="admin-breakdown-row">
                        <div className="admin-breakdown-info">
                          <span className="admin-breakdown-name">
                            <span>{c.flag}</span>
                            <span>{c.country}</span>
                          </span>
                          <span className="admin-breakdown-count">
                            {c.count} ({c.percentage}%)
                          </span>
                        </div>
                        <div className="admin-progress-track">
                          <div className="admin-progress-fill" style={{ width: `${c.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    Aucune donnée géographique
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Secondary 3-Col Stats Grid */}
          {statsData && statsData.charts && (
            <div className="admin-secondary-grid">
              {/* Traffic Sources / Referrers */}
              <div className="admin-chart-card">
                <h3>
                  <span>Sources de Trafic (Referrers)</span>
                  <Compass size={16} style={{ color: '#2dd4bf' }} />
                </h3>
                {statsData.charts.referrers.length > 0 ? (
                  <div className="admin-breakdown-list">
                    {statsData.charts.referrers.slice(0, 5).map((r) => (
                      <div key={r.source} className="admin-breakdown-row">
                        <div className="admin-breakdown-info">
                          <span className="admin-breakdown-name">{r.source}</span>
                          <span className="admin-breakdown-count">
                            {r.count} ({r.percentage}%)
                          </span>
                        </div>
                        <div className="admin-progress-track">
                          <div className="admin-progress-fill" style={{ width: `${r.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Aucune source enregistrée</p>
                )}
              </div>

              {/* Devices Breakdown */}
              <div className="admin-chart-card">
                <h3>
                  <span>Appareils</span>
                  <Laptop size={16} style={{ color: '#2dd4bf' }} />
                </h3>
                {statsData.charts.devices && (
                  <div className="admin-breakdown-list">
                    {[
                      { type: 'desktop', label: 'Ordinateurs', icon: Laptop, count: statsData.charts.devices.desktop || 0 },
                      { type: 'mobile', label: 'Smartphones', icon: Smartphone, count: statsData.charts.devices.mobile || 0 },
                      { type: 'tablet', label: 'Tablettes', icon: Tablet, count: statsData.charts.devices.tablet || 0 }
                    ].map((dev) => {
                      const total = statsData.summary.totalVisits || 1;
                      const pct = Math.round((dev.count / total) * 100);
                      const Icon = dev.icon;
                      return (
                        <div key={dev.type} className="admin-breakdown-row">
                          <div className="admin-breakdown-info">
                            <span className="admin-breakdown-name">
                              <Icon size={14} style={{ color: '#2dd4bf' }} /> {dev.label}
                            </span>
                            <span className="admin-breakdown-count">
                              {dev.count} ({pct}%)
                            </span>
                          </div>
                          <div className="admin-progress-track">
                            <div className="admin-progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Most Visited Sections */}
              <div className="admin-chart-card">
                <h3>
                  <span>Sections les Plus Consultées</span>
                  <FileText size={16} style={{ color: '#2dd4bf' }} />
                </h3>
                {statsData.charts.pages && statsData.charts.pages.length > 0 ? (
                  <div className="admin-breakdown-list">
                    {statsData.charts.pages.map((p) => (
                      <div key={p.page} className="admin-breakdown-row">
                        <div className="admin-breakdown-info">
                          <span className="admin-breakdown-name" style={{ fontFamily: 'monospace', color: '#2dd4bf' }}>
                            {p.page}
                          </span>
                          <span className="admin-breakdown-count">{p.count} fois</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Aucune page enregistrée</p>
                )}
              </div>
            </div>
          )}

          {/* Voluntary Contact Leads Section */}
          {statsData && statsData.leads && statsData.leads.length > 0 && (
            <div className="admin-table-card" style={{ borderColor: 'rgba(52, 211, 153, 0.4)' }}>
              <div className="admin-table-header">
                <div>
                  <h3 style={{ margin: '0 0 4px', color: '#34d399', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> Leads & Formulaires de Contact Reçus
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                    Visiteurs ayant consenti et volontairement soumis leurs coordonnées
                  </p>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Sujet</th>
                      <th>Message</th>
                      <th>Provenance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsData.leads.map((lead) => (
                      <tr key={lead.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(lead.contact_submitted_at || lead.created_at)}</td>
                        <td><strong style={{ color: '#ffffff' }}>{lead.contact_name}</strong></td>
                        <td>
                          <a href={`mailto:${lead.contact_email}`} style={{ color: '#2dd4bf', textDecoration: 'underline' }}>
                            {lead.contact_email}
                          </a>
                        </td>
                        <td>{lead.contact_subject || '—'}</td>
                        <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lead.contact_message || '—'}
                        </td>
                        <td>{lead.country} ({lead.city || ''})</td>
                        <td>
                          <a
                            href={`mailto:${lead.contact_email}?subject=Re: ${encodeURIComponent(lead.contact_subject || '')}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 9px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', borderRadius: '6px', color: '#34d399', fontSize: '0.74rem', textDecoration: 'none', fontWeight: 700 }}
                          >
                            <Send size={11} /> Répondre
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Live Recent Visits Log Stream */}
          {statsData && (
            <div className="admin-table-card">
              <div className="admin-table-header">
                <div>
                  <h3 style={{ margin: '0 0 4px', color: '#ffffff', fontSize: '1.2rem' }}>
                    Flux des Visites Récentes
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                    Dernières sessions enregistrées avec métadonnées précises
                  </p>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date (Tunis)</th>
                      <th>Localisation</th>
                      <th>Appareil & Système</th>
                      <th>Navigateur</th>
                      <th>Source (Referrer)</th>
                      <th>Pages</th>
                      <th>Durée</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsData.visits.length > 0 ? (
                      statsData.visits.map((v) => (
                        <tr key={v.id}>
                          <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(v.created_at)}</td>
                          <td>
                            <strong>{v.country}</strong>
                            {v.city && v.city !== 'Inconnue' && (
                              <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}> · {v.city}</span>
                            )}
                          </td>
                          <td>{v.device_type} · {v.os}</td>
                          <td>{v.browser}</td>
                          <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {v.referrer_domain || 'Direct'}
                          </td>
                          <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', color: '#2dd4bf', fontSize: '0.75rem' }}>
                            {Array.isArray(v.pages_visited) ? v.pages_visited.join(', ') : v.landing_page}
                          </td>
                          <td>{formatDuration(v.session_duration_seconds)}</td>
                          <td>
                            {v.contact_email ? (
                              <span className="admin-lead-badge">Lead : {v.contact_name}</span>
                            ) : (
                              <span className="admin-anon-badge">Anonyme</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                          Aucune visite enregistrée pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
