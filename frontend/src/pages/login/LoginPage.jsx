import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import "./LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo_light.png" alt="Vibley" className="login-logo" />
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Email</label>
            <div className="login-input-wrap">
              <Mail className="login-input-icon" />
              <input
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            </div>
          </div>

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
            {isLoggingIn ? (
              <><Loader2 className="login-spinner" /> Signing in…</>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="login-footer-link">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;