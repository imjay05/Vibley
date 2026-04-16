import { useChatStore } from "../store/useChatStore";
import AddContactModal from "../components/AddContactModal";
import FriendRequestsModal from "../components/FriendRequestsModal"; // ✅ new
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">

      {/* Add Contact Modal */}
      <dialog id="add_contact_modal" className="modal">
        <div className="modal-box p-0">
          <AddContactModal />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* ✅ Friend Requests Modal */}
      <dialog id="friend_requests_modal" className="modal">
        <div className="modal-box p-0">
          <FriendRequestsModal />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;