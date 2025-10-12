import React, { useState } from "react";

const ProfilePage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>(
    "https://via.placeholder.com/150"
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Your Profile</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
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
                value="Admin"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value="Administrator"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                value="Ingeniux"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Work Phone</label>
              <input
                type="text"
                value="(509)-123-4567"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Mobile Phone</label>
              <input
                type="text"
                value="(509)-123-4567"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value="admin@ingeniux.com"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
