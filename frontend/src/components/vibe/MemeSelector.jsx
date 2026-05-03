import { useState } from "react";
import { RefreshCw } from "lucide-react";


const MemeSelector = ({ memeOptions, onSelect, onRegenerate, isGenerating }) => {
const [picked, setPicked] = useState(null);
const getMemePreview = (opt) => {
  return `https://i.imgflip.com/${opt.templateId}.jpg`;
};

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Pick your vibe meme:</p>
      <div className="grid grid-cols-3 gap-2">
        {memeOptions?.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setPicked(i); onSelect(i); }}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              picked === i ? "border-blue-500 scale-[1.03]" : "border-gray-200 hover:border-blue-300"
            }`}>
            <div className="relative w-full aspect-square overflow-hidden">
              <img
              src={getMemePreview(opt)}
              alt={opt.caption}
              className="w-full h-full object-cover"/>
              {/* TOP TEXT */}
              <div className="absolute top-1 left-1 right-1 px-1 text-white text-[11px] 
                   font-extrabold text-center leading-tight drop-shadow">
                    {opt.topText || ""}
              </div>
              
              {/* BOTTOM TEXT */}
              <div className="absolute bottom-8 left-1 right-1 px-1 text-white text-[11px] 
                   font-extrabold text-center leading-tight drop-shadow">
                    {opt.bottomText || ""}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1">
              <p className="text-white text-[10px] leading-tight text-center">
                {opt.caption}
              </p>
            </div>
            {picked === i && (
              <div className="absolute top-1 right-1 size-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="size-2.5 text-white" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor">
                  <path strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={() => { setPicked(null); onRegenerate(); }}
        disabled={isGenerating}
        className="flex items-center gap-1.5 text-sm text-gray-500 
        hover:text-blue-600 transition-colors mx-auto disabled:opacity-40">
        <RefreshCw className={`size-3.5 ${isGenerating ? "animate-spin" : ""}`} />
        Regenerate options
      </button>
    </div>
  );
};


export default MemeSelector;