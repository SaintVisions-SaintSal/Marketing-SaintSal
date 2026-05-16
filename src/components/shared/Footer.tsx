export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid #2A2A2A',
        padding: '12px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          color: '#8A8A85',
          fontSize: '11px',
          letterSpacing: '0.03em',
        }}
      >
        v0.1 · Growth Command
      </div>

      <div
        style={{
          textAlign: 'center',
          color: '#D4AF37',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Responsible Intelligence · HACP™
      </div>

      <div
        style={{
          textAlign: 'right',
          color: '#8A8A85',
          fontSize: '11px',
          letterSpacing: '0.03em',
        }}
      >
        US Patent #10,290,222
      </div>
    </footer>
  )
}
