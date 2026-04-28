import { useChatStore } from "../store/useChatStore";
import { Check, X } from "lucide-react";

const FriendRequestsModal = () => {
  const { friendRequests, handleRequest } = useChatStore();

  return (
    <div className="p-5 bg-white rounded-2xl w-full animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Friend Requests</h2>
        <form method="dialog">
          <button className="size-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="size-4" />
          </button>
        </form>
      </div>

      {friendRequests.length === 0
        ? <p className="text-center text-gray-400 text-sm py-8">No pending requests</p>
        : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {friendRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between bg-gray-50 px-3 py-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={req.from.profilePic || "/avatar.png"} className="size-10 rounded-full object-cover" alt="" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{req.from.fullName}</p>
                    <p className="text-xs text-gray-400">{req.from.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRequest(req.from._id, "accept")}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                    <Check className="size-3.5" /> Accept
                  </button>
                  <button onClick={() => handleRequest(req.from._id, "reject")}
                    className="size-7 flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default FriendRequestsModal;