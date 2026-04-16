import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Search, UserPlus, Check, X } from "lucide-react";

const AddContactModal = () => {
  const [query, setQuery] = useState("");
  const {
    searchUsers,
    searchResults,
    sendFriendRequest,
    friendRequests,
    handleRequest,
  } = useChatStore();

  const handleSearch = () => {
    if (query.trim()) searchUsers(query.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Add Contacts</h2>
        {/* Close button for the dialog */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          <Search size={20} />
        </button>
      </div>

      {/* Pending Requests Section */}
      {friendRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold opacity-70 mb-2">
            Pending Requests ({friendRequests.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {friendRequests.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={req.from.profilePic || "/avatar.png"}
                    className="size-8 rounded-full object-cover"
                    alt={req.from.fullName}
                  />
                  <span className="text-sm font-medium">{req.from.fullName}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleRequest(req.from._id, "accept")}
                    className="btn btn-xs btn-success"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => handleRequest(req.from._id, "reject")}
                    className="btn btn-xs btn-error"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        <h3 className="text-sm font-semibold opacity-70 mb-2">Search Results</h3>
        {searchResults.length === 0 ? (
          <p className="text-sm text-base-content/50 text-center py-4">
            Search for people to add as contacts
          </p>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-1">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 hover:bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    className="size-10 rounded-full object-cover"
                    alt={user.fullName}/>
                  <span className="font-medium text-sm">{user.fullName}</span>
                </div>
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="btn btn-ghost btn-sm text-primary tooltip"
                  data-tip="Send friend request">
                  <UserPlus size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContactModal;