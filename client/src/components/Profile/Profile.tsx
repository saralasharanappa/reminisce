import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, fetchUserProfile } from "../../actions/user";
import { RootState } from "../../reducers";
import { AppDispatch } from "../../types/store";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";

interface Post {
  _id: string;
  title: string;
  creator: string;
  likes: string[];
  createdAt: string;
  comments?: { userId: string; createdAt: string }[];
}

interface Activity {
  type: "create" | "like";
  postId: string;
  timestamp: Date;
  postTitle?: string;
}

const Profile = () => {
  const { t } = useTranslation(); 
  const dispatch = useDispatch<AppDispatch>();
  const { user, authData, loading } = useSelector((state: RootState) => state.user);
  const currentUser = user || authData?.result;

  const [profilePicture, setProfilePicture] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const posts = useSelector(
    (state: RootState) => state.posts.posts
  ) as unknown as Post[];

  const navigate = useNavigate();

  const initialLoadDone = useRef(false);

  // Create a memoized fetch function
  const fetchProfile = useCallback(async () => {
    const storedProfile = localStorage.getItem("profile");
    if (!storedProfile) {
      navigate("/auth");
      return;
    }

    try {
      const profile = JSON.parse(storedProfile);
      if (profile?._id) {
        await dispatch(fetchUserProfile(profile._id));
      } else if (profile?.result?._id) {
        await dispatch(fetchUserProfile(profile.result._id));
      } else {
        console.log("No valid user ID found", profile);
        navigate("/auth");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate("/auth");
    }
  }, [dispatch, navigate]);

  // Use the memoized function in useEffect
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (currentUser && !initialLoadDone.current) {
      setProfilePicture(currentUser.profilePicture || "");
      setBio(currentUser.bio || "");
      setContact(currentUser.contact || "");
      initialLoadDone.current = true;
    }
  }, [currentUser]);

  // Fetch user activities
  useEffect(() => {
    if (currentUser?._id && posts.length > 0) {
      const userPosts = posts.filter((post) => post.creator === currentUser._id);
      const likedPosts = posts.filter((post) => post.likes?.includes(currentUser._id));

      const newActivities: Activity[] = [
        ...userPosts.map((post) => ({
          type: "create" as const,
          postId: post._id,
          postTitle: post.title,
          timestamp: new Date(post.createdAt),
        })),
        ...likedPosts.map((post) => ({
          type: "like" as const,
          postId: post._id,
          postTitle: post.title,
          timestamp: new Date(post.createdAt),
        })),
      ];

      newActivities.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );
      setActivities(newActivities);
    }
  }, [currentUser, posts]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const compressImage = (base64: string, maxSizeKB = 100): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        const maxDimension = 800;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    });
  };

  const handleUpdate = async () => {
    try {
      let compressedProfilePicture = profilePicture;
      if (profilePicture && profilePicture.startsWith("data:image")) {
        compressedProfilePicture = await compressImage(profilePicture);
      }

      const updatedProfile = {
        name: currentUser?.name,
        bio,
        contact,
        profilePicture: compressedProfilePicture,
      };

      const actionResult = await dispatch(
        updateUserProfile(currentUser?._id, updatedProfile)
      );

      if (actionResult) {
        // Only store minimal user data in localStorage
        // const userForStorage = {
        //   ...currentUser,
        //   bio,
        //   contact,
        //   // Store URL or small thumbnail instead of full image
        //   profilePicture: compressedProfilePicture,
        // };
        // localStorage.setItem("profile", JSON.stringify(userForStorage));
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg max-w-2xl">
      {loading ? (
        <Loader />
      ) : currentUser ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">{t("profile.title")}</h2>
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <label htmlFor="profilePicture" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden shadow-lg">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {t("profile.upload")}
                  </div>
                )}
              </div>
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setProfilePicture(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />

            {/* Name and Email */}
            <h3 className="text-xl font-semibold mt-4">{currentUser.name}</h3>
            <p className="text-gray-600 mt-1">{currentUser.email}</p>
          </div>

          {/* Update Bio and Contact */}
          <div className="mt-6">
            <h4 className="text-lg font-bold">{t("profile.bio")}:</h4>
            <textarea
              className="w-full p-3 mt-2 border rounded"
              rows={3} // Corrected to be a number
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("profile.bioPlaceholder")}
            ></textarea>

            <h4 className="text-lg font-bold mt-4">{t("profile.contact")}:</h4>
            <input
              type="text"
              className="w-full p-3 mt-2 border rounded"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t("profile.contactPlaceholder")}
            />
          </div>

          {/* Save and Logout Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleUpdate}
              className="py-2 px-6 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
            >
              {t("profile.saveChanges")}
            </button>
            {/* <button
              onClick={handleLogout}
              className="py-2 px-6 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
            >
              Logout
            </button> */}
          </div>

          {/* User Activity */}
          <div className="mt-8">
            <h4 className="text-lg font-bold">{t("profile.recentActivities")}:</h4>
            <ul className="mt-3 space-y-2">
              {activities.map((activity) => (
                <li
                  key={`${activity.type}-${activity.postId}`}
                  className="p-3 bg-gray-100 rounded shadow"
                >
                  {activity.type === "create" &&
                    `Created post: ${activity.postTitle}`}
                  {activity.type === "like" &&
                    `Liked post: ${activity.postTitle}`}
                </li>
              ))}
              {activities.length === 0 && (
                <li className="p-3 bg-gray-100 rounded shadow">
                  No recent activities
                </li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
