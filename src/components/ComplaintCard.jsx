import { Calendar, Tag, ImageIcon, MessageSquare } from 'lucide-react';

const C = { gray1: '#CBCBCB', gray2: '#9a9a9a', gray3: '#6e6e6e', ivory: '#FFFFE3', charcoal: '#4A4A4A', slate: '#6D8196', slateL: '#8fa3b5' };

const STATUS_META = {
    Resolved:      { color: C.slateL,  bg: 'rgba(109,129,150,0.25)', border: 'rgba(109,129,150,0.45)'  },
    'In Progress': { color: C.gray1,   bg: 'rgba(203,203,203,0.18)', border: 'rgba(203,203,203,0.35)' },
    Pending:       { color: C.ivory,   bg: 'rgba(255,255,227,0.15)', border: 'rgba(255,255,227,0.30)'  },
};

const ComplaintCard = ({ complaint, showUser = false, index = 0 }) => {
    const { title, description, category, status, image, adminNote, createdBy, createdAt } = complaint;
    const meta = STATUS_META[status] || STATUS_META.Pending;
    const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="fade-in" style={{ background: 'rgba(255,255,227,0.09)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,227,0.16)', borderRadius: '0.9rem', padding: '1.15rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', animationDelay: `${index * 0.06}s`, transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s', cursor: 'default', boxShadow: '0 4px 20px rgba(0,0,0,0.30)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.45)'; e.currentTarget.style.borderColor = 'rgba(109,129,150,0.50)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.30)'; e.currentTarget.style.borderColor = 'rgba(255,255,227,0.16)'; }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.67rem', fontWeight: 700, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, padding: '0.22rem 0.7rem', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{status}</span>
                <span style={{ color: C.gray1, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={11} /> {formattedDate}</span>
            </div>

            <h3 style={{ color: C.ivory, fontWeight: 600, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>

            <p style={{ color: C.gray1, fontSize: '0.79rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</p>

            {image && <img src={`/uploads/${image}`} alt="Complaint" style={{ borderRadius: '0.65rem', width: '100%', maxHeight: 160, objectFit: 'cover', border: `1px solid ${C.gray1}` }} />}

            {adminNote && (
                <div style={{ borderRadius: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(109,129,150,0.20)', border: '1px solid rgba(109,129,150,0.35)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <MessageSquare size={13} color={C.slateL} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: C.ivory, fontSize: '0.76rem', lineHeight: 1.5 }}>
                        <span style={{ color: C.slateL, fontWeight: 600 }}>Admin: </span>{adminNote}
                    </span>
                </div>
            )}

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,227,0.12)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.71rem', color: C.gray1, background: 'rgba(255,255,227,0.08)', padding: '0.22rem 0.65rem', borderRadius: 99, border: '1px solid rgba(255,255,227,0.15)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Tag size={10} /> {category}
                </span>
                {image && <span style={{ fontSize: '0.71rem', color: C.slateL, background: 'rgba(109,129,150,0.18)', padding: '0.22rem 0.65rem', borderRadius: 99, border: '1px solid rgba(109,129,150,0.30)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ImageIcon size={10} /> Image attached</span>}
                {showUser && createdBy && <span style={{ fontSize: '0.71rem', color: C.gray1 }}>👤 {createdBy.name}</span>}
            </div>
        </div>
    );
};

export default ComplaintCard;
