import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const NoChatSelected = () => {
  const { theme } = useThemeStore();

  const isDark = theme === "dark";
  const logoSrc = isDark ? "/logo_dark.png" : "/logo_light.png";
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">

        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce">
          {!imgError ? (
            <img
              src={logoSrc}
              alt="Vibley"
              className="h-12 w-auto object-contain"
              onError={() => setImgError(true)}/>
          ) : (
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">V</span>
            </div>
          )}
          </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Vibley!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;