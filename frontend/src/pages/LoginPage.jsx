import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 animate-fade-up">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img src="/logo_light.png" alt="Vibley" className="h-10 mx-auto mb-4 object-contain"
              onError={(e) => { e.target.style.display = "none"; }} />
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input type="email"
                  className="input input-bordered w-full pl-10 h-11 text-sm focus:border-blue-400 focus:outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 h-11 text-sm focus:border-blue-400 focus:outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full h-11 rounded-lg text-white font-medium text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#2563eb,#1e40af)" }}
              disabled={isLoggingIn}>
              {isLoggingIn ? <><Loader2 className="size-4 animate-spin" /> Signing in…</> : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            No account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">Create Account</Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <AuthImagePattern title="Welcome back!" subtitle="Sign in to continue your conversations and catch up with your messages." />
    </div>
  );
};

export default LoginPage;