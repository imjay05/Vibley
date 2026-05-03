import { useEffect, useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { useVibeStore } from "../../store/useVibeStore"; 
import VibeCard from "../../components/vibe/VibeCard";
import AddVibeModal from "../../components/vibe/AddVibeModal";
import { useAuthStore } from "../../store/useAuthStore";
import "./VibePage.css";

const VibePage = () => {
  const { friendVibes, myVibe, isLoading, fetchVibes } = useVibeStore();
  const { authUser } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchVibes(); }, []);

  return (
    <div className="vibe-page">
      <div className="h-full flex items-center justify-center p-4">
        <div className="vibe-panel bg-white/95 backdrop-blur-lg rounded-2xl 
             w-full max-w-8xl h-[calc(100vh-6rem)] overflow-y-auto border border-white/30">
          {/* ↑ white card starts here — everything below is INSIDE it */}
          <div className="max-w-5xl mx-auto px-4 pt-6 pb-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-purple-600" />
                <h1 className="text-lg font-semibold text-gray-900">Vibes</h1>
              </div>
              {!myVibe && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 
                  hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors">
                  <Plus className="size-3.5" /> Add vibe
                </button>
              )}
            </div>

            {/* My vibe */}
            {myVibe && (
              <div className="mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <VibeCard vibe={myVibe} isMine={true} />
                </div>
              </div>
            )}

            {/* Friends' vibes */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-64 skeleton" />
                ))}
              </div>
            ) : friendVibes.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="size-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No friend vibes yet today</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friendVibes.map((v) => (
                  <div key={v._id}>
                    <VibeCard vibe={v} isMine={v.userId?._id === authUser._id} />
                  </div>
                ))}
              </div>
            )}

          </div>
          {/* ↑ inner padding div ends */}
        </div>
        {/* ↑ white card ends */}
      </div>
      {/* ↑ centering wrapper ends */}

      {/* Add vibe modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 w-full sm:w-96 bg-white rounded-t-2xl sm:rounded-2xl shadow-xl">
            <AddVibeModal onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VibePage;