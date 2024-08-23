export interface Annotation {
  uuid: string;
  createdAt: string;
  remindAt: string;
  updatedAt: string;
  content: string;
  category?: {
    uuid: string;
    name: string;
  };
  author: {
    uuid: string;
    name: string;
  };
  relatedUsers?: Array<{
    annotationId: string;
    userId: string;
    user: {
      uuid: string;
      name: string;
      email: string;
      profileImageUrl?: string | null;
    };
  }>;
}

export interface UserProps {
  id: string;
  token: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Friend {
  uuid: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

export interface CategoryOption {
  label: string;
  value: string;
}

export interface SearchResult {
  uuid: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  status: string | null;
}

export interface Friendship {
  uuid: string;
  user1: {
    uuid: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  user2: {
    uuid: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
}
