"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, User, Eye, Heart, BookOpen, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import { collection, query, where, orderBy, getDocs, limit, startAfter, DocumentSnapshot } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { BlogPost, BlogCategory } from "@/lib/types/blog"
import { formatDistanceToNow } from "date-fns"
import VisitorTracker from "@/components/visitor-tracker"

const POSTS_PER_PAGE = 9

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchBlogData()
  }, [selectedCategory])

  const fetchBlogData = async (isLoadMore = false) => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        // Firebase not available - show empty state
        console.log("Firebase not available - no blog posts to display")
        setPosts([])
        setCategories([])
        setLoading(false)
        return
      }

      // Fetch categories
      const categoriesSnapshot = await getDocs(collection(db, "blog_categories"))
      const categoriesData: BlogCategory[] = []
      categoriesSnapshot.forEach((doc) => {
        categoriesData.push({ id: doc.id, ...doc.data() } as BlogCategory)
      })
      setCategories(categoriesData)

      // Fetch posts
      let postsQuery = query(
        collection(db, "blog_posts"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
        limit(POSTS_PER_PAGE)
      )

      if (selectedCategory !== "all") {
        postsQuery = query(
          collection(db, "blog_posts"),
          where("status", "==", "published"),
          where("categories", "array-contains", selectedCategory),
          orderBy("publishedAt", "desc"),
          limit(POSTS_PER_PAGE)
        )
      }

      if (isLoadMore && lastDoc) {
        postsQuery = query(postsQuery, startAfter(lastDoc))
      }

      const postsSnapshot = await getDocs(postsQuery)
      const postsData: BlogPost[] = []
      
      postsSnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as BlogPost)
      })

      if (!isLoadMore) {
        setPosts(postsData)
      } else {
        setPosts(prev => [...prev, ...postsData])
      }

      setLastDoc(postsSnapshot.docs[postsSnapshot.docs.length - 1] || null)
      setHasMore(postsSnapshot.docs.length === POSTS_PER_PAGE)

    } catch (error) {
      console.error("Error fetching blog data:", error)
      // Show empty state on error
      setPosts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    fetchBlogData(true)
  }

  const getFilteredPosts = () => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const filteredPosts = getFilteredPosts()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-950 dark:to-purple-950/20">
        <div className="container py-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading blog posts...</span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-950 dark:to-purple-950/20">
      <VisitorTracker page="/blog" />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-blue-950/40 dark:via-gray-950 dark:to-purple-950/40" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                AllotMeal Blog
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Insights, stories, and updates from Africa's choice of heritage and opportunities
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container pb-20">
        {/* Filters */}
        <motion.div
          className="mb-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name} ({category.postCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : posts.length === 0 && categories.length === 0 
                ? "No blog posts available. Contact administrators to add content."
                : "Check back later for new content"
              }
            </p>
          </motion.div>
        ) : (
          <>
            <div className={`grid gap-8 ${viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
            }`}>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <BlogPostCard post={post} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button onClick={loadMore} size="lg">
                  Load More Posts
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface BlogPostCardProps {
  post: BlogPost
  viewMode: "grid" | "list"
}

function BlogPostCard({ post, viewMode }: BlogPostCardProps) {
  const isGrid = viewMode === "grid"

  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${
      isGrid ? "h-full" : "flex flex-col md:flex-row"
    }`}>
      {post.featuredImage && (
        <div className={isGrid ? "aspect-video" : "md:w-80 aspect-video md:aspect-square"}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className={isGrid ? "" : "flex-1"}>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.publishedAt && formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views || 0}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {post.likes || 0}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/blog/${post.slug}`}>
              Read More
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}