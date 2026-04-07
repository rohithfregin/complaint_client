import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ClipboardList, Filter, Save, MessageSquare, X, ShieldCheck, Clock, Loader2, CheckCircle, Calendar, Tag } from 'lucide-react';

const C = {
    charcoal:  '#4A4A4A',
    charcoalD: '#2e2e2e',
    charcoalL: '#5e5e5e',
    gray:      '#CBCBCB',
    grayD:     '#9a9a9a',
    ivory:     '#FFFFE3',
    ivoryD:    '#f0f0c8',
    slate:     '#6D8196',
    slateD:    '#556677',
    slateL:    '#8fa3b5',
};

/* Status uses all 4 colors distinctly */
const STATUS_META = {
    Resolved:      { color: C.ivory,    bg: C.slate,    border: C.slateD,    icon: CheckCircle },
    'In Progress': { color: C.ivory,    bg: C.charcoal, border: C.charcoalL, icon: Loader2 },
    Pending:       { color: C.charcoal, bg: C.gray,     border: '#b0b0b0',   icon: Clock },
};

/* Badge style for inline status pills (text on transparent) */
const STATUS_PILL = {
    Resolved:      { color: C.slateL,  bg: 'rgba(109,129,150,0.15)', border: C.slate },
    'In Progress': { color: C.gray,    bg: 'rgba(203,203,203,0.12)', border: C.grayD },
    Pending:       { color: C.ivory,   bg: 'rgba(255,255,227,0.1)',  border: C.grayD },
};

const STATUS_OPTIONS   = ['Pending', 'In Progress', 'Resolved'];
const STATUS_FILTERS   = ['All', ...STATUS_OPTIONS];
const CATEGORY_OPTIONS = ['All', 'Electricity', 'Water', 'Infrastructure', 'Cleanliness', 'Internet', 'Safety', 'Canteen', 'Other'];

