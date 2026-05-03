import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import AddContactModal from "../../components/contact/AddContactModal";
import FriendRequestsModal from "../../components/contact/FriendRequestsModal";
import Sidebar from "../../components/Sidebar";
import NoChatSelected from "../../components/chat/NoChatSelected";
import ChatContainer from "../../components/chat/ChatContainer";
import "./HomePage.css";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  // Always show NoChatSelected on every visit / login
  useEffect(() => {
    setSelectedUser(null);
  }, []);

  return (
    <div className="home-page">
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

      <div className="home-center">
        <div className="home-panel">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;