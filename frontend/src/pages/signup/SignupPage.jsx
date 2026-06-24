import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./SignupPage.css";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const validate = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Min 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() === true) signup(formData);
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <img src="/logo_light.png" alt="Vibley" className="signup-logo" />
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">Join Vibley</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-field">
            <label>Full name</label>
            <div className="signup-input-wrap">
              <User className="signup-input-icon" />
              <input
                type="text"
                className="signup-input"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}/>
            </div>
          </div>

          <div className="signup-field">
            <label>Email</label>
            <div className="signup-input-wrap">
              <Mail className="signup-input-icon" />
              <input
                type="email"
                className="signup-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            </div>
          </div>

          <div className="signup-field">
            <label>Password</label>
            <div className="signup-input-wrap">
              <Lock className="signup-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="signup-input signup-input--password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              <button
                type="button"
                className="signup-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="signup-submit-btn" disabled={isSigningUp}>
            {isSigningUp ? (
              <><Loader2 className="signup-spinner" /> Creating…</>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="signup-footer-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;