import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();
  const { theme } = useThemeStore();

  const darkThemes = ["dark"];
  const isDark = darkThemes.includes(theme);
  const logoSrc = isDark ? "/logo_dark.png" : "/logo_light.png";

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7">

          {/* Logo */}
          <div className="text-center mb-2">
            <div className="flex flex-col items-center gap-3">
              <img
                src={logoSrc}
                alt="Vibley"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}/>
              {/* Fallback */}
              <div
                className="w-12 h-12 rounded-2xl bg-blue-100 items-center justify-center"
                style={{ display: "none" }}>
                <span className="text-blue-600 font-bold text-2xl">V</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold mt-1">Create your account</h1>
                <p className="text-base-content/50 text-sm mt-1">Join Vibley</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium text-sm">Full name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="size-4 text-base-content/35" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 h-11 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}/>
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium text-sm">Email address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="size-4 text-base-content/35" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 h-11 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-medium text-sm">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="size-4 text-base-content/35" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 h-11 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/35 hover:text-base-content/60 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-full h-11 text-white font-semibold border-none text-sm mt-1"
              style={{ background: "linear-gradient(135deg, #1a56db 0%, #1e40af 100%)" }}
              disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/50 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;