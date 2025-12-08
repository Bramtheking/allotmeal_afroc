export interface BlogPost {
  id?: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  categories: string[]
  tags: string[]
  author: string
  authorId: string
  status: "draft" | "published" | "archived"
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  views: number
  likes: number
  metaTitle?: string
  metaDescription?: string
}

export interface BlogCategory {
  id?: string
  name: string
  slug: string
  description?: string
  color?: string
  postCount: number
  createdAt: Date
  updatedAt: Date
}

export interface BlogTag {
  id?: string
  name: string
  slug: string
  postCount: number
  createdAt: Date
}

export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalLikes: number
  categoriesCount: number
  tagsCount: number
}