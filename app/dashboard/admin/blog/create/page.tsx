"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Upload, X, Plus, Edit, FileText } from "lucide-react"
import Link from "next/link"
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import type { BlogPost, BlogCategory } from "@/lib/types/blog"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import VisitorTracker from "@/components/visitor-tracker"
import { getMockBlogCategories } from "@/lib/mock-data"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

// Rich text editor toolbar configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
}

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "blockquote",
  "code-block",
  "link",
  "image",
  "align",
  "color",
  "background",
]

export default function CreateBlogPage() {
  const router = useRouter()
  const { user, userRole, loading: authLoading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    selectedCategories: [] as string[],
    tags: [] as string[],
    status: "draft" as "draft" | "published",
    metaTitle: "",
    metaDescription: ""
  })
  
  const [newTag, setNewTag] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit")

  // Security check - redirect if not admin
  useEffect(() => {
    if (authLoading) return
    
    if (!user || userRole !== "admin") {
      router.push("/login")
      return
    }
    
    fetchCategories()
  }, [user, userRole, authLoading, router])

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  // Show loading state during auth check
  if (authLoading) {
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
            <span className="text-muted-foreground">Checking permissions...</span>
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
            You don't have permission to create blog posts.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const fetchCategories = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) {
        // Use mock data when Firebase is not available
        setCategories(getMockBlogCategories())
        return
      }

      const categoriesSnapshot = await getDocs(collection(db, "blog_categories"))
      const categoriesData: BlogCategory[] = []
      categoriesSnapshot.forEach((doc) => {
        categoriesData.push({ id: doc.id, ...doc.data() } as BlogCategory)
      })
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories(getMockBlogCategories())
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleCategoryToggle = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryName)
        ? prev.selectedCategories.filter(c => c !== categoryName)
        : [...prev.selectedCategories, categoryName]
    }))
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!formData.content.trim()) {
      toast.error("Content is required")
      return
    }

    if (!user) {
      toast.error("You must be logged in to create blog posts")
      return
    }

    setSaving(true)

    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.success(`Blog post ${status} successfully! (Demo mode)`)
        router.push("/dashboard/admin/blog")
        return
      }

      const now = new Date()
      const blogPost: Omit<BlogPost, "id"> = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 200) + "...",
        featuredImage: formData.featuredImage.trim() || undefined,
        categories: formData.selectedCategories,
        tags: formData.tags,
        author: user.displayName || user.email || "Unknown Author",
        authorId: user.uid,
        status,
        publishedAt: status === "published" ? now : undefined,
        createdAt: now,
        updatedAt: now,
        views: 0,
        likes: 0,
        metaTitle: formData.metaTitle.trim() || formData.title.trim(),
        metaDescription: formData.metaDescription.trim() || formData.excerpt.trim()
      }

      const docRef = await addDoc(collection(db, "blog_posts"), {
        ...blogPost,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: status === "published" ? serverTimestamp() : null
      })

      toast.success(`Blog post ${status} successfully!`)
      router.push("/dashboard/admin/blog")
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast.error("Failed to save blog post")
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="space-y-8">
      <VisitorTracker page="/dashboard/admin/blog/create" />

      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
            <p className="text-muted-foreground">Write and publish a new blog post</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSave("published")} disabled={saving}>
            <Eye className="h-4 w-4 mr-2" />
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                  className="text-lg"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
                <p className="text-sm text-muted-foreground">
                  URL: /blog/{formData.slug || "your-post-slug"}
                </p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary of the post..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Optional. If not provided, first 200 characters of content will be used.
                </p>
              </div>

              {/* Content Editor with Preview */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Tabs value={previewMode} onValueChange={(value: any) => setPreviewMode(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="mt-4">
                    <div className="border rounded-md">
                      <ReactQuill
                        value={formData.content}
                        onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Write your blog post content here..."
                        style={{ minHeight: "300px" }}
                        className="bg-white"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Rich text editor with formatting options. Content will be saved as HTML.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-md p-6 bg-white min-h-[300px]">
                      {formData.content ? (
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: formData.content }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                          <div className="text-center">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No content to preview</p>
                            <p className="text-sm">Switch to Editor tab to start writing</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Preview of how your content will appear when published.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO optimized title..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO meta description..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImage">Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {formData.featuredImage && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.featuredImage}
                    alt="Featured image preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={formData.selectedCategories.includes(category.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryToggle(category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
              
              {formData.selectedCategories.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.selectedCategories.map((category) => (
                      <Badge key={category} variant="default" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}