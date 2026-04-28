import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 animate-fade-up">
        <div className="w-full max-w-md space-y-7">
          <div className="text-center">
            <img src="/logo_light.png" alt="Vibley" className="h-10 mx-auto mb-4 object-contain"
              onError={(e) => { e.target.style.display = "none"; }} />
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Join Vibley</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full name", key: "fullName", type: "text", icon: User, placeholder: "John Doe" },
              { label: "Email",     key: "email",    type: "email", icon: Mail, placeholder: "you@example.com" },
            ].map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input type={type}
                    className="input input-bordered w-full pl-10 h-11 text-sm focus:border-blue-400 focus:outline-none"
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} />
                </div>
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 h-11 text-sm focus:border-blue-400 focus:outline-none"
                  placeholder="Min. 6 characters"
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
              className="w-full h-11 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#2563eb,#1e40af)" }}
              disabled={isSigningUp}>
              {isSigningUp ? <><Loader2 className="size-4 animate-spin" /> Creating…</> : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <AuthImagePattern title="Join our community" subtitle="Connect with friends, share moments, and stay in touch with your loved ones." />
    </div>
  );
};

export default SignUpPage;