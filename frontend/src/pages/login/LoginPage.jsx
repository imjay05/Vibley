import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import "./LoginPage.css";

const LOGIN_TAGLINES = [
  "Where real conversations happen.",
  "Less noise. More connection.",
  "Stay close, no matter the distance.",
];

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  const [tagIdx, setTagIdx] = useState(0);
  const [tagVisible, setTagVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTagVisible(false);
      setTimeout(() => {
        setTagIdx((i) => (i + 1) % LOGIN_TAGLINES.length);
        setTagVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="login-page">
      {/* Decorative blobs */}
      <div className="login-bg-blobs">
        <div className="login-blob-1" />
        <div className="login-blob-2" />
        <div className="login-blob-3" />
        <div className="login-blob-4" />
        <div className="login-grid" />
      </div>

      {/* Taglines — top center */}
      <div className="login-tagline-wrap">
        <div className="login-wave-bars">
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((d, i) => (
            <div
              key={i}
              className={`login-wave-bar ${i % 2 === 0 ? "login-wave-bar--light" : "login-wave-bar--accent"}`}
              style={{ animationDelay: `${d}s` }}/>
          ))}
        </div>
        <p className={`tag-text ${tagVisible ? "visible-tag" : "hidden-tag"}`}>
          "{LOGIN_TAGLINES[tagIdx]}"
        </p>
      </div>

      {/* Branding top-left */}
      <div className="login-brand">
        <div className="login-brand-dots">
          {[0, 0.3, 0.6].map((d, i) => (
            <div 
            key={i} 
            className="login-brand-dot" 
            style={{ animationDelay: `${d}s` }} />
          ))}
        </div>
        <span className="login-brand-name">Vibley</span>
      </div>

      {/* White card */}
      <div className="login-card">
        <div className="login-card-bar" />

        {/* Header */}
        <div className="login-header">
          <img 
          src="/logo_light.png" 
          alt="Vibley" 
          className="login-logo" />
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <div className="login-field">
            <label>Email</label>
            <div className="login-input-wrap">
              <Mail className="login-input-icon" />
              <input
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <Lock className="login-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="login-input login-input--password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              <button
                type="button"
                className="login-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoggingIn}>
            {isLoggingIn
                         ? <><Loader2 className="login-spinner" /> Signing in…</>
                         : "Sign in"
            }
          </button>
        </form>

        <p className="login-footer-link">
          No account?{" "}
          <Link to="/signup">Create Account</Link>
        </p>
      </div>

      {/* Bottom tagline strip */}
      <div className="login-bottom-strip">
        <p>Vibley · Stay connected, always</p>
      </div>
    </div>
  );
};


export default LoginPage;