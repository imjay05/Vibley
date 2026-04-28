import { useEffect } from "react";
import { X, Sparkles, Send, RefreshCw } from "lucide-react";
import { useVibeStore } from "../store/useVibeStore";

const AddVibeModal = ({ onClose }) => {
  const { memeOptions, isGenerating, isPosting, generateMemes, postVibe } = useVibeStore();

  const meme = memeOptions[0] ?? null;

  // Auto-generate a random meme when modal opens
  useEffect(() => {
    generateMemes();
  }, []);

  const handlePost = async () => {
    if (!meme) return;
    const ok = await postVibe({
      moodText: meme.caption,
      templateId: meme.templateId,
      topText: meme.topText,
      bottomText: meme.bottomText,
      caption: meme.caption,
      imageUrl: meme.imageUrl,
    });
    if (ok) onClose();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
          <Sparkles className="size-4 text-purple-500" /> Your vibe today
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
          <X className="size-4 text-gray-500" />
        </button>
      </div>

      {/* Meme preview */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 min-h-48 flex items-center justify-center">
        {isGenerating || !meme ? (
          <span className="loading loading-spinner loading-md text-purple-500" />
        ) : (
          <>
            <img
              src={meme.imageUrl}
              alt={meme.caption}
              className="w-full object-contain max-h-64"
            />
            {meme.topText && (
              <div className="absolute top-2 inset-x-2 text-center">
                <p className="text-white text-sm font-extrabold drop-shadow">{meme.topText}</p>
              </div>
            )}
            {meme.bottomText && (
              <div className="absolute bottom-10 inset-x-2 text-center">
                <p className="text-white text-sm font-extrabold drop-shadow">{meme.bottomText}</p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-1.5">
              <p className="text-white text-xs text-center font-medium">{meme.caption}</p>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => generateMemes()}
          disabled={isGenerating || isPosting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 rounded-xl text-sm text-gray-600 transition-colors"
        >
          <RefreshCw className={`size-4 ${isGenerating ? "animate-spin" : ""}`} />
          Nah, next one
        </button>
        <button
          onClick={handlePost}
          disabled={!meme || isGenerating || isPosting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {isPosting ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Send className="size-4" />
          )}
          This is my vibe
        </button>
      </div>
    </div>
  );
};

export default AddVibeModal;