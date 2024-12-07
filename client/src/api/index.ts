import axios, { AxiosInstance } from "axios";
import { PostData } from "../actions/posts";

const API: AxiosInstance = axios.create({
  baseURL: "https://backend-rtrm.onrender.com"
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

interface SearchQuery {
  search?: string;
  tags?: string;
}

export const fetchPost = (id: string) => API.get(`/posts/${id}`);
export const fetchPosts = (page: string | number) =>
  API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery: SearchQuery) => {
  const searchTerm = searchQuery.search?.trim() || "none";
  const tagTerm = searchQuery.tags?.trim() || "";

  console.log("API Call - Sending request with:", { searchTerm, tagTerm });

  return API.get(`/posts/search?searchQuery=${searchTerm}&tags=${tagTerm}`);
};

export const createPost = (newPost: PostData) => API.post("/posts", newPost);
export const likePost = (id: string) => API.patch(`/posts/${id}/likePost`);
export const comment = (value: string, id: string) =>
  API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (id: string | number, updatedPost: PostData) =>
  API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id: string) => API.delete(`/posts/${id}`);

interface AuthFormData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const signIn = (formData: AuthFormData) =>
  API.post("/user/signin", formData);
export const signUp = (formData: AuthFormData) =>
  API.post("/user/signup", formData);

interface ProfileData {
  name?: string;
  bio?: string;
  avatar?: string;
}

export const updateUserProfileAPI = (
  id: string,
  updatedProfileData: ProfileData
) => API.put(`/user/${id}`, updatedProfileData);
export const fetchUserProfile = (id: string) => API.get(`/user/${id}`);
