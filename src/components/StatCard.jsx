const StatCard = ({ label, value, icon: Icon, gradient, glow }) => (
    <div
        className="stat-card"
        style={{
            background: 'rgba(30,18,8,0.90)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(200,146,42,0.22)',
            borderRadius: '1.1rem',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        {/* top accent bar */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 3,
            background: gradient || 'linear-gradient(135deg,#c8922a,#f5c842)',
            borderRadius: '1.1rem 1.1rem 0 0',
        }} />

        <div style={{
            width: 50, height: 50, borderRadius: '0.85rem', flexShrink: 0,
            background: gradient || 'linear-gradient(135deg,#c8922a,#f5c842)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: glow || '0 6px 18px rgba(200,146,42,0.4)',
        }}>
            <Icon size={24} color="#1c1008" />
        </div>

        <div>
            <p style={{ color: '#8a6840', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
            </p>
            <p style={{ color: '#fef3c7', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.1, marginTop: '0.1rem' }}>
                {value ?? 0}
            </p>
        </div>
    </div>
);

export default StatCard;
