import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
// import moment from "moment";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { ChatBubbleOutline, FavoriteOutlined } from "@mui/icons-material";

interface Post {
  _id: string;
  title: string;
  creator: string;
  createdAt: string;
  likes: string[];
  comments?: {
    userId: string;
    userName: string;
    createdAt: string;
  }[];
}

interface Notification {
  id: string;
  type: "like" | "comment";
  message: string;
  postId: string;
  postTitle: string;
  createdAt: Date;
  read: boolean;
  fromUser: {
    name: string;
    id: string;
  };
}

const getUserName = (userId: string) => {
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  return users[userId]?.name;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = JSON.parse(localStorage.getItem("profile"));
  const posts = useSelector(
    (state: RootState) => state.posts.posts
  ) as unknown as Post[];

  // const markAsRead = (notificationId: string) => {
  //   setNotifications((prev) =>
  //     prev.map((notif) =>
  //       notif.id === notificationId ? { ...notif, read: true } : notif
  //     )
  //   );
  // };

  useEffect(() => {
    if (user?.result?._id && posts.length > 0) {
      // Filter posts created by the user
      const userPosts = posts.filter(
        (post) => post.creator === user.result._id
      );

      // Create notifications for likes and comments on user's posts
      const newNotifications: Notification[] = [];

      userPosts.forEach((post) => {
        // Add notifications for likes
        post.likes?.forEach((likerId) => {
          if (likerId !== user.result._id) {
            newNotifications.push({
              id: `like-${post._id}-${likerId}`,
              type: "like",
              message: "liked your post",
              postId: post._id,
              postTitle: post.title,
              createdAt: new Date(post.createdAt),
              read: false,
              fromUser: {
                name: getUserName(likerId) || "Someone",
                id: likerId,
              },
            });
          }
        });

        // Add notifications for comments
        post.comments?.forEach((comment) => {
          if (comment.userId !== user.result._id) {
            newNotifications.push({
              id: `comment-${post._id}-${comment.userId}`,
              type: "comment",
              message: "commented on your post",
              postId: post._id,
              postTitle: post.title,
              createdAt: new Date(comment.createdAt),
              read: false,
              fromUser: {
                name: comment.userName || "Someone",
                id: comment.userId,
              },
            });
          }
        });
      });

      // Update localStorage with unread count
      const unreadCount = newNotifications.filter((n) => !n.read).length;
      localStorage.setItem("unreadNotifications", unreadCount.toString());

      // Sort notifications by date (newest first)
      newNotifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(newNotifications);
    }
  }, [user, posts]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <div className="space-y-4">
          {notifications.map((notification) =>
            notification.read ? (
              // Read notification - non-clickable div
              <div
                key={notification.id}
                className="block bg-gray-50 rounded-lg shadow-sm cursor-default"
              >
                <div className="p-4 opacity-75">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                      {notification.fromUser.name[0].toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          {notification.fromUser.name}
                        </span>{" "}
                        {notification.message}{" "}
                        <span className="text-gray-500">
                          "{notification.postTitle}"
                        </span>
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          {notification.type === "like" ? (
                            <FavoriteOutlined className="w-4 h-4 text-gray-400 mr-1" />
                          ) : (
                            <ChatBubbleOutline className="w-4 h-4 text-gray-400 mr-1" />
                          )}
                          {notification.type === "like" ? "Like" : "Comment"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Unread notification - clickable link
              <Link
                to={`/posts/${notification.postId}`}
                key={notification.id}
                onClick={() => {
                  const newNotifications = notifications.map((n) =>
                    n.id === notification.id ? { ...n, read: true } : n
                  );
                  setNotifications(newNotifications);
                  const newUnreadCount = newNotifications.filter(
                    (n) => !n.read
                  ).length;
                  localStorage.setItem(
                    "unreadNotifications",
                    newUnreadCount.toString()
                  );
                  window.dispatchEvent(new Event("storage"));
                }}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-blue-500"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {notification.fromUser.name[0].toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <p className="text-gray-800">
                        <span className="font-semibold">
                          {notification.fromUser.name}
                        </span>{" "}
                        {notification.message}{" "}
                        <span className="text-blue-600">
                          "{notification.postTitle}"
                        </span>
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          {notification.type === "like" ? (
                            <FavoriteOutlined className="w-4 h-4 text-red-500 mr-1" />
                          ) : (
                            <ChatBubbleOutline className="w-4 h-4 text-blue-500 mr-1" />
                          )}
                          {notification.type === "like" ? "Like" : "Comment"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
