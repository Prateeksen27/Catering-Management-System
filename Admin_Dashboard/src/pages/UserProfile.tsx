import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
    IconEdit,
    IconMailFilled,
    IconMapPinFilled,
    IconPhoneFilled,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, NumberInput, TagsInput, TextInput } from "@mantine/core";

const UserProfile = () => {
    const { user, updateProfile, updateProfilePicture } = useAuthStore();
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState({
        name: user?.name || "",
        degn: user?.degn || "",
        email: user?.email || "",
        phone: user?.phone || "",
        location: user?.location || "",
        skills: user?.skills || [],
    });

    const [preview, setPreview] = useState(user?.profilePic || "https://i.pravatar.cc/300");
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Handle Profile Picture Upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;
            setPreview(base64Image); // instant preview
            await updateProfilePicture(base64Image, user?._id || "");
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        updateProfile(data, user?._id || "");
        close();
    };

    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("dark");
        }

        const skillTags = document.querySelectorAll(".skill-tag");
        skillTags.forEach((tag) => {
            tag.addEventListener("mouseover", () => {
                tag.classList.remove("bg-muted", "text-primary");
                tag.classList.add("bg-primary", "text-primary-foreground");
            });
            tag.addEventListener("mouseout", () => {
                tag.classList.remove("bg-primary", "text-primary-foreground");
                tag.classList.add("bg-muted", "text-primary");
            });
        });

        return () => {
            skillTags.forEach((tag) => tag.replaceWith(tag.cloneNode(true)));
        };
    }, []);

    return (
        <div className="min-h-screen">
            {/* Edit Info Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title="Edit Profile"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                    <TextInput label="Name" name="name" value={data.name} onChange={handleInputChange} />
                    <TextInput label="Designation" name="degn" value={data.degn} onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                    <TextInput label="Email" name="email" value={data.email} onChange={handleInputChange} />
                    <NumberInput
                        label="Phone"
                        name="phone"
                        value={data.phone}
                        onChange={(value) =>
                            setData((prev) => ({ ...prev, phone: value ? value.toString() : "" }))
                        }
                    />
                    </div>
                    <TextInput label="Location" name="location" value={data.location} onChange={handleInputChange} />
                    <TagsInput
                        label="Skills"
                        description="Add up to 5 Skills"
                        placeholder="Enter Skills"
                        maxTags={5}
                        defaultValue={data.skills}
                        onChange={(tags) => setData((prev) => ({ ...prev, skills: tags }))}
                    />
                    <Button fullWidth onClick={handleSubmit}>Save Changes</Button>
                </div>
            </Modal>

            {/* Main Profile Card */}
            <div className="bg-card h-full w-full p-8 transition-all duration-300 animate-fade-in">
                <div className="flex flex-col md:flex-row">
                    {/* LEFT SECTION */}
                    <div className="md:w-1/3 text-center mb-8 md:mb-0 relative">
                        <div className="relative w-48 h-48 mx-auto">
                            <img
                                src={preview}
                                alt="Profile"
                                className="rounded-full w-48 h-48 border-4 border-primary transition-transform duration-300 hover:scale-105 object-cover"
                            />

                            {/* Edit Profile Picture Button */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-2 right-3 bg-primary hover:bg-primary-hover text-white p-2 rounded-full shadow-md transition-all duration-200"
                                title="Change Profile Picture"
                            >
                                <IconEdit size={18} stroke={1.8} />
                            </button>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-primary mt-4 mb-2">
                            {user?.name || "User"}
                        </h1>
                        <p className="text-secondary">{user?.degn || "Not Specified"}</p>
                        <Button
                            variant="filled"
                            leftSection={<IconEdit />}
                            my={"sm"}
                            radius="md"
                            onClick={open}
                        >
                            Edit Profile
                        </Button>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="md:w-2/3 md:pl-8">
                        <h2 className="text-xl font-semibold text-primary mb-4">Joined On</h2>
                        <p className="text-foreground/80 mb-6">
                            {new Date(user.joiningDate).toLocaleDateString()}
                        </p>

                        <h2 className="text-xl font-semibold text-primary mb-4">Assigned Tasks</h2>
                        <p className="text-foreground/80 mb-6">
                            {user.assignedProject === "N/A"
                                ? "No tasks assigned"
                                : user.assignedProject}
                        </p>

                        <h2 className="text-xl font-semibold text-primary mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {user.skills.length == 0 ? "No Skills Specified" : user.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="skill-tag bg-muted text-primary px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <h2 className="text-xl font-semibold text-primary mb-4">
                            Contact Information
                        </h2>
                        <ul className="space-y-2 text-foreground/80">
                            <li className="flex items-center gap-2">
                                <IconMailFilled className="text-primary" />
                                {user?.email}
                            </li>
                            <li className="flex items-center gap-2">
                                <IconPhoneFilled className="text-primary" />
                                {user?.phone || "Not Provided"}
                            </li>
                            <li className="flex items-center">
                                <IconMapPinFilled className="text-primary mr-2" />
                                {user?.location || "Not Specified"}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
