import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import AddContactModal from "../components/AddContactModal";
import FriendRequestsModal from "../components/FriendRequestsModal";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  // Always show NoChatSelected on every visit / login
  useEffect(() => {
    setSelectedUser(null);
  }, []);

  return (
    <div className="h-screen bg-red-50 pt-14">
      <dialog id="add_contact_modal" className="modal">
        <div className="modal-box p-0 max-w-sm rounded-2xl overflow-hidden">
          <AddContactModal />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="friend_requests_modal" className="modal">
        <div className="modal-box p-0 max-w-sm rounded-2xl overflow-hidden">
          <FriendRequestsModal />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-8xl h-[calc(100vh-6rem)] flex overflow-hidden">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;