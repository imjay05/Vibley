import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "lucide-react";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <header className="bg-white backdrop-blur border-b border-gray-100 fixed w-full top-0 z-40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link 
             to="/" 
             className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <img 
              src="/logo_light.png" 
              alt="Vibley" 
              className="h-7 w-auto object-contain"
              onError={(e) => {
                                e.target.style.display = "none"; 
                                e.target.nextSibling.style.display = "block"; 
                                }} />
          <span 
              style={{ display: "none" }} 
              className="font-semibold text-lg tracking-tight">Vibley</span>
          <span className="font-semibold text-lg tracking-tight text-gray-900">Vibley</span>
        </Link>

        {authUser && (
          <Link 
              to="/vibes"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 
                         hover:text-purple-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50">
            <Sparkles className="size-4" />
            <span className="hidden sm:inline">Vibes</span>
            </Link>
          )}

        {authUser && (
          <Link 
            to="/profile"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 
            hover:text-purple-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-100">
            <User className="size-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        )}
      </div>
    </header>
  );
};


export default Navbar;