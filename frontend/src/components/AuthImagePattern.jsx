const AuthImagePattern = ({ title, subtitle }) => {
  const features = [
    { icon: "💬", label: "Real-time messaging" },
    { icon: "👥", label: "Friend requests" },
    { icon: "🔔", label: "Instant notifications" },
    { icon: "🌙", label: "Dark & light themes" },
    { icon: "📸", label: "Profile photos" },
    { icon: "🔒", label: "Secure & private" },
  ];

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #1a56db 0%, #1e3a8a 60%, #172554 100%)" }}>
      {/* Subtle decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}/>
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}/>

      <div className="max-w-md text-center relative z-10">
        {/* Brand icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)", 
            border: "1px solid rgba(255, 255, 255, 0.2)", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            overflow: "hidden"
          }}>
            <img src="/white_logo.png" alt="logo"
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              mixBlendMode: "screen",
              filter: "brightness(1.2)",
              }}/>
        </div>

        <h2 className="text-3xl font-bold mb-3 text-white">{title}</h2>
        <p className="text-white/70 text-base mb-10 leading-relaxed">{subtitle}</p>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            textAlign: "left",
          }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(6px)",
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}>
              <span style={{ fontSize: "18px" }}>{f.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", fontWeight: 500 }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: "32px",
            color: "rgba(255,255,255,0.45)",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
          Vibley — Stay connected, always
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;