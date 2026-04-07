import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { GraduationCap, User, Mail, Lock, UserPlus, ShieldCheck, CheckCircle } from 'lucide-react';
import signupBg from '../assets/signup-bg.svg';

const C = {
    charcoal: '#4A4A4A',
    gray1:    '#CBCBCB',
    gray2:    '#9a9a9a',
    ivory:    '#FFFFE3',
    slate:    '#6D8196',
    slateL:   '#8fa3b5',
};

const inputStyle = (ivory, gray1, charcoal) => ({
    width: '100%', padding: '0.75rem 0.9rem 0.75rem 2.5rem',
    borderRadius: '0.65rem', border: `1.5px solid ${gray1}`,
    background: ivory, color: charcoal, fontSize: '0.9rem',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
});

const SignupPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const focusOn  = (e) => { e.target.style.borderColor = C.slate; e.target.style.boxShadow = '0 0 0 3px rgba(109,129,150,0.15)'; };
    const focusOff = (e) => { e.target.style.borderColor = C.gray1; e.target.style.boxShadow = 'none'; };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error('Please fill in all required fields');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            await api.post('/auth/signup', form);
            toast.success('Account created! Please login. 🎉');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed. Try again.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundImage: `url(${signupBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#c8c8b0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="signup-grid">

                {/* Left — Benefits */}
                <div className="fade-in hidden-mobile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '1.25rem', background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(74,74,74,0.25)' }}>
                            <GraduationCap size={38} color={C.ivory} strokeWidth={2} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: C.charcoal, lineHeight: 1.1 }}>Join Smart Campus</h1>
                            <p style={{ color: C.slate, fontSize: '0.95rem', marginTop: '0.2rem', fontWeight: 500 }}>Start managing complaints efficiently</p>
                        </div>
                    </div>

                    <p style={{ fontSize: '1.15rem', color: C.charcoal, lineHeight: 1.75, marginBottom: '2rem' }}>
                        Create your account and experience seamless complaint management.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {[
                            { icon: CheckCircle, title: 'Quick Setup', desc: 'Get started in less than a minute' },
                            { icon: ShieldCheck, title: 'Secure Platform', desc: 'Your information is always protected' },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '0.65rem', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(109,129,150,0.3)' }}>
                                    <Icon size={18} color={C.ivory} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700, color: C.charcoal, fontSize: '0.92rem', marginBottom: '0.15rem' }}>{title}</h3>
                                    <p style={{ fontSize: '0.82rem', color: C.gray2 }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2.5rem', height: 4, width: 80, borderRadius: 99, background: `linear-gradient(90deg, ${C.charcoal}, ${C.slate})` }} />
                </div>

                {/* Right — Form */}
                <div className="fade-in" style={{ animationDelay: '0.15s' }}>
                    <div style={{ background: 'rgba(255,255,227,0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 8px 40px rgba(74,74,74,0.18)', border: '1px solid rgba(255,255,227,0.70)' }}>

                        <div style={{ display: 'none', justifyContent: 'center', marginBottom: '1.5rem' }} className="mobile-logo">
                            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GraduationCap size={28} color={C.ivory} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: C.charcoal, marginBottom: '0.3rem' }}>Create Account</h2>
                            <p style={{ color: C.gray2, fontSize: '0.875rem' }}>Join our campus community today</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { id: 'name', name: 'name', type: 'text', label: 'Full Name', placeholder: 'John Doe', icon: User, autoComplete: 'name' },
                                { id: 'signup-email', name: 'email', type: 'email', label: 'Email Address', placeholder: 'you@college.edu', icon: Mail, autoComplete: 'email' },
                                { id: 'signup-password', name: 'password', type: 'password', label: 'Password', placeholder: 'Minimum 6 characters', icon: Lock, autoComplete: 'new-password' },
                            ].map(({ id, name, type, label, placeholder, icon: Icon, autoComplete }) => (
                                <div key={id}>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.45rem' }}>{label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <Icon size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: C.gray2 }} />
                                        <input id={id} name={name} type={type} autoComplete={autoComplete}
                                            value={form[name]} onChange={handleChange} placeholder={placeholder}
                                            style={inputStyle(C.ivory, C.gray1, C.charcoal)}
                                            onFocus={focusOn} onBlur={focusOff}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.55rem' }}>Account Type</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    {['student', 'admin'].map((r) => (
                                        <button key={r} type="button" onClick={() => setForm({ ...form, role: r })} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            padding: '0.75rem', borderRadius: '0.65rem', fontSize: '0.875rem', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            border: form.role === r ? `2px solid ${C.slate}` : `2px solid ${C.gray1}`,
                                            background: form.role === r ? C.slate : C.ivory,
                                            color: form.role === r ? C.ivory : C.charcoal,
                                            boxShadow: form.role === r ? '0 4px 14px rgba(109,129,150,0.3)' : 'none',
                                        }}>
                                            {r === 'admin' ? <ShieldCheck size={16} /> : <GraduationCap size={16} />}
                                            {r === 'admin' ? 'Admin' : 'Student'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem', borderRadius: '0.65rem', border: 'none', background: C.charcoal, color: C.ivory, fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(74,74,74,0.25)' }}
                                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = C.slate; e.currentTarget.style.boxShadow = '0 6px 20px rgba(109,129,150,0.35)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = C.charcoal; e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,74,74,0.25)'; }}
                            >
                                {loading ? <><div style={{ width: 18, height: 18, border: `2px solid rgba(255,255,227,0.3)`, borderTopColor: C.ivory, borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} /> Creating...</> : <><UserPlus size={18} /> Create Account</>}
                            </button>
                        </form>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.gray1}`, textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: C.gray2 }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: C.slate, fontWeight: 700, textDecoration: 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.color = C.charcoal}
                                    onMouseLeave={e => e.currentTarget.style.color = C.slate}
                                >Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .signup-grid { grid-template-columns: 1fr !important; }
                    .hidden-mobile { display: none !important; }
                    .mobile-logo { display: flex !important; }
                }
            `}</style>
        </div>
    );
};

export default SignupPage;
