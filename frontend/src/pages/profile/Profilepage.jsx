import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, Mail, User, LogOut } from "lucide-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setSelectedImg(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
  };

  return (
    <div className="profile-page min-h-screen pt-20 pb-10 animate-fade-up">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="profile-card-header h-24" />

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end gap-4 -mt-12 mb-6">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-24 rounded-2xl object-cover border-4 border-white shadow-md"/>
                <label
                  htmlFor="avatar-upload"
                  className={
                    `absolute -bottom-1 -right-1 bg-blue-600 
                    hover:bg-blue-700 p-1.5 rounded-lg cursor-pointer 
                    transition-colors shadow ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`
                    }>
                  <Camera className="size-3.5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div>
                <h2 className="text-lg font-semibold">{authUser.fullName}</h2>
                <p className="text-sm text-gray-500">{authUser.email}</p>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-3 mb-6">
              {[
                { icon: User, label: "Full name", value: authUser.fullName },
                { icon: Mail, label: "Email",     value: authUser.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="size-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="size-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Account info */}
            <div 
            className="border-t border-gray-100 pt-4 mb-4 flex 
                       items-center justify-between text-sm text-gray-500">
              <span>Member since {authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "—"}</span>
              <span className="text-green-500 font-medium">● Active</span>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 
              py-2.5 rounded-xl border border-red-200 
              text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;