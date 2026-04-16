import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Search, UserPlus, Check, X } from "lucide-react";
import styles from "./AddContactModal.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Add Contacts</h2>
        {/* Close button for the dialog */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </div>

      {/* Search Input */}
      <div className={styles.searchRow}>
        <input
          type="text"
          placeholder="Search by name..."
          className={`input input-bordered ${styles.searchInput}`}
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
        <div className={styles.section}>
          <h3 className={styles.sectionLabel}>
            Pending Requests ({friendRequests.length})
          </h3>
          <div className={styles.requestList}>
            {friendRequests.map((req) => (
              <div key={req._id} className={styles.requestItem}>
                <div className={styles.requestUser}>
                  <img
                    src={req.from.profilePic || "/avatar.png"}
                    className={styles.requestAvatar}
                    alt={req.from.fullName}
                  />
                  <span className={styles.requestName}>{req.from.fullName}</span>
                </div>
                <div className={styles.requestActions}>
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
        <h3 className={styles.sectionLabel}>Search Results</h3>
        {searchResults.length === 0 ? (
          <p className={styles.emptyState}>
            Search for people to add as contacts
          </p>
        ) : (
          <div className={styles.resultList}>
            {searchResults.map((user) => (
              <div key={user._id} className={styles.resultItem}>
                <div className={styles.resultUser}>
                  <img
                    src={user.profilePic || "/avatar.png"}
                    className={styles.resultAvatar}
                    alt={user.fullName}
                  />
                  <span className={styles.resultName}>{user.fullName}</span>
                </div>
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="btn btn-ghost btn-sm text-primary tooltip"
                  data-tip="Send friend request"
                >
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