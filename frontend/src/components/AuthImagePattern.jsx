import { useEffect, useState } from "react";

const TAGLINES = [
  "Where real conversations happen.",
  "Stay close, no matter the distance.",
  "Your people. Your moments. Always.",
  "Less noise. More connection.",
];

const AuthImagePattern = ({ title, subtitle }) => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTaglineIndex((i) => (i + 1) % TAGLINES.length);
        setFade(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #0c1a2e 100%)",
      }}
    >
      {/* Animated mesh blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "10%", left: "15%",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
          animation: "blob1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "10%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          animation: "blob2 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "55%", left: "5%",
          width: "200px", height: "200px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
          animation: "blob3 12s ease-in-out infinite",
        }} />
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: "3px", height: "3px", borderRadius: "50%",
            background: "rgba(148,163,184,0.25)",
            top: `${10 + (i % 6) * 16}%`,
            left: `${8 + Math.floor(i / 6) * 25}%`,
            animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.2) % 2}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 20px) scale(1.04); }
          66% { transform: translate(20px, -15px) scale(0.96); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -25px) scale(1.06); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.6); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-tagline-visible {
          opacity: 1; transform: translateY(0);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .auth-tagline-hidden {
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
      `}</style>

      <div className="relative z-10 max-w-md px-10 text-center" style={{ animation: "fadeInUp 0.8s ease both" }}>
        {/* Logo mark */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px", margin: "0 auto 2rem",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>
          <img src="/white_logo.png" alt="Vibley"
            style={{ width: "52px", height: "52px", objectFit: "contain", filter: "brightness(1.3)" }}
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
          />
          <span style={{ display: "none", color: "white", fontWeight: 800, fontSize: "28px" }}>V</span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: "2rem", fontWeight: 700, color: "white",
          letterSpacing: "-0.02em", marginBottom: "0.75rem",
          textShadow: "0 2px 20px rgba(0,0,0,0.4)",
        }}>
          {title}
        </h2>

        {/* Subtitle */}
        <p style={{ color: "rgba(148,163,184,0.85)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          {subtitle}
        </p>

        {/* Gradient divider */}
        <div style={{
          height: "1px", margin: "0 auto 2rem",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }} />

        {/* Rotating tagline */}
        <div style={{ minHeight: "2rem" }}>
          <p className={fade ? "auth-tagline-visible" : "auth-tagline-hidden"}
            style={{ color: "rgba(186,230,253,0.75)", fontSize: "0.875rem", fontStyle: "italic", letterSpacing: "0.01em" }}>
            "{TAGLINES[taglineIndex]}"
          </p>
        </div>

        {/* Wordmark */}
        <p style={{
          marginTop: "3rem", color: "rgba(100,116,139,0.6)",
          fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          Vibley — Stay connected, always
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;