const ManageComplaints = () => {
    const [complaints, setComplaints]         = useState([]);
    const [loading, setLoading]               = useState(true);
    const [statusFilter, setStatusFilter]     = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [updating, setUpdating]             = useState(null);
    const [modal, setModal]                   = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [adminNote, setAdminNote]           = useState('');

    useEffect(() => { fetchComplaints(); }, [statusFilter, categoryFilter]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== 'All')   params.status   = statusFilter;
            if (categoryFilter !== 'All') params.category = categoryFilter;
            const { data } = await api.get('/complaints/all', { params });
            setComplaints(data.complaints);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openModal  = (c) => { setModal(c); setSelectedStatus(c.status); setAdminNote(c.adminNote || ''); };
    const closeModal = ()  => { setModal(null); setSelectedStatus(''); setAdminNote(''); };

    const handleUpdate = async () => {
        if (!modal) return;
        setUpdating(modal._id);
        try {
            await api.put('/complaints/update-status', { complaintId: modal._id, status: selectedStatus, adminNote });
            toast.success(`Status updated to "${selectedStatus}" ✅`);
            closeModal(); fetchComplaints();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status'); }
        finally { setUpdating(null); }
    };

    /* Filter pill active colors */
    const filterActive = {
        All:           { bg: C.slate,    color: C.ivory,    border: C.slateD },
        Pending:       { bg: C.gray,     color: C.charcoal, border: '#b0b0b0' },
        'In Progress': { bg: C.charcoal, color: C.ivory,    border: C.charcoalL },
        Resolved:      { bg: C.slate,    color: C.ivory,    border: C.slateD },
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.charcoal} 40%, ${C.slate} 40%, ${C.slate} 65%, ${C.gray} 65%, ${C.gray} 82%, ${C.ivory} 82%, ${C.ivory} 100%)` }}>
            <Sidebar theme="gray" />
            <main className="main-content" style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>

                {/* ══ HERO — ivory panel ══ */}
                <div className="fade-in" style={{
                    background: C.ivory, borderRadius: '1.15rem',
                    padding: '1.8rem 2.2rem', marginBottom: '1.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                }}>
                    {/* top accent stripe */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.charcoal}, ${C.slate})`, borderRadius: '1.15rem 1.15rem 0 0' }} />
                    {/* gray orb */}
                    <div style={{ position: 'absolute', right: -60, bottom: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, rgba(203,203,203,0.35) 0%, transparent 70%)`, pointerEvents: 'none' }} />

                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: 30, height: 30, borderRadius: '0.5rem', background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={15} color={C.ivory} />
                            </div>
                            <span style={{ color: C.charcoalL, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Smart Campus · Admin Panel</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: C.charcoal, lineHeight: 1.2, marginBottom: '0.3rem' }}>
                            Manage <span style={{ color: C.slate }}>Complaints</span>
                        </h1>
                        <p style={{ color: C.grayD, fontSize: '0.85rem' }}>Review, update statuses and add notes to all campus complaints.</p>
                    </div>

                    {/* count badge */}
                    <div style={{ textAlign: 'center', background: C.slate, borderRadius: '0.9rem', padding: '0.65rem 1.4rem', boxShadow: '0 4px 14px rgba(109,129,150,0.4)' }}>
                        <p style={{ color: C.ivory, fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{complaints.length}</p>
                        <p style={{ color: 'rgba(255,255,227,0.75)', fontSize: '0.68rem', marginTop: '0.15rem' }}>
                            {statusFilter === 'All' && categoryFilter === 'All' ? 'Total' : 'Filtered'}
                        </p>
                    </div>
                </div>

                {/* ══ FILTER BAR — charcoal card ══ */}
                <div className="fade-in" style={{
                    background: C.charcoal, borderRadius: '1rem', padding: '1rem 1.4rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
                    marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: C.gray, fontSize: '0.8rem', fontWeight: 600 }}>
                        <Filter size={14} /> Status:
                    </div>
                    {STATUS_FILTERS.map((s) => {
                        const active = statusFilter === s;
                        const ac = filterActive[s] || filterActive.All;
                        return (
                            <button key={s} onClick={() => setStatusFilter(s)} style={{
                                padding: '0.38rem 1.1rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s',
                                border: active ? `1.5px solid ${ac.border}` : `1.5px solid ${C.charcoalL}`,
                                background: active ? ac.bg : 'transparent',
                                color: active ? ac.color : C.grayD,
                                boxShadow: active ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                            }}>{s}</button>
                        );
                    })}

                    <div style={{ width: 1, height: 20, background: C.charcoalL, margin: '0 0.25rem' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: C.gray, fontSize: '0.8rem', fontWeight: 600 }}>
                        <Tag size={13} /> Category:
                    </div>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{
                        padding: '0.38rem 0.9rem', borderRadius: '0.55rem', fontSize: '0.8rem', fontWeight: 500,
                        border: `1.5px solid ${C.charcoalL}`, background: C.charcoalD, color: C.gray,
                        cursor: 'pointer', outline: 'none',
                    }}>
                        {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* ══ CONTENT ══ */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: '1rem' }}>
                        <div className="spinner" style={{ width: 46, height: 46, borderWidth: 3 }} />
                        <p style={{ color: C.gray, fontSize: '0.875rem' }}>Loading complaints…</p>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="fade-in" style={{ background: C.charcoal, borderRadius: '1.1rem', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', border: `1.5px dashed ${C.charcoalL}` }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(109,129,150,0.4)' }}>
                            <ClipboardList size={32} color={C.ivory} />
                        </div>
                        <p style={{ color: C.ivory, fontWeight: 600, fontSize: '1rem' }}>No complaints found</p>
                        <p style={{ color: C.gray, fontSize: '0.82rem' }}>Try adjusting the filters above.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {complaints.map((c, i) => {
                            const pill = STATUS_PILL[c.status] || STATUS_PILL.Pending;
                            const StatusIcon = STATUS_META[c.status]?.icon || Clock;
                            /* alternate card bg for visual rhythm */
                            const cardBg = i % 3 === 0 ? '#3a3a3a' : i % 3 === 1 ? C.charcoal : '#333333';
                            return (
                                <div key={c._id} className="fade-in" style={{
                                    background: cardBg, borderRadius: '1rem', padding: '1.3rem 1.5rem',
                                    animationDelay: `${i * 0.04}s`,
                                    transition: 'transform 0.22s, box-shadow 0.22s',
                                    position: 'relative', overflow: 'hidden',
                                    borderLeft: `4px solid ${STATUS_META[c.status]?.bg || C.gray}`,
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.25)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            {/* Title row */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.55rem', flexWrap: 'wrap' }}>
                                                <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '0.97rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</h3>
                                                {/* category — ivory bg */}
                                                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: C.charcoal, background: C.ivory, padding: '0.18rem 0.6rem', borderRadius: 99 }}>{c.category}</span>
                                                {/* status pill */}
                                                <span style={{ fontSize: '0.67rem', fontWeight: 700, color: pill.color, background: pill.bg, border: `1px solid ${pill.border}`, padding: '0.18rem 0.65rem', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <StatusIcon size={10} /> {c.status}
                                                </span>
                                            </div>

                                            <p style={{ color: C.gray, fontSize: '0.82rem', lineHeight: 1.65, marginBottom: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>

                                            {/* meta row */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                                <span style={{ color: C.grayD, fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    👤 <span style={{ color: C.gray }}>{c.createdBy?.name}</span>
                                                </span>
                                                <span style={{ color: C.grayD, fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    📧 <span style={{ color: C.gray }}>{c.createdBy?.email}</span>
                                                </span>
                                                <span style={{ color: C.grayD, fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <Calendar size={11} />
                                                    <span style={{ color: C.gray }}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </span>
                                            </div>

                                            {/* admin note */}
                                            {c.adminNote && (
                                                <div style={{ marginTop: '0.7rem', borderRadius: '0.6rem', padding: '0.55rem 0.85rem', background: 'rgba(255,255,227,0.06)', border: `1px solid ${C.charcoalL}`, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                    <MessageSquare size={12} color={C.slateL} style={{ flexShrink: 0, marginTop: 2 }} />
                                                    <span style={{ color: C.gray, fontSize: '0.76rem', lineHeight: 1.5 }}>
                                                        <span style={{ color: C.slateL, fontWeight: 600 }}>Admin note: </span>{c.adminNote}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Update button — slate */}
                                        <button onClick={() => openModal(c)} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                            padding: '0.6rem 1.3rem', borderRadius: '0.65rem', fontSize: '0.82rem', fontWeight: 700,
                                            background: C.slate, color: C.ivory, border: 'none', cursor: 'pointer',
                                            flexShrink: 0, transition: 'all 0.2s', boxShadow: '0 3px 10px rgba(109,129,150,0.35)',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = C.slateD; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = C.slate; }}
                                        >
                                            <ShieldCheck size={14} /> Update
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* ══ UPDATE MODAL ══ */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    <div className="fade-in" style={{
                        background: C.charcoal, borderRadius: '1.25rem', padding: '1.75rem',
                        width: '100%', maxWidth: 460, position: 'relative', overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        border: `1.5px solid ${C.charcoalL}`,
                    }}>
                        {/* ivory top stripe */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.slate}, ${C.ivory})`, borderRadius: '1.25rem 1.25rem 0 0' }} />

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.4rem', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '0.65rem', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(109,129,150,0.4)' }}>
                                    <ShieldCheck size={18} color={C.ivory} />
                                </div>
                                <div>
                                    <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '1rem' }}>Update Complaint</h3>
                                    <p style={{ color: C.grayD, fontSize: '0.76rem', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>{modal.title}</p>
                                </div>
                            </div>
                            <button onClick={closeModal} style={{ width: 30, height: 30, borderRadius: '0.5rem', border: 'none', background: C.charcoalL, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gray, transition: 'all 0.2s', flexShrink: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.background = C.slate; e.currentTarget.style.color = C.ivory; }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.charcoalL; e.currentTarget.style.color = C.gray; }}
                            ><X size={16} /></button>
                        </div>

                        {/* Status selector — each button uses a distinct color */}
                        <div style={{ marginBottom: '1.2rem' }}>
                            <p style={{ color: C.gray, fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Change Status</p>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                {STATUS_OPTIONS.map((s) => {
                                    const m = STATUS_META[s];
                                    const active = selectedStatus === s;
                                    return (
                                        <button key={s} onClick={() => setSelectedStatus(s)} style={{
                                            flex: 1, padding: '0.65rem 0.4rem', borderRadius: '0.7rem',
                                            fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                                            border: active ? `1.5px solid ${m.border}` : `1.5px solid ${C.charcoalL}`,
                                            background: active ? m.bg : 'rgba(255,255,255,0.04)',
                                            color: active ? m.color : C.grayD,
                                            boxShadow: active ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                                        }}>
                                            <m.icon size={12} /> {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Admin note */}
                        <div style={{ marginBottom: '1.2rem' }}>
                            <p style={{ color: C.gray, fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <MessageSquare size={13} /> Admin Note <span style={{ color: C.grayD, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                            </p>
                            <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Add a note for the student..."
                                rows={3}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: `1.5px solid ${C.charcoalL}`, background: C.charcoalD, color: C.ivory, fontSize: '0.875rem', outline: 'none', resize: 'none', lineHeight: 1.65, boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                onFocus={e => { e.target.style.borderColor = C.slate; e.target.style.boxShadow = `0 0 0 3px rgba(109,129,150,0.2)`; }}
                                onBlur={e => { e.target.style.borderColor = C.charcoalL; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Image preview */}
                        {modal.image && (
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ color: C.grayD, fontSize: '0.72rem', marginBottom: '0.5rem' }}>Attached image:</p>
                                <img src={`/uploads/${modal.image}`} alt="Complaint" style={{ borderRadius: '0.75rem', width: '100%', maxHeight: 140, objectFit: 'cover', border: `1px solid ${C.charcoalL}` }} />
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {/* Cancel — gray bg */}
                            <button onClick={closeModal} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: C.gray, color: C.charcoal, fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#b5b5b5'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.gray; }}
                            >Cancel</button>
                            {/* Save — ivory bg */}
                            <button onClick={handleUpdate} disabled={updating === modal._id} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: C.ivory, color: C.charcoal, fontSize: '0.875rem', fontWeight: 700, cursor: updating === modal._id ? 'not-allowed' : 'pointer', opacity: updating === modal._id ? 0.7 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                                onMouseEnter={e => { if (updating !== modal._id) e.currentTarget.style.background = C.ivoryD; }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.ivory; }}
                            >
                                {updating === modal._id
                                    ? <><div style={{ width: 15, height: 15, border: `2px solid rgba(74,74,74,0.3)`, borderTopColor: C.charcoal, borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} /> Saving…</>
                                    : <><Save size={15} /> Save Changes</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default ManageComplaints;
