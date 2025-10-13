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

  const [formData, setFormData] = useState({
    degn: user?.degn || "",
    empType: user?.empType || "",
    phone: user?.phone || "",
    location: user?.location || "",
    skills: user?.skills?.join(", ") || "",
    assignedProject: user?.assignedProject || "",
    status: user?.status || "Active",
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

            <div>
              <label className="text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="degn"
                value={user?.degn}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Employee Type</label>
              <select
                name="empType"
                value={formData.empType}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="">Select Type</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                value={user?.empID || ""}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
                readOnly
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700">Joining Date</label>
              <input
                type="text"
                value={
                  user?.joiningDate
                    ? new Date(user.joiningDate).toLocaleDateString()
                    : ""
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
                readOnly
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700">
                Assigned Project
              </label>
              <input
                type="text"
                name="assignedProject"
                value={formData.assignedProject}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="On-leave">On-leave</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
