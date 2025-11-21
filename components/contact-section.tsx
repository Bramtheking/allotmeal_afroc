"use client"

import type React from "react"

import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { NewsletterSignup } from "./newsletter-signup"

export function ContactSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create mailto link as fallback
      const subject = encodeURIComponent(formData.subject)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
      )
      const mailtoLink = `mailto:bramwela8@gmail.com?subject=${subject}&body=${body}`

      // Try to send via API first
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        // Fallback to mailto
        window.location.href = mailtoLink
        toast.success("Opening your email client to send the message.")
        setFormData({ name: "", email: "", subject: "", message: "" })
      }
    } catch (error) {
      // Fallback to mailto
      const subject = encodeURIComponent(formData.subject)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
      )
      const mailtoLink = `mailto:bramwela8@gmail.com?subject=${subject}&body=${body}`

      window.location.href = mailtoLink
      toast.success("Opening your email client to send the message.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Get in touch with our team for more information about our services and how we can help you.
          </p>
          
          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto mb-8">
            <NewsletterSignup />
          </div>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 p-4 rounded-full">
                  <Phone className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Phone</h3>
                  <p className="text-muted-foreground">+254701524543</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Email</h3>
                  <p className="text-muted-foreground">info@allotmealafroc.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-transparent hover:border-yellow-200 dark:hover:border-blue-900 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 p-4 rounded-full">
                  <MapPin className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Address</h3>
                  <p className="text-muted-foreground">Thika Region, Nairobi, Kenya</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-2 border-transparent hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name *
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="border-2"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        className="border-2"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      placeholder="Subject"
                      className="border-2"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      rows={5}
                      className="border-2"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Follow Us on Social Media</h3>
          <div className="flex justify-center space-x-6">
            <Link
              href="https://facebook.com/allotmealafroc"
              className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <Facebook className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Facebook</span>
            </Link>
            <Link
              href="https://twitter.com/allotmealafroc"
              className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <Twitter className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com/allotmealafroc"
              className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-3 rounded-full bg-gradient-to-br from-pink-100 to-yellow-100 dark:from-pink-900/30 dark:to-yellow-900/30 group-hover:from-pink-200 group-hover:to-yellow-200 dark:group-hover:from-pink-800/50 dark:group-hover:to-yellow-800/50 transition-colors">
                <Instagram className="h-6 w-6 text-pink-600" />
              </div>
              <span className="text-sm font-medium">Instagram</span>
            </Link>
            <Link
              href="https://youtube.com/@allotmealafroc"
              className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors">
                <Youtube className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm font-medium">YouTube</span>
            </Link>
            <Link
              href="https://linkedin.com/company/allotmealafroc"
              className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <Linkedin className="h-6 w-6 text-blue-700" />
              </div>
              <span className="text-sm font-medium">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
