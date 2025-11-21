"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, User, Eye, Heart, Share2, Copy, Twitter, Facebook, Linkedin, Clock } from "lucide-react"
import Link from "next/link"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { BlogPost } from "@/lib/types/blog"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "sonner"
import VisitorTracker from "@/components/visitor-tracker"
import { getMockBlogPosts } from "@/lib/mock-data"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [viewCounted, setViewCounted] = useState(false)

  const slug = params.slug as string

  useEffect(() => {
    fetchPost()
  }, [slug])

  useEffect(() => {
    // Increment view count after component mounts and post is loaded
    if (post && !viewCounted) {
      incrementViewCount()
      setViewCounted(true)
    }
  }, [post, viewCounted])

  const fetchPost = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        // Use mock data when Firebase is not available
        console.log("Using mock data for blog post")
        const mockPosts = getMockBlogPosts()
        const mockPost = mockPosts.find(p => p.slug === slug)
        if (mockPost) {
          setPost(mockPost)
          setLikeCount(mockPost.likes || 0)
        } else {
          toast.error("Blog post not found")
          router.push("/blog")
        }
        setLoading(false)
        return
      }

      // In a real implementation, you'd query by slug field
      // For now, we'll assume the slug is the document ID
      const docRef = doc(db, "blog_posts", slug)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const postData = { id: docSnap.id, ...docSnap.data() } as BlogPost
        setPost(postData)
        setLikeCount(postData.likes || 0)
      } else {
        toast.error("Blog post not found")
        router.push("/blog")
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      toast.error("Failed to load blog post")
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async () => {
    if (!post) return

    try {
      const db = await getFirebaseDb()
      if (!db) return

      const postRef = doc(db, "blog_posts", post.id!)
      await updateDoc(postRef, {
        views: increment(1)
      })
    } catch (error) {
      console.error("Error incrementing view count:", error)
    }
  }

  const handleLike = async () => {
    if (!post || liked) return

    try {
      const db = await getFirebaseDb()
      if (!db) {
        // Mock like functionality
        setLiked(true)
        setLikeCount(prev => prev + 1)
        toast.success("Post liked!")
        return
      }

      const postRef = doc(db, "blog_posts", post.id!)
      await updateDoc(postRef, {
        likes: increment(1)
      })

      setLiked(true)
      setLikeCount(prev => prev + 1)
      toast.success("Post liked!")
    } catch (error) {
      console.error("Error liking post:", error)
      toast.error("Failed to like post")
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = post?.title || "Check out this blog post"

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy link")
      }
    }
  }

  const shareOnSocial = (platform: string) => {
    if (!post) return

    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post.title)
    
    let shareUrl = ""
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

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
              <span className="text-muted-foreground">Loading blog post...</span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-950 dark:to-purple-950/20">
        <div className="container py-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const readingTime = Math.ceil(post.content.split(" ").length / 200) // Rough estimate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-950 dark:to-purple-950/20">
      <VisitorTracker page={`/blog/${slug}`} />
      
      <div className="container py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.article
            className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {post.publishedAt && format(new Date(post.publishedAt), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.views || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{likeCount} likes</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="aspect-video rounded-lg overflow-hidden mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <Separator className="mb-8" />

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:bg-gradient-to-r prose-headings:from-blue-600 prose-headings:to-purple-600 prose-headings:bg-clip-text prose-headings:text-transparent"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <Separator className="my-8" />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={liked}
                  className={liked ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"} ({likeCount})
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => shareOnSocial("twitter")}>
                  <Twitter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => shareOnSocial("facebook")}>
                  <Facebook className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => shareOnSocial("linkedin")}>
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.article>

          {/* Back to Blog */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button asChild size="lg">
              <Link href="/blog">
                ← Back to Blog
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}