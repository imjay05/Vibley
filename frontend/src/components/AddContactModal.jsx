import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Search, UserPlus, Check, X } from "lucide-react";

const AddContactModal = () => {
  const [query, setQuery] = useState("");
  const { searchUsers, searchResults, sendFriendRequest, friendRequests, handleRequest } = useChatStore();

  const handleSearch = () => { if (query.trim()) searchUsers(query.trim()); };

  return (
    <div className="p-5 bg-white rounded-2xl w-full animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Add Contacts</h2>
        <form method="dialog">
          <button className="size-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="size-4" />
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-5">
        <input type="text" placeholder="Search by name…"
          className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-gray-50 transition-colors placeholder:text-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        <button onClick={handleSearch}
          className="size-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors">
          <Search className="size-4 text-white" />
        </button>
      </div>

      {/* Pending requests */}
      {friendRequests.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Pending ({friendRequests.length})
          </p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {friendRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <img src={req.from.profilePic || "/avatar.png"} className="size-8 rounded-full object-cover" alt="" />
                  <span className="text-sm font-medium">{req.from.fullName}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleRequest(req.from._id, "accept")}
                    className="size-7 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                    <Check className="size-3.5 text-white" />
                  </button>
                  <button onClick={() => handleRequest(req.from._id, "reject")}
                    className="size-7 bg-gray-200 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                    <X className="size-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Results</p>
        {searchResults.length === 0
          ? <p className="text-sm text-gray-400 text-center py-6">Search for people to add</p>
          : (
            <div className="max-h-52 overflow-y-auto space-y-1">
              {searchResults.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={user.profilePic || "/avatar.png"} className="size-9 rounded-full object-cover" alt="" />
                    <span className="text-sm font-medium text-gray-800">{user.fullName}</span>
                  </div>
                  <button onClick={() => sendFriendRequest(user._id)}
                    className="size-8 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors"
                    title="Send friend request">
                    <UserPlus className="size-4 text-blue-600" />
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default AddContactModal;