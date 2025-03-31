
export interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  role: string;
}

export interface UserTag {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  x: number;
  y: number;
  comment: string;
  imageUrl?: string;
  createdAt: string;
  pageUrl: string;
}

export interface TagFormData {
  comment: string;
  imageFile?: File | null;
}
