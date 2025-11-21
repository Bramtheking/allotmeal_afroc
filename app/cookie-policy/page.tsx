import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiePolicyPage() {
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
            <h1 className="text-3xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: January 27, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm">
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us
              provide you with a better experience by remembering your preferences and understanding how you use our
              services.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>ALLOTMEAL AFROC PRIVATE LIMITED uses cookies for the following purposes:</p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Required for basic website functionality
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us understand how visitors interact with our website
              </li>
              <li>
                <strong>Functional Cookies:</strong> Remember your preferences and settings
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
              </li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>

            <h3>3.1 Essential Cookies</h3>
            <p>These cookies are necessary for our website to function properly:</p>
            <ul>
              <li>Authentication cookies to keep you logged in</li>
              <li>Security cookies to protect against fraud</li>
              <li>Load balancing cookies for optimal performance</li>
            </ul>

            <h3>3.2 Analytics Cookies</h3>
            <p>We use analytics cookies to understand website usage:</p>
            <ul>
              <li>Google Analytics for website traffic analysis</li>
              <li>User behavior tracking for service improvement</li>
              <li>Performance monitoring cookies</li>
            </ul>

            <h3>3.3 Functional Cookies</h3>
            <p>These cookies enhance your user experience:</p>
            <ul>
              <li>Language preference cookies</li>
              <li>Theme and display preference cookies</li>
              <li>Location-based service cookies</li>
            </ul>

            <h3>3.4 Marketing Cookies</h3>
            <p>Used for advertising and marketing purposes:</p>
            <ul>
              <li>Social media integration cookies</li>
              <li>Advertising network cookies</li>
              <li>Retargeting and remarketing cookies</li>
            </ul>

            <h2>4. Third-Party Cookies</h2>
            <p>We may use third-party services that set their own cookies:</p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> For website analytics and insights
              </li>
              <li>
                <strong>Social Media Platforms:</strong> For social sharing and integration
              </li>
              <li>
                <strong>Payment Processors:</strong> For secure payment processing
              </li>
              <li>
                <strong>Advertising Networks:</strong> For targeted advertising
              </li>
            </ul>

            <h2>5. Managing Your Cookie Preferences</h2>

            <h3>5.1 Browser Settings</h3>
            <p>You can control cookies through your browser settings:</p>
            <ul>
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete existing cookies</li>
              <li>Receive notifications when cookies are set</li>
            </ul>

            <h3>5.2 Opt-Out Options</h3>
            <p>For specific cookie types, you can opt out through:</p>
            <ul>
              <li>Google Analytics Opt-out Browser Add-on</li>
              <li>Network Advertising Initiative opt-out page</li>
              <li>Digital Advertising Alliance opt-out page</li>
            </ul>

            <h2>6. Cookie Consent</h2>
            <p>
              When you first visit our website, we will ask for your consent to use non-essential cookies. You can
              withdraw your consent at any time by adjusting your cookie preferences.
            </p>

            <h2>7. Impact of Disabling Cookies</h2>
            <p>Disabling cookies may affect your experience on our website:</p>
            <ul>
              <li>Some features may not work properly</li>
              <li>You may need to re-enter information repeatedly</li>
              <li>Personalized content may not be available</li>
              <li>Website performance may be reduced</li>
            </ul>

            <h2>8. Mobile Devices</h2>
            <p>
              For mobile devices, cookie management may be different. Please refer to your device's settings or browser
              help for specific instructions on managing cookies on mobile platforms.
            </p>

            <h2>9. Updates to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws.
              We will notify you of any significant changes by posting the updated policy on our website.
            </p>

            <h2>10. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us:</p>
            <ul>
              <li>Email: info@allotmealafroc.com</li>
              <li>Phone: +254701524543</li>
              <li>Address: Thika Region, Nairobi, Kenya</li>
            </ul>

            <h2>11. Additional Resources</h2>
            <p>For more information about cookies, visit:</p>
            <ul>
              <li>
                <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
                  All About Cookies
                </a>
              </li>
              <li>
                <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">
                  Your Online Choices
                </a>
              </li>
              <li>
                <a href="https://cookiepedia.co.uk" target="_blank" rel="noopener noreferrer">
                  Cookiepedia
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
