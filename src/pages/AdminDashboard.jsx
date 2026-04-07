import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import dashboardBg from '../assets/dashboard-bg.svg';
import api from '../utils/api';
import { ClipboardList, Clock, Loader2, CheckCircle, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const C = {
    charcoal:  '#4A4A4A',
    charcoalD: '#2e2e2e',
    charcoalL: '#5e5e5e',
    gray:      '#CBCBCB',
    grayD:     '#9a9a9a',
    ivory:     '#FFFFE3',
    slate:     '#6D8196',
    slateD:    '#556677',
    slateL:    '#8fa3b5',
};

const STAT_CARDS = (stats) => [
    { label: 'Total Complaints', value: stats?.total,      icon: ClipboardList, bg: C.charcoal, iconBg: C.slate,    textColor: C.ivory,    subColor: C.gray,                  border: C.charcoalL },
    { label: 'Pending',          value: stats?.pending,    icon: Clock,         bg: C.ivory,    iconBg: C.charcoal, textColor: C.charcoal, subColor: C.charcoalL,             border: C.gray },
    { label: 'In Progress',      value: stats?.inProgress, icon: Loader2,       bg: C.slate,    iconBg: C.charcoal, textColor: C.ivory,    subColor: 'rgba(255,255,227,0.7)', border: C.slateD },
    { label: 'Resolved',         value: stats?.resolved,   icon: CheckCircle,   bg: C.gray,     iconBg: C.slate,    textColor: C.charcoal, subColor: C.charcoalL,             border: '#b0b0b0' },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/complaints/all');
                setStats(data.stats); setRecentComplaints(data.complaints.slice(0, 5));
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        })();
    }, []);

    const resolvedPct = stats?.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

    const bgStyle = {
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e1e1e',
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', ...bgStyle }}>
            <Sidebar theme="slate" />
            <main className="main-content" style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

                {/* ══ HERO — ivory panel ══ */}
                <div className="fade-in" style={{
                    background: C.ivory, borderRadius: '1.15rem',
                    padding: '1.8rem 2.2rem', marginBottom: '1.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.charcoal}, ${C.slate})`, borderRadius: '1.15rem 1.15rem 0 0' }} />
                    <div style={{ position: 'absolute', right: -60, bottom: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, rgba(203,203,203,0.35) 0%, transparent 70%)`, pointerEvents: 'none' }} />

                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: 30, height: 30, borderRadius: '0.5rem', background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={15} color={C.ivory} />
                            </div>
                            <span style={{ color: C.charcoalL, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Smart Campus · Admin Dashboard</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: C.charcoal, lineHeight: 1.2, marginBottom: '0.3rem' }}>
                            Admin <span style={{ color: C.slate }}>Dashboard</span>
                        </h1>
                        <p style={{ color: C.grayD, fontSize: '0.85rem' }}>Comprehensive overview of all campus complaints and system performance.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to="/admin/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.62rem 1.25rem', borderRadius: '0.6rem', border: `1.5px solid ${C.gray}`, color: C.charcoal, fontSize: '0.85rem', fontWeight: 600, background: 'transparent', textDecoration: 'none', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = C.charcoal; e.currentTarget.style.color = C.ivory; e.currentTarget.style.borderColor = C.charcoal; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.charcoal; e.currentTarget.style.borderColor = C.gray; }}
                        ><ShieldCheck size={15} /> Manage</Link>
                        <Link to="/admin/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.5rem', borderRadius: '0.6rem', background: C.slate, color: C.ivory, fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', boxShadow: `0 4px 14px rgba(109,129,150,0.4)` }}
                            onMouseEnter={e => e.currentTarget.style.background = C.slateD}
                            onMouseLeave={e => e.currentTarget.style.background = C.slate}
                        ><Users size={16} /> View All</Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '45vh', gap: '1rem' }}>
                        <div className="spinner" style={{ width: 46, height: 46, borderWidth: 3 }} />
                        <p style={{ color: C.gray, fontSize: '0.875rem' }}>Loading dashboard…</p>
                    </div>
                ) : (
                    <>
                        {/* ══ STAT CARDS ══ */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.1rem', marginBottom: '1.75rem' }} className="stat-grid">
                            {STAT_CARDS(stats).map(({ label, value, icon: Icon, bg, iconBg, textColor, subColor, border }, i) => (
                                <div key={label} className="fade-in" style={{ background: bg, borderRadius: '1.1rem', padding: '1.4rem', border: `1.5px solid ${border}`, animationDelay: `${i * 0.07}s`, cursor: 'default', transition: 'transform 0.25s, box-shadow 0.25s', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.25)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Icon size={20} color={C.ivory} />
                                        </div>
                                        <span style={{ fontSize: '0.67rem', fontWeight: 700, color: textColor, background: `${textColor}18`, border: `1px solid ${textColor}35`, padding: '0.18rem 0.55rem', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            {label === 'Total Complaints' ? 'Total' : label}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '2.5rem', fontWeight: 800, color: textColor, lineHeight: 1, marginBottom: '0.25rem' }}>{value ?? 0}</p>
                                    <p style={{ fontSize: '0.78rem', color: subColor, fontWeight: 500 }}>{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* ══ MIDDLE ROW ══ */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.1rem', marginBottom: '1.75rem' }}>

                            {/* Quick Action — slate */}
                            <div className="fade-in" style={{ background: C.slate, borderRadius: '1.1rem', padding: '1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(109,129,150,0.35)' }}>
                                <div>
                                    <div style={{ width: 48, height: 48, borderRadius: '0.85rem', background: C.ivory, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                        <ShieldCheck size={22} color={C.slate} />
                                    </div>
                                    <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Manage Complaints</h3>
                                    <p style={{ color: 'rgba(255,255,227,0.75)', fontSize: '0.82rem', lineHeight: 1.7 }}>Review, update statuses, and add admin notes to all submitted campus complaints.</p>
                                </div>
                                <Link to="/admin/complaints" style={{ marginTop: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '0.65rem', background: C.ivory, color: C.slate, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = C.charcoal; e.currentTarget.style.color = C.ivory; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = C.ivory; e.currentTarget.style.color = C.slate; }}
                                >
                                    <Users size={15} /> View All Complaints
                                </Link>
                            </div>

                            {/* Resolution Overview — charcoal */}
                            <div className="fade-in" style={{ background: C.charcoal, borderRadius: '1.1rem', padding: '1.6rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>Resolution Overview</h3>
                                        <p style={{ color: C.gray, fontSize: '0.78rem' }}>Breakdown of all complaint statuses</p>
                                    </div>
                                    <div style={{ textAlign: 'center', background: C.slate, borderRadius: '0.8rem', padding: '0.55rem 1.1rem', boxShadow: '0 4px 12px rgba(109,129,150,0.4)' }}>
                                        <p style={{ color: C.ivory, fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{resolvedPct}%</p>
                                        <p style={{ color: 'rgba(255,255,227,0.7)', fontSize: '0.68rem', marginTop: '0.15rem' }}>Resolved</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                    {[
                                        { label: 'Resolved',    value: stats?.resolved,   color: C.slate,  trackBg: 'rgba(109,129,150,0.2)', icon: CheckCircle },
                                        { label: 'In Progress', value: stats?.inProgress, color: C.gray,   trackBg: 'rgba(203,203,203,0.15)', icon: Loader2 },
                                        { label: 'Pending',     value: stats?.pending,    color: C.ivory,  trackBg: 'rgba(255,255,227,0.1)', icon: Clock },
                                    ].map(({ label, value, color, trackBg, icon: Icon }) => {
                                        const pct = stats?.total > 0 ? (value / stats.total) * 100 : 0;
                                        return (
                                            <div key={label}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Icon size={13} color={color} />
                                                        <span style={{ color: C.gray, fontSize: '0.82rem', fontWeight: 500 }}>{label}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                        <span style={{ color, fontSize: '0.82rem', fontWeight: 700 }}>{value ?? 0}</span>
                                                        <span style={{ color: C.grayD, fontSize: '0.72rem' }}>{Math.round(pct)}%</span>
                                                    </div>
                                                </div>
                                                <div style={{ height: 7, borderRadius: 99, background: trackBg, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', borderRadius: 99, background: color, width: `${pct}%`, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ══ RECENT COMPLAINTS TABLE ══ */}
                        <div className="fade-in" style={{ background: '#3a3a3a', borderRadius: '1.1rem', padding: '1.6rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.3rem' }}>
                                <div>
                                    <h2 style={{ color: C.ivory, fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.15rem' }}>Recent Complaints</h2>
                                    <p style={{ color: C.grayD, fontSize: '0.78rem' }}>Latest submissions from students</p>
                                </div>
                                <Link to="/admin/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: C.ivory, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', padding: '0.42rem 1rem', background: C.slate, borderRadius: '0.55rem', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = C.slateD}
                                    onMouseLeave={e => e.currentTarget.style.background = C.slate}
                                >Manage all <ArrowRight size={13} /></Link>
                            </div>

                            {recentComplaints.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem', gap: '0.85rem', background: 'rgba(255,255,227,0.04)', borderRadius: '0.9rem', border: `1px dashed ${C.grayD}` }}>
                                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ClipboardList size={32} color={C.ivory} />
                                    </div>
                                    <p style={{ color: C.ivory, fontWeight: 600, fontSize: '1rem' }}>No complaints yet</p>
                                    <p style={{ color: C.gray, fontSize: '0.82rem' }}>Complaints submitted by students will appear here.</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: `1px solid ${C.charcoalL}` }}>
                                                {['Title', 'Category', 'Submitted By', 'Date', 'Status'].map((h) => (
                                                    <th key={h} style={{ padding: '0.65rem 0.9rem', textAlign: h === 'Status' ? 'center' : 'left', fontSize: '0.72rem', fontWeight: 700, color: C.grayD, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentComplaints.map((c) => {
                                                const statusStyle = {
                                                    Resolved:      { bg: C.slate,    color: C.ivory },
                                                    'In Progress': { bg: C.charcoal, color: C.gray  },
                                                    Pending:       { bg: C.gray,     color: C.charcoal },
                                                }[c.status] || { bg: C.gray, color: C.charcoal };
                                                return (
                                                    <tr key={c._id} style={{ borderBottom: `1px solid rgba(255,255,255,0.06)`, transition: 'background 0.18s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,227,0.04)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <td style={{ padding: '0.85rem 0.9rem', maxWidth: 200 }}><span style={{ color: C.ivory, fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{c.title}</span></td>
                                                        <td style={{ padding: '0.85rem 0.9rem' }}><span style={{ fontSize: '0.72rem', fontWeight: 600, color: C.ivory, background: C.slate, padding: '0.22rem 0.65rem', borderRadius: 99 }}>{c.category}</span></td>
                                                        <td style={{ padding: '0.85rem 0.9rem' }}>
                                                            <p style={{ color: C.ivory, fontSize: '0.83rem', fontWeight: 500 }}>{c.createdBy?.name}</p>
                                                            <p style={{ color: C.grayD, fontSize: '0.72rem' }}>{c.createdBy?.email}</p>
                                                        </td>
                                                        <td style={{ padding: '0.85rem 0.9rem', color: C.gray, fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                        <td style={{ padding: '0.85rem 0.9rem', textAlign: 'center' }}>
                                                            <span style={{ fontSize: '0.67rem', fontWeight: 700, color: statusStyle.color, background: statusStyle.bg, padding: '0.22rem 0.7rem', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{c.status}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            <style>{`
                @media (max-width: 1024px) { .stat-grid { grid-template-columns: repeat(2,1fr) !important; } }
                @media (max-width: 640px)  { .stat-grid { grid-template-columns: 1fr 1fr !important; } }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
