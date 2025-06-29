import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-yellow-950/30 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container py-32">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 27, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm">
            <h2>1. Company Information</h2>
            <p>
              These Terms of Service govern your use of the services provided by{" "}
              <strong>ALLOTMEAL AFROC PRIVATE LIMITED</strong>, a company registered in Nairobi, Kenya, specifically
              within the Thika Region.
            </p>

            <h2>2. Services Offered</h2>
            <p>ALLOTMEAL AFROC PRIVATE LIMITED provides the following services:</p>
            <ul>
              <li>
                <strong>Hotel Networking & Industry Leadership</strong> - Premier networking ecosystem connecting
                hotels, hospitality businesses, and key stakeholders
              </li>
              <li>
                <strong>Efficient Transport Systems</strong> - Seamless and reliable transportation services for hotel
                operations and guest mobility
              </li>
              <li>
                <strong>Agricultural Product Connectivity</strong> - Bridging farmers, suppliers, and the hotel industry
                for sustainable food services
              </li>
              <li>
                <strong>Educational Insights & Professional Networking</strong> - Industry-specific training,
                mentorship, and networking platforms
              </li>
              <li>
                <strong>Social Awareness & Corporate Impact</strong> - Sustainability initiatives and community
                engagement programs
              </li>
              <li>
                <strong>Construction & Infrastructure Development</strong> - Development of hospitality structures and
                commercial spaces
              </li>
              <li>
                <strong>Health Standards & Wellness Innovations</strong> - Health and wellness programs ensuring global
                standards
              </li>
              <li>
                <strong>Entertainment, Events & Gigs</strong> - High-profile events, performances, and networking
                experiences
              </li>
              <li>
                <strong>SME Empowerment & Product Networking</strong> - Platforms for small and medium enterprises to
                showcase products
              </li>
              <li>
                <strong>Esoteric & Gospel Music Promotion</strong> - Production and distribution of unique, soulful, and
                gospel music
              </li>
              <li>
                <strong>Legends & Industry Icons</strong> - Honoring and documenting industry trailblazers
              </li>
            </ul>

            <h2>3. User Responsibilities</h2>
            <p>By using our services, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Use our platform in compliance with applicable laws and regulations</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Not engage in fraudulent, harmful, or illegal activities</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>

            <h2>4. Service Availability</h2>
            <p>
              We strive to maintain continuous service availability but cannot guarantee uninterrupted access. Services
              may be temporarily unavailable due to maintenance, updates, or unforeseen circumstances.
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              Payment terms vary by service type. All fees are clearly stated before service confirmation. We accept
              various payment methods including M-Pesa, credit cards, and bank transfers.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              ALLOTMEAL AFROC PRIVATE LIMITED's liability is limited by shares as stated in our company constitution. We
              are not liable for indirect, incidental, or consequential damages arising from service use.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content, trademarks, and intellectual property on our platform remain the property of ALLOTMEAL AFROC
              PRIVATE LIMITED or respective owners.
            </p>

            <h2>8. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please refer to our Privacy Policy for detailed information about how we
              collect, use, and protect your personal data.
            </p>

            <h2>9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our services at our discretion, particularly in
              cases of terms violation or fraudulent activity.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms are governed by the laws of Kenya. Any disputes will be resolved through appropriate legal
              channels within Kenyan jurisdiction.
            </p>

            <h2>11. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us:</p>
            <ul>
              <li>Email: info@allotmealafroc.com</li>
              <li>Phone: +254701524543</li>
              <li>Address: Thika Region, Nairobi, Kenya</li>
            </ul>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of significant changes, and
              continued use of our services constitutes acceptance of updated terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
