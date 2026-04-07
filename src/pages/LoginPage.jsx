import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, LogIn, Shield } from 'lucide-react';
import loginBg from '../assets/login-bg.svg';

const C = {
    charcoal: '#4A4A4A',
    charcoalD: '#2e2e2e',
    gray1:    '#CBCBCB',
    gray2:    '#9a9a9a',
    ivory:    '#FFFFE3',
    ivoryD:   '#f0f0c8',
    slate:    '#6D8196',
    slateD:   '#556677',
    slateL:   '#8fa3b5',
};

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) return toast.error('Please fill in all fields');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login(data.user, data.token);
            toast.success(`Welcome back, ${data.user.name}! 👋`);
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Try again.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="login-grid">

                {/* Left — Branding */}
                <div className="fade-in hidden-mobile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '1.25rem', background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(74,74,74,0.25)' }}>
                            <GraduationCap size={38} color={C.ivory} strokeWidth={2} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: C.ivory, lineHeight: 1.1 }}>Smart Campus</h1>
                            <p style={{ color: C.slate, fontSize: '0.95rem', marginTop: '0.2rem', fontWeight: 500 }}>Issue Tracking System</p>
                        </div>
                    </div>

                    <p style={{ fontSize: '1.15rem', color: C.ivory, lineHeight: 1.75, marginBottom: '2rem', fontWeight: 400 }}>
                        Streamline campus complaint management with our intelligent tracking platform.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {[
                            { icon: Shield, title: 'Secure & Reliable', desc: 'Your data is protected with enterprise-grade security' },
                            { icon: GraduationCap, title: 'Real-time Tracking', desc: 'Monitor complaint status and get instant updates' },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '0.65rem', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(109,129,150,0.3)' }}>
                                    <Icon size={18} color={C.ivory} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, color: C.ivory, fontSize: '0.92rem', marginBottom: '0.15rem' }}>{title}</h3>
                                    <p style={{ fontSize: '0.82rem', color: C.gray1 }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* decorative bar */}
                    <div style={{ marginTop: '2.5rem', height: 4, width: 80, borderRadius: 99, background: `linear-gradient(90deg, ${C.charcoal}, ${C.slate})` }} />
                </div>

                {/* Right — Form */}
                <div className="fade-in" style={{ animationDelay: '0.15s' }}>
                    <div style={{ background: 'rgba(255,255,227,0.12)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 8px 48px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,227,0.18)' }}>

                        {/* mobile logo */}
                        <div style={{ display: 'none', justifyContent: 'center', marginBottom: '1.5rem' }} className="mobile-logo">
                            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GraduationCap size={28} color={C.ivory} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: C.ivory, marginBottom: '0.3rem' }}>Welcome Back</h2>
                            <p style={{ color: C.gray1, fontSize: '0.875rem' }}>Sign in to access your dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: C.ivory, marginBottom: '0.45rem' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: C.gray2 }} />
                                    <input name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@college.edu"
                                        style={{ width: '100%', padding: '0.75rem 0.9rem 0.75rem 2.5rem', borderRadius: '0.65rem', border: `1.5px solid ${C.gray1}`, background: C.ivory, color: C.charcoal, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' }}
                                        onFocus={e => { e.target.style.borderColor = C.slate; e.target.style.boxShadow = `0 0 0 3px rgba(109,129,150,0.15)`; }}
                                        onBlur={e => { e.target.style.borderColor = C.gray1; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: C.ivory, marginBottom: '0.45rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: C.gray2 }} />
                                    <input name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="••••••••"
                                        style={{ width: '100%', padding: '0.75rem 0.9rem 0.75rem 2.5rem', borderRadius: '0.65rem', border: `1.5px solid ${C.gray1}`, background: C.ivory, color: C.charcoal, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' }}
                                        onFocus={e => { e.target.style.borderColor = C.slate; e.target.style.boxShadow = `0 0 0 3px rgba(109,129,150,0.15)`; }}
                                        onBlur={e => { e.target.style.borderColor = C.gray1; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem', borderRadius: '0.65rem', border: 'none', background: C.charcoal, color: C.ivory, fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(74,74,74,0.25)' }}
                                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = C.slate; e.currentTarget.style.boxShadow = '0 6px 20px rgba(109,129,150,0.35)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.charcoal; e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,74,74,0.25)'; }}
                            >
                                {loading ? <><div style={{ width: 18, height: 18, border: `2px solid rgba(255,255,227,0.3)`, borderTopColor: C.ivory, borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} /> Signing in...</> : <><LogIn size={18} /> Sign In</>}
                            </button>
                        </form>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid rgba(255,255,227,0.15)`, textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: C.gray1 }}>
                                Don't have an account?{' '}
                                <Link to="/signup" style={{ color: C.slate, fontWeight: 700, textDecoration: 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.color = C.charcoal}
                                    onMouseLeave={e => e.currentTarget.style.color = C.slate}
                                >Create Account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .login-grid { grid-template-columns: 1fr !important; }
                    .hidden-mobile { display: none !important; }
                    .mobile-logo { display: flex !important; }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
