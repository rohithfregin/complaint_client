import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, PlusCircle, ClipboardList,
    Settings, LogOut, GraduationCap, ShieldCheck, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

const studentLinks = [
    { to: '/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
    { to: '/submit',        label: 'Submit Complaint', icon: PlusCircle },
    { to: '/my-complaints', label: 'My Complaints',    icon: ClipboardList },
];

const adminLinks = [
    { to: '/admin',            label: 'Admin Dashboard',   icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Manage Complaints', icon: Settings },
];

/*
 * THEMES — each page passes one of these keys:
 *   'dark'   → charcoal bg  (dashboards dark bg)
 *   'slate'  → slate bg     (manage complaints)
 *   'gray'   → gray bg      (my complaints)
 *   'ivory'  → ivory bg     (submit, login pages)
 */
const THEMES = {
    dark: {
        bg:          '#4A4A4A',
        border:      'rgba(255,255,227,0.12)',
        logoBg:      '#6D8196',
        logoIcon:    '#FFFFE3',
        logoText:    '#FFFFE3',
        logoSub:     'rgba(255,255,227,0.5)',
        userCard:    'rgba(255,255,227,0.07)',
        userBorder:  'rgba(255,255,227,0.12)',
        avatarBg:    '#6D8196',
        avatarText:  '#FFFFE3',
        userName:    '#FFFFE3',
        userRole:    'rgba(255,255,227,0.5)',
        navLabel:    'rgba(255,255,227,0.4)',
        linkText:    '#CBCBCB',
        activeBg:    '#6D8196',
        activeText:  '#FFFFE3',
        hoverBg:     'rgba(109,129,150,0.2)',
        hoverText:   '#FFFFE3',
        divider:     'rgba(255,255,227,0.1)',
        logoutText:  '#CBCBCB',
        logoutHover: 'rgba(203,203,203,0.12)',
        logoutHoverText: '#FFFFE3',
        mobileBtnBg: '#4A4A4A',
        mobileBtnBorder: 'rgba(109,129,150,0.4)',
        mobileBtnColor: '#6D8196',
    },
    slate: {
        bg:          '#6D8196',
        border:      'rgba(255,255,227,0.15)',
        logoBg:      '#4A4A4A',
        logoIcon:    '#FFFFE3',
        logoText:    '#FFFFE3',
        logoSub:     'rgba(255,255,227,0.55)',
        userCard:    'rgba(74,74,74,0.25)',
        userBorder:  'rgba(74,74,74,0.4)',
        avatarBg:    '#4A4A4A',
        avatarText:  '#FFFFE3',
        userName:    '#FFFFE3',
        userRole:    'rgba(255,255,227,0.55)',
        navLabel:    'rgba(255,255,227,0.45)',
        linkText:    'rgba(255,255,227,0.8)',
        activeBg:    '#4A4A4A',
        activeText:  '#FFFFE3',
        hoverBg:     'rgba(74,74,74,0.25)',
        hoverText:   '#FFFFE3',
        divider:     'rgba(255,255,227,0.12)',
        logoutText:  'rgba(255,255,227,0.7)',
        logoutHover: 'rgba(74,74,74,0.2)',
        logoutHoverText: '#FFFFE3',
        mobileBtnBg: '#6D8196',
        mobileBtnBorder: 'rgba(255,255,227,0.3)',
        mobileBtnColor: '#FFFFE3',
    },
    gray: {
        bg:          '#CBCBCB',
        border:      'rgba(74,74,74,0.15)',
        logoBg:      '#4A4A4A',
        logoIcon:    '#FFFFE3',
        logoText:    '#4A4A4A',
        logoSub:     '#6e6e6e',
        userCard:    'rgba(74,74,74,0.08)',
        userBorder:  'rgba(74,74,74,0.18)',
        avatarBg:    '#6D8196',
        avatarText:  '#FFFFE3',
        userName:    '#4A4A4A',
        userRole:    '#6e6e6e',
        navLabel:    '#9a9a9a',
        linkText:    '#4A4A4A',
        activeBg:    '#4A4A4A',
        activeText:  '#FFFFE3',
        hoverBg:     'rgba(74,74,74,0.1)',
        hoverText:   '#4A4A4A',
        divider:     'rgba(74,74,74,0.15)',
        logoutText:  '#6e6e6e',
        logoutHover: 'rgba(74,74,74,0.1)',
        logoutHoverText: '#4A4A4A',
        mobileBtnBg: '#CBCBCB',
        mobileBtnBorder: 'rgba(74,74,74,0.3)',
        mobileBtnColor: '#4A4A4A',
    },
    ivory: {
        bg:          '#FFFFE3',
        border:      'rgba(74,74,74,0.12)',
        logoBg:      '#4A4A4A',
        logoIcon:    '#FFFFE3',
        logoText:    '#4A4A4A',
        logoSub:     '#9a9a9a',
        userCard:    'rgba(74,74,74,0.06)',
        userBorder:  'rgba(74,74,74,0.14)',
        avatarBg:    '#6D8196',
        avatarText:  '#FFFFE3',
        userName:    '#4A4A4A',
        userRole:    '#9a9a9a',
        navLabel:    '#b0b0b0',
        linkText:    '#4A4A4A',
        activeBg:    '#6D8196',
        activeText:  '#FFFFE3',
        hoverBg:     'rgba(109,129,150,0.1)',
        hoverText:   '#4A4A4A',
        divider:     'rgba(74,74,74,0.1)',
        logoutText:  '#9a9a9a',
        logoutHover: 'rgba(74,74,74,0.08)',
        logoutHoverText: '#4A4A4A',
        mobileBtnBg: '#FFFFE3',
        mobileBtnBorder: 'rgba(74,74,74,0.25)',
        mobileBtnColor: '#4A4A4A',
    },
};

const Sidebar = ({ theme = 'dark' }) => {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const links = isAdmin ? adminLinks : studentLinks;
    const T = THEMES[theme] || THEMES.dark;

    const handleLogout = () => { logout(); navigate('/login'); };

    const SidebarContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: T.bg, transition: 'background 0.3s' }}>

            {/* ── Logo ── */}
            <div style={{ padding: '1.5rem 1.4rem 1.25rem', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: '0.75rem', flexShrink: 0,
                        background: T.logoBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    }}>
                        <GraduationCap size={22} color={T.logoIcon} />
                    </div>
                    <div>
                        <p style={{ color: T.logoText, fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>Smart Campus</p>
                        <p style={{ color: T.logoSub, fontSize: '0.72rem', marginTop: '0.1rem' }}>Complaint System</p>
                    </div>
                </div>
            </div>

            {/* ── User Card ── */}
            <div style={{ padding: '1rem 1rem 0' }}>
                <div style={{
                    background: T.userCard, border: `1px solid ${T.userBorder}`,
                    borderRadius: '0.85rem', padding: '0.85rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                        background: T.avatarBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.95rem', color: T.avatarText,
                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ color: T.userName, fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                            {isAdmin ? <ShieldCheck size={11} color={T.userRole} /> : <GraduationCap size={11} color={T.userRole} />}
                            <span style={{ color: T.userRole, fontSize: '0.72rem', textTransform: 'capitalize' }}>{user?.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Nav Links ── */}
            <nav style={{ flex: 1, padding: '1rem 0.75rem 0.5rem' }}>
                <p style={{ color: T.navLabel, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.6rem', marginBottom: '0.5rem' }}>
                    Navigation
                </p>
                {links.map(({ to, label, icon: Icon }) => {
                    const active = location.pathname === to;
                    return (
                        <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{
                            display: 'flex', alignItems: 'center', gap: '0.7rem',
                            padding: '0.65rem 0.85rem', borderRadius: '0.7rem', marginBottom: '0.25rem',
                            fontSize: '0.875rem', fontWeight: active ? 700 : 500,
                            textDecoration: 'none', transition: 'all 0.2s ease',
                            color: active ? T.activeText : T.linkText,
                            background: active ? T.activeBg : 'transparent',
                            boxShadow: active ? '0 4px 14px rgba(0,0,0,0.2)' : 'none',
                        }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.hoverBg; e.currentTarget.style.color = T.hoverText; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.linkText; } }}
                        >
                            <Icon size={17} />{label}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Logout ── */}
            <div style={{ padding: '1rem', borderTop: `1px solid ${T.divider}` }}>
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '0.7rem',
                    padding: '0.65rem 0.85rem', borderRadius: '0.7rem',
                    width: '100%', fontSize: '0.875rem', fontWeight: 500,
                    color: T.logoutText, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.logoutHover; e.currentTarget.style.color = T.logoutHoverText; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.logoutText; }}
                >
                    <LogOut size={17} /> Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{
                position: 'fixed', top: '1rem', left: '1rem', zIndex: 50,
                padding: '0.5rem', borderRadius: '0.6rem',
                background: T.mobileBtnBg, border: `1px solid ${T.mobileBtnBorder}`,
                color: T.mobileBtnColor, cursor: 'pointer', display: 'none',
            }} className="mobile-menu-btn">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', background: T.bg }}>
                <SidebarContent />
            </aside>

            {mobileOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }} onClick={() => setMobileOpen(false)} />
            )}

            <style>{`@media (max-width: 768px) { .mobile-menu-btn { display: flex !important; } }`}</style>
        </>
    );
};

export default Sidebar;
