import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import api from '../utils/api';
import { ClipboardList, Filter, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import complaintsBg from '../assets/complaints-bg.svg';

const C = { gray1: '#CBCBCB', gray2: '#9a9a9a', gray3: '#6e6e6e', ivory: '#FFFFE3', charcoal: '#4A4A4A', slate: '#6D8196', slateL: '#8fa3b5' };
const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];
const FILTER_COLORS = {
    All:           { color: C.slateL, bg: 'rgba(143,163,181,0.12)', border: 'rgba(143,163,181,0.35)' },
    Pending:       { color: C.gray1,  bg: 'rgba(203,203,203,0.10)', border: 'rgba(203,203,203,0.3)'  },
    'In Progress': { color: C.slate,  bg: 'rgba(109,129,150,0.12)', border: 'rgba(109,129,150,0.35)' },
    Resolved:      { color: C.slateL, bg: 'rgba(143,163,181,0.12)', border: 'rgba(143,163,181,0.35)' },
};
const card = (extra = {}) => ({ background: 'rgba(255,255,227,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,227,0.14)', borderRadius: '1.15rem', boxShadow: '0 4px 24px rgba(0,0,0,0.35)', ...extra });

const ComplaintStatus = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchComplaints(); }, [filter]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params = filter !== 'All' ? { status: filter } : {};
            const { data } = await api.get('/complaints/user', { params });
            setComplaints(data.complaints);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundImage: `url(${complaintsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1e1e1e' }}>
            <Sidebar theme="ivory" />
            <main className="main-content" style={{ flex: 1, padding: '2rem 2.5rem', position: 'relative', zIndex: 1, overflowY: 'auto' }}>

                {/* HERO */}
                <div className="fade-in" style={{ ...card(), background: C.charcoal, border: `1px solid ${C.charcoal}`, padding: '1.8rem 2.2rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,129,150,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', left: -40, bottom: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,227,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '0.55rem', background: 'linear-gradient(135deg, #4A4A4A, #6D8196)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(109,129,150,0.5)' }}>
                                <ClipboardList size={16} color={C.ivory} />
                            </div>
                            <span style={{ color: 'rgba(255,255,227,0.6)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Smart Campus · My Complaints</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: C.ivory, lineHeight: 1.2, marginBottom: '0.3rem' }}>
                            My <span style={{ background: 'linear-gradient(135deg, #CBCBCB, #FFFFE3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Complaints</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,227,0.65)', fontSize: '0.85rem' }}>Track the status of all your submitted complaints</p>
                    </div>
                    <Link to="/submit" className="btn-gradient" style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}>
                        <PlusCircle size={16} /> New Complaint
                    </Link>
                </div>

                {/* FILTER BAR */}
                <div className="fade-in" style={{ ...card({ padding: '1rem 1.4rem' }), display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: C.gray1, fontSize: '0.8rem', fontWeight: 600 }}>
                        <Filter size={14} /> Filter:
                    </div>
                    {STATUS_FILTERS.map((s) => {
                        const fc = FILTER_COLORS[s]; const active = filter === s;
                        return (
                            <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.38rem 1.1rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: active ? `1.5px solid ${fc.color}` : `1.5px solid ${C.gray1}`, background: active ? fc.bg : 'transparent', color: active ? fc.color : C.gray2, boxShadow: active ? `0 0 12px ${fc.color}33` : 'none' }}>{s}</button>
                        );
                    })}
                    <span style={{ marginLeft: 'auto', color: C.gray1, fontSize: '0.78rem' }}>{complaints.length} complaint{complaints.length !== 1 ? 's' : ''}</span>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: '1rem' }}>
                        <div className="spinner" style={{ width: 46, height: 46, borderWidth: 3 }} />
                        <p style={{ color: C.gray1, fontSize: '0.875rem' }}>Loading your complaints…</p>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="fade-in" style={{ ...card({ padding: '4rem 2rem' }), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', border: '1.5px dashed rgba(203,203,203,0.30)' }}>
                        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(109,129,150,0.18), rgba(143,163,181,0.08))', border: '1px solid rgba(109,129,150,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ClipboardList size={34} color={C.slate} />
                        </div>
                        <p style={{ color: C.ivory, fontWeight: 600, fontSize: '1rem' }}>No {filter !== 'All' ? filter : ''} complaints found</p>
                        <p style={{ color: C.gray1, fontSize: '0.82rem', textAlign: 'center', maxWidth: 300 }}>Try a different filter or submit a new complaint.</p>
                        <Link to="/submit" className="btn-gradient" style={{ marginTop: '0.4rem', fontSize: '0.85rem', padding: '0.68rem 1.5rem' }}>
                            <PlusCircle size={15} /> Submit a Complaint
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.1rem' }} className="complaints-grid">
                        {complaints.map((c, i) => <ComplaintCard key={c._id} complaint={c} index={i} />)}
                    </div>
                )}
            </main>
            <style>{`
                @media (max-width: 1024px) { .complaints-grid { grid-template-columns: repeat(2,1fr) !important; } }
                @media (max-width: 640px)  { .complaints-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </div>
    );
};

export default ComplaintStatus;
