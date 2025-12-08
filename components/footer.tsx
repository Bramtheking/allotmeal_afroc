import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
              Allotmeal Afroc
            </h3>
            <p className="text-muted-foreground">Home of Africa&apos;s choice of heritage and opportunities.</p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com/allotmealafroc"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com/allotmealafroc"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com/allotmealafroc"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://linkedin.com/company/allotmealafroc"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/hotel-industry"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hotel & Industry
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sme-products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  SME Products
                </Link>
              </li>
              <li>
                <Link
                  href="/services/entertainment"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/services/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/services/agriculture"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Agriculture
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg">More Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/tenders"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tenders
                </Link>
              </li>
              <li>
                <Link
                  href="/services/education"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link href="/services/health" className="text-muted-foreground hover:text-foreground transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link
                  href="/services/transport"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Transport
                </Link>
              </li>
              <li>
                <Link
                  href="/services/construction"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Construction
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg">Contact & Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+254701524543"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  📞 +254 701 524543
                </a>
              </li>
              <li>
                <a
                  href="mailto:allotmealafrockenya@gmail.com"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  ✉️ Email Support
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254701524543"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  💬 WhatsApp Chat
                </a>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Available 24/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Allotmeal Afroc Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
