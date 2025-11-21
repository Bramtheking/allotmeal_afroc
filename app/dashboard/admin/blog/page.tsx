"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, BookOpen, Users, TrendingUp, Calendar, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { collection, query, orderBy, getDocs, doc, deleteDoc, where } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { BlogPost, BlogCategory, BlogStats } from "@/lib/types/blog"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "sonner"
import VisitorTracker from "@/components/visitor-tracker"
import { getMockBlogPosts, getMockBlogCategories } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function AdminBlogPage() {
  const { user, userRole, loading: authLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    categoriesCount: 0,
    tagsCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null)

  // Security check - redirect if not admin
  useEffect(() => {
    if (authLoading) return
    
    if (!user || userRole !== "admin") {
      router.push("/login")
      return
    }
    
    fetchBlogData()
  }, [user, userRole, authLoading, router])

  const fetchBlogData = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        // Use mock data when Firebase is not available
        console.log("Using mock data for admin blog")
        const mockPosts = getMockBlogPosts()
        const mockCategories = getMockBlogCategories()
        
        setPosts(mockPosts)
        setCategories(mockCategories)
        
        // Calculate mock stats
        const mockStats: BlogStats = {
          totalPosts: mockPosts.length,
          publishedPosts: mockPosts.filter(p => p.status === "published").length,
          draftPosts: mockPosts.filter(p => p.status === "draft").length,
          totalViews: mockPosts.reduce((sum, p) => sum + (p.views || 0), 0),
          totalLikes: mockPosts.reduce((sum, p) => sum + (p.likes || 0), 0),
          categoriesCount: mockCategories.length,
          tagsCount: [...new Set(mockPosts.flatMap(p => p.tags))].length
        }
        setStats(mockStats)
        setLoading(false)
        return
      }

      // Fetch posts
      const postsQuery = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"))
      const postsSnapshot = await getDocs(postsQuery)
      const postsData: BlogPost[] = []
      postsSnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as BlogPost)
      })

      // Fetch categories
      const categoriesSnapshot = await getDocs(collection(db, "blog_categories"))
      const categoriesData: BlogCategory[] = []
      categoriesSnapshot.forEach((doc) => {
        categoriesData.push({ id: doc.id, ...doc.data() } as BlogCategory)
      })

      // Calculate stats
      const blogStats: BlogStats = {
        totalPosts: postsData.length,
        publishedPosts: postsData.filter(p => p.status === "published").length,
        draftPosts: postsData.filter(p => p.status === "draft").length,
        totalViews: postsData.reduce((sum, p) => sum + (p.views || 0), 0),
        totalLikes: postsData.reduce((sum, p) => sum + (p.likes || 0), 0),
        categoriesCount: categoriesData.length,
        tagsCount: [...new Set(postsData.flatMap(p => p.tags))].length
      }

      setPosts(postsData)
      setCategories(categoriesData)
      setStats(blogStats)
    } catch (error) {
      console.error("Error fetching blog data:", error)
      toast.error("Failed to load blog data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error("Cannot delete posts in demo mode")
        return
      }

      await deleteDoc(doc(db, "blog_posts", postId))
      setPosts(posts.filter(p => p.id !== postId))
      setDeletePost(null)
      toast.success("Blog post deleted successfully")
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete blog post")
    }
  }

  const getFilteredPosts = () => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(post => post.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(post => post.categories.includes(categoryFilter))
    }

    return filtered
  }

  const filteredPosts = getFilteredPosts()

  // Show loading state during auth check or data loading
  if (authLoading || loading) {
    return (
      <div className="container py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">
              {authLoading ? "Checking permissions..." : "Loading blog data..."}
            </span>
          </motion.div>
        </div>
      </div>
    )
  }

  // Security check - deny access if not admin
  if (!user || userRole !== "admin") {
    return (
      <div className="container py-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access blog management.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <VisitorTracker page="/dashboard/admin/blog" />

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            Blog Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog posts and categories
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/dashboard/admin/blog/create">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPosts} published, {stats.draftPosts} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all published posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Engagement from readers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoriesCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.tagsCount} unique tags
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Blog Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Get started by creating your first blog post"
              }
            </p>
            <Button asChild>
              <Link href="/dashboard/admin/blog/create">
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge 
                            variant={post.status === "published" ? "default" : 
                                   post.status === "draft" ? "secondary" : "destructive"}
                          >
                            {post.status}
                          </Badge>
                          {post.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>

                        <h3 className="text-xl font-semibold line-clamp-1 mb-2">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By {post.author}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {post.likes || 0} likes
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/admin/blog/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/blog/edit/${post.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletePost(post)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              "{deletePost?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletePost && handleDeletePost(deletePost.id!)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}