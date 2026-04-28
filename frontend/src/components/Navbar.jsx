import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { User, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const isDark = theme === "dark";
  const logoSrc = isDark ? "/logo_dark.png" : "/logo_light.png";

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <img
              src={logoSrc}
              alt="Vibley"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="size-9 rounded-lg bg-primary/10 items-center justify-center"
              style={{ display: "none" }}>
              <span className="text-primary font-bold text-lg">V</span>
            </div>
            <h1 className="text-lg font-bold">Vibley</h1>
          </Link>

          <div className="flex items-center gap-2">
            {/* Light / Dark toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-sm btn-ghost btn-circle"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {authUser && (
              <Link to="/profile" className="btn btn-sm gap-2">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;