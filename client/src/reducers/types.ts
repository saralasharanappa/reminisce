// types.ts or in your reducer file

export interface Post {
  _id: string;
  title: string;
  message: string;
  name: string;
  creator: string;
  tags: string[];
  selectedFile: string;
  likes: string[];
  createdAt: string;
  comments: string[];
}

export interface PostsState {
  posts: Post[];
  post: Post | null;
  currentPage?: number;
  numberOfPages?: number;
  isLoading: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  contact?: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  contact?: string;
}

export interface UserState {
  authData: {
    result: UserProfile;
    token: string;
  } | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}