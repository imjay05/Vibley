import { useChatStore } from "../store/useChatStore";
import { Check, X } from "lucide-react";

const FriendRequestsModal = () => {
  const { friendRequests, handleRequest } = useChatStore();

  return (
    <div className="p-6 bg-base-100 rounded-lg w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Friend Requests</h2>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>

      {friendRequests.length === 0 ? (
        <p className="text-center text-base-content/50 py-8">No pending requests</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {friendRequests.map((req) => (
            <div
              key={req._id}
              className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={req.from.profilePic || "/avatar.png"}
                  className="size-10 rounded-full object-cover"
                  alt={req.from.fullName}
                />
                <div>
                  <p className="font-medium text-sm">{req.from.fullName}</p>
                  <p className="text-xs text-base-content/50">{req.from.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRequest(req.from._id, "accept")}
                  className="btn btn-sm btn-success"
                >
                  <Check size={16} /> Accept
                </button>
                <button
                  onClick={() => handleRequest(req.from._id, "reject")}
                  className="btn btn-sm btn-error btn-outline"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsModal;