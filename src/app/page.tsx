export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        color: "#F5F5F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans, Arial, sans-serif)",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Grid background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(#2A2A2A 1px, transparent 1px), linear-gradient(90deg, #2A2A2A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />

      {/* Gold gradient bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #9A7E1F, #D4AF37, #F4D03F, #D4AF37, #9A7E1F)",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: "700px" }}>
        {/* Logo mark */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #D4AF37, #9A7E1F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            fontSize: "2rem",
            fontWeight: 700,
            color: "#0A0A0A",
            boxShadow: "0 0 40px rgba(212,175,55,0.3)",
          }}
        >
          S
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#D4AF37",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
            lineHeight: 1.1,
          }}
        >
          SaintSal Growth Command
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "1rem",
            color: "#8A8A85",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
          }}
        >
          Responsible Intelligence · HACP™ US Patent #10,290,222
        </p>

        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            backgroundColor: "#141414",
            border: "1px solid #2A2A2A",
            borderRadius: "9999px",
            padding: "0.5rem 1.25rem",
            marginBottom: "3rem",
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              display: "inline-block",
              boxShadow: "0 0 8px #22c55e",
            }}
          />
          <span style={{ color: "#F5F5F0", fontSize: "0.875rem", fontWeight: 500 }}>
            SAL · 11 agents online
          </span>
        </div>

        {/* Info cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          {[
            { label: "Platform", value: "Growth Command v0" },
            { label: "Status", value: "Pre-flight" },
            { label: "Build", value: "Day 1 · Phase 1" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: "#141414",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#8A8A85", fontSize: "0.75rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {item.label}
              </div>
              <div style={{ color: "#D4AF37", fontWeight: 600, fontSize: "0.875rem" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Responsible Intelligence banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "8px",
            padding: "1.25rem 2rem",
            color: "#D4AF37",
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          RESPONSIBLE INTELLIGENCE · Configurable safeguards as enablers, not blockers
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 2rem",
          fontSize: "0.75rem",
          color: "#8A8A85",
        }}
      >
        <span>Saint Vision Technologies LLC</span>
        <span style={{ color: "#D4AF37" }}>HACP™ US Patent #10,290,222</span>
        <span>v0 · Pre-flight</span>
      </footer>
    </main>
  );
}
