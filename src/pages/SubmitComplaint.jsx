import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Send, Upload, X, Tag, FileText, AlignLeft, ClipboardList, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import submitBg from '../assets/submit-bg.svg';

const C = { charcoal: '#4A4A4A', gray1: '#CBCBCB', gray2: '#9a9a9a', gray3: '#6e6e6e', ivory: '#FFFFE3', slate: '#6D8196', slateD: '#556677', slateL: '#8fa3b5' };
const CATEGORIES = ['Electricity', 'Water', 'Infrastructure', 'Cleanliness', 'Internet', 'Safety', 'Canteen', 'Other'];

const card = (extra = {}) => ({ background: 'rgba(255,255,227,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,227,0.14)', borderRadius: '1.15rem', boxShadow: '0 4px 24px rgba(0,0,0,0.35)', ...extra });
const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid rgba(203,203,203,0.30)', background: 'rgba(255,255,227,0.08)', color: '#FFFFE3', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' };
const focusOn  = (e) => { e.target.style.borderColor = '#6D8196'; e.target.style.boxShadow = '0 0 0 3px rgba(109,129,150,0.25)'; };
const focusOff = (e) => { e.target.style.borderColor = 'rgba(203,203,203,0.30)'; e.target.style.boxShadow = 'none'; };

const SubmitComplaint = () => {
    const [form, setForm] = useState({ title: '', description: '', category: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return toast.error('Image must be less than 5MB');
        setImage(file); setPreview(URL.createObjectURL(file));
    };
    const removeImage = () => { setImage(null); setPreview(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.category) return toast.error('Please fill in all required fields');
        const formData = new FormData();
        formData.append('title', form.title); formData.append('description', form.description); formData.append('category', form.category);
        if (image) formData.append('image', image);
        setLoading(true);
        try {
            await api.post('/complaints/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Complaint submitted successfully! ✅');
            navigate('/my-complaints');
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit complaint'); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundImage: `url(${submitBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1a1a1a' }}>
            <Sidebar theme="ivory" />
            <main className="main-content" style={{ flex: 1, padding: '2rem 2.5rem', position: 'relative', zIndex: 1, overflowY: 'auto' }}>

                {/* HERO */}
                <div className="fade-in" style={{ ...card(), background: 'rgba(74,74,74,0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,227,0.18)', padding: '1.8rem 2.2rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,129,150,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', left: -40, bottom: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,227,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '0.55rem', background: 'linear-gradient(135deg, #4A4A4A, #6D8196)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(109,129,150,0.5)' }}>
                                <ClipboardList size={16} color={C.ivory} />
                            </div>
                            <span style={{ color: 'rgba(255,255,227,0.70)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Smart Campus · Submit Complaint</span>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: C.ivory, lineHeight: 1.2, marginBottom: '0.3rem' }}>
                            Report an <span style={{ background: 'linear-gradient(135deg, #CBCBCB, #FFFFE3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Issue</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,227,0.65)', fontSize: '0.85rem' }}>Fill in the details below and we'll get it resolved quickly.</p>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.1rem', borderRadius: '0.6rem', background: 'rgba(255,255,227,0.12)', border: '1px solid rgba(255,255,227,0.25)', color: C.ivory, fontSize: '0.82rem', fontWeight: 500 }}>
                        <PlusCircle size={14} /> New Complaint
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            {/* Title */}
                            <div className="fade-in" style={card({ padding: '1.6rem' })}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #4A4A4A, #6D8196)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(109,129,150,0.4)', flexShrink: 0 }}>
                                        <FileText size={18} color={C.ivory} />
                                    </div>
                                    <div>
                                        <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.1rem' }}>Issue Title</h3>
                                        <p style={{ color: C.gray1, fontSize: '0.76rem' }}>Provide a clear, descriptive title</p>
                                    </div>
                                </div>
                                <input name="title" type="text" value={form.title} onChange={handleChange} placeholder="e.g., Air conditioning not working in Lab 3" style={inputStyle} maxLength={150} required onFocus={focusOn} onBlur={focusOff} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                    <span style={{ color: C.gray1, fontSize: '0.72rem' }}>Be specific and clear</span>
                                    <span style={{ color: C.ivory, fontSize: '0.72rem', fontWeight: 600 }}>{form.title.length}/150</span>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="fade-in" style={card({ padding: '1.6rem' })}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #556677, #8fa3b5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(109,129,150,0.4)', flexShrink: 0 }}>
                                        <Tag size={18} color={C.ivory} />
                                    </div>
                                    <div>
                                        <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.1rem' }}>Category</h3>
                                        <p style={{ color: C.gray1, fontSize: '0.76rem' }}>Choose the most relevant category</p>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem' }}>
                                    {CATEGORIES.map((cat) => (
                                        <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })} style={{ padding: '0.5rem 0.4rem', borderRadius: '0.6rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: form.category === cat ? `1.5px solid ${C.slate}` : '1.5px solid rgba(203,203,203,0.25)', background: form.category === cat ? C.slate : 'rgba(255,255,227,0.08)', color: form.category === cat ? C.ivory : C.gray1, boxShadow: form.category === cat ? '0 4px 14px rgba(109,129,150,0.35)' : 'none' }}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="fade-in" style={card({ padding: '1.6rem' })}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #4A4A4A, #8fa3b5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(109,129,150,0.4)', flexShrink: 0 }}>
                                    <AlignLeft size={18} color={C.ivory} />
                                </div>
                                <div>
                                    <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.1rem' }}>Detailed Description</h3>
                                    <p style={{ color: C.gray1, fontSize: '0.76rem' }}>Provide comprehensive details about the issue</p>
                                </div>
                            </div>
                            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Include: exact location, when you noticed it, how it affects you, urgency level..." rows={5} style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }} required onFocus={focusOn} onBlur={focusOff} />
                            <p style={{ color: C.gray1, fontSize: '0.72rem', marginTop: '0.5rem' }}>More details help us resolve issues faster</p>
                        </div>

                        {/* Image Upload */}
                        <div className="fade-in" style={card({ padding: '1.6rem' })}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #2e2e2e, #6D8196)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(109,129,150,0.4)', flexShrink: 0 }}>
                                    <Upload size={18} color={C.ivory} />
                                </div>
                                <div>
                                    <h3 style={{ color: C.ivory, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.1rem' }}>Photo Attachment <span style={{ color: C.gray1, fontWeight: 400, fontSize: '0.78rem' }}>(optional)</span></h3>
                                    <p style={{ color: C.gray1, fontSize: '0.76rem' }}>Upload an image to help illustrate the issue</p>
                                </div>
                            </div>
                            {preview ? (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={preview} alt="Preview" style={{ height: 180, borderRadius: '0.85rem', border: '1px solid rgba(109,129,150,0.35)', objectFit: 'cover', display: 'block' }} />
                                    <button type="button" onClick={removeImage} style={{ position: 'absolute', top: -10, right: -10, width: 28, height: 28, borderRadius: '50%', background: C.charcoal, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ivory, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="complaint-image" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: 140, borderRadius: '0.85rem', border: '1.5px dashed rgba(203,203,203,0.28)', background: 'rgba(255,255,227,0.05)', cursor: 'pointer', gap: '0.6rem', transition: 'background 0.2s, border-color 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,129,150,0.15)'; e.currentTarget.style.borderColor = C.slate; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,227,0.05)'; e.currentTarget.style.borderColor = 'rgba(203,203,203,0.28)'; }}
                                >
                                    <Upload size={26} color={C.slateL} />
                                    <span style={{ color: C.ivory, fontSize: '0.85rem', fontWeight: 500 }}>Click to upload or drag & drop</span>
                                    <span style={{ color: C.gray1, fontSize: '0.72rem' }}>JPEG, PNG, GIF, WEBP · Max 5MB</span>
                                    <input id="complaint-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>

                        {/* Submit Row */}
                        <div className="fade-in" style={{ ...card({ background: 'rgba(74,74,74,0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,227,0.18)', padding: '1.4rem 1.6rem' }), display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gray1 }} />
                                <span style={{ color: C.gray1, fontSize: '0.82rem' }}>All fields except photo are required</span>
                            </div>
                            <button type="submit" disabled={loading} className="btn-gradient" style={{ padding: '0.72rem 2rem', fontSize: '0.9rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                                {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Submitting…</> : <><Send size={16} />Submit Complaint</>}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default SubmitComplaint;
