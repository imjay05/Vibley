import { useEffect, useState } from "react";

const TAGLINES = [
  "Where real conversations happen.",
  "Stay close, no matter the distance.",
  "Your people. Your moments. Always.",
  "Less noise. More connection.",
];

const AuthImagePattern = ({ title, subtitle }) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx((i) => (i + 1) % TAGLINES.length); setVisible(true); }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #eff6ff 0%, #dbeafe 40%, #bfdbfe 75%, #93c5fd 100%)",
      }}
    >
      {/* Soft blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "8%",  left: "10%", size: 340, color: "rgba(255,255,255,0.55)" },
          { top: "50%", right: "5%", size: 280, color: "rgba(59,130,246,0.12)"  },
          { bottom: "10%", left: "20%", size: 220, color: "rgba(255,255,255,0.4)" },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            width: b.size, height: b.size,
            top: b.top, left: b.left, bottom: b.bottom, right: b.right,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            animation: `blob${i+1} ${9 + i*2}s ease-in-out infinite`,
          }} />
        ))}

        {/* Dot grid */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: 4, height: 4, borderRadius: "50%",
            background: "rgba(59,130,246,0.2)",
            top:  `${8  + (i % 6) * 16}%`,
            left: `${6  + Math.floor(i / 6) * 25}%`,
            animation: `dotpulse ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.15) % 2}s`,
          }} />
        ))}

        {/* Decorative rings */}
        <div style={{
          position: "absolute", bottom: "-60px", right: "-60px",
          width: 320, height: 320, borderRadius: "50%",
          border: "1.5px solid rgba(59,130,246,0.15)",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", right: "-30px",
          width: 220, height: 220, borderRadius: "50%",
          border: "1.5px solid rgba(59,130,246,0.12)",
        }} />
        <div style={{
          position: "absolute", top: "-50px", left: "-50px",
          width: 260, height: 260, borderRadius: "50%",
          border: "1.5px solid rgba(147,197,253,0.3)",
        }} />
      </div>

      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(24px,-16px) scale(1.04)} 66%{transform:translate(-16px,12px) scale(0.97)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-20px,16px) scale(1.03)} 66%{transform:translate(16px,-10px) scale(0.96)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(12px,-20px) scale(1.05)} }
        @keyframes dotpulse { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.6;transform:scale(1.5)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="relative z-10 max-w-sm px-10 text-center" style={{ animation: "fadeUp 0.6s ease both" }}>
        {/* Logo badge */}
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: "0 auto 2rem",
          background: "white",
          border: "1px solid rgba(59,130,246,0.2)",
          boxShadow: "0 8px 32px rgba(59,130,246,0.15), 0 2px 8px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src="/logo_light.png" alt="Vibley"
            style={{ width: 50, height: 50, objectFit: "contain" }}
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
          <span style={{ display: "none", color: "#2563eb", fontWeight: 800, fontSize: 28 }}>V</span>
        </div>

        <h2 style={{
          fontSize: "1.9rem", fontWeight: 700,
          color: "#1e3a5f",
          letterSpacing: "-0.025em", marginBottom: "0.65rem",
        }}>
          {title}
        </h2>

        <p style={{ color: "#4b6fa8", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          {subtitle}
        </p>

        {/* Divider */}
        <div style={{
          height: 1, margin: "0 auto 1.75rem",
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)",
        }} />

        {/* Rotating tagline */}
        <p style={{
          color: "#2563eb",
          fontSize: "0.875rem",
          fontStyle: "italic",
          fontWeight: 500,
          transition: "opacity 0.35s ease, transform 0.35s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(5px)",
        }}>
          "{TAGLINES[idx]}"
        </p>

        <p style={{
          marginTop: "2.75rem",
          color: "rgba(59,130,246,0.45)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}>
          Vibley — Stay connected, always
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;