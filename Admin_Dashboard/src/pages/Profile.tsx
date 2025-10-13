import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  const [profileImage, setProfileImage] = useState<string>(
    user?.profilePic || "https://via.placeholder.com/150"
  );
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  console.log("USER:", user); // 👈 To check actual structure

  // ✅ Convert image to Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
        setProfileImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save updated image
  const handleSave = async () => {
    if (!fileBase64) {
      toast.error("Please select your profile picture");
      return; // ❌ Don't call API with empty data
    }

    try {
      await updateProfile(fileBase64, user._id); // ✅ use user._id (not user.user)
    } catch (err) {
      console.error("❌ Failed to update profile", err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Your Profile</h1>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Save Changes
        </button>
      </div>

      {/* Profile Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (Profile Image) */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
            <label className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Right Column (Form Fields) */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={user?.name || ""}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
