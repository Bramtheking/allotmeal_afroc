"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Image, Video, Link2, Eye } from "lucide-react"
import Link from "next/link"
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import type { BlogPost, BlogCategory } from "@/lib/types/blog"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function EditBlogPost() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categories: [] as string[],
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published' | 'archived',
    youtubeLinks: [] as string[]
  })
  
  const [tagInput, setTagInput] = useState('')
  const [youtubeLinkInput, setYoutubeLinkInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ReactQuill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  }

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image', 'align'
  ]

  useEffect(() => {
    loadBlogPost()
    loadCategories()
  }, [])

  // Load existing blog post
  const loadBlogPost = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db || !params.id) {
        setLoadingPost(false)
        return
      }

      const postDoc = await getDoc(doc(db, "blog_posts", params.id as string))
      
      if (!postDoc.exists()) {
        toast.error("Blog post not found")
        router.push('/dashboard/marketing')
        return
      }

      const post = { id: postDoc.id, ...postDoc.data() } as BlogPost
      
      // Check if user can edit this post (author or admin)
      if (user && post.authorId !== user.uid) {
        toast.error("You don't have permission to edit this post")
        router.push('/dashboard/marketing')
        return
      }

      setOriginalPost(post)
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featuredImage: post.featuredImage || '',
        categories: post.categories || [],
        tags: post.tags || [],
        status: post.status || 'draft',
        youtubeLinks: post.youtubeLinks || []
      })
    } catch (error) {
      console.error("Error loading blog post:", error)
      toast.error("Failed to load blog post")
      router.push('/dashboard/marketing')
    } finally {
      setLoadingPost(false)
    }
  }

  // Load categories
  const loadCategories = async () => {
    try {
      const db = await getFirebaseDb()
      if (!db) return

      const snapshot = await getDocs(collection(db, "blog_categories"))
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogCategory[]
      
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      return null
    }
  }

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    toast.info('Uploading image...')
    const imageUrl = await handleImageUpload(file)
    
    if (imageUrl) {
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }))
      toast.success('Image uploaded successfully!')
    }
  }

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  // Add tag
  const addTag = () => {
    if (!tagInput.trim()) return
    
    const newTag = tagInput.trim().toLowerCase()
    if (!formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
    }
    setTagInput('')
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  // Add YouTube link
  const addYouTubeLink = () => {
    if (!youtubeLinkInput.trim()) return
    
    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
    if (!youtubeRegex.test(youtubeLinkInput)) {
      toast.error('Please enter a valid YouTube URL')
      return
    }
    
    if (!formData.youtubeLinks.includes(youtubeLinkInput)) {
      setFormData(prev => ({
        ...prev,
        youtubeLinks: [...prev.youtubeLinks, youtubeLinkInput]
      }))
    }
    setYoutubeLinkInput('')
  }

  // Remove YouTube link
  const removeYouTubeLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter(l => l !== link)
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !originalPost) {
      toast.error('Cannot save changes')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Please enter content')
      return
    }

    setLoading(true)

    try {
      const db = await getFirebaseDb()
      if (!db) {
        toast.error('Database not available')
        return
      }

      const slug = generateSlug(formData.title)
      const now = new Date().toISOString()

      const updateData = {
        title: formData.title.trim(),
        slug,
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 200) + '...',
        content: formData.content,
        featuredImage: formData.featuredImage,
        categories: formData.categories,
        tags: formData.tags,
        status: formData.status,
        youtubeLinks: formData.youtubeLinks,
        updatedAt: now,
        // Update publishedAt if status changed to published and wasn't published before
        ...(formData.status === 'published' && originalPost.status !== 'published' && {
          publishedAt: now
        })
      }

      await updateDoc(doc(db, "blog_posts", originalPost.id), updateData)
      toast.success('Blog post updated successfully!')
      router.push('/dashboard/marketing')
      
    } catch (error) {
      console.error('Error updating blog post:', error)
      toast.error('Failed to update blog post')
    } finally {
      setLoading(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!originalPost) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Post not found</h3>
            <p className="text-muted-foreground mb-4">The blog post you're looking for doesn't exist or you don't have permission to edit it.</p>
            <Button asChild>
              <Link href="/dashboard/marketing">
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/marketing">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update your blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog post title..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of your post (optional - will be auto-generated if empty)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <div className="mt-2">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Write your blog post content here..."
                      style={{ height: '400px', marginBottom: '50px' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published' | 'archived') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Updating...' : 'Update Post'}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/blog/${originalPost.slug}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.featuredImage ? (
                  <div className="space-y-2">
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            categories: [...prev.categories, category.name]
                          }))
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            categories: prev.categories.filter(c => c !== category.name)
                          }))
                        }
                      }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
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
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* YouTube Links */}
            <Card>
              <CardHeader>
                <CardTitle>YouTube Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={youtubeLinkInput}
                    onChange={(e) => setYoutubeLinkInput(e.target.value)}
                    placeholder="YouTube URL..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addYouTubeLink())}
                  />
                  <Button type="button" onClick={addYouTubeLink} size="sm">
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.youtubeLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Video className="h-4 w-4 text-red-500" />
                      <span className="text-sm flex-1 truncate">{link}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeYouTubeLink(link)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}