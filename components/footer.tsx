import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">Allotmeal Afroc</h3>
            <p className="text-gray-300">Home of Africa&apos;s choice of heritage and opportunities.</p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com/allotmealafroc"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors hover-lift"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com/allotmealafroc"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors hover-lift"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com/allotmealafroc"
                target="_blank"
                className="text-gray-400 hover:text-pink-400 transition-colors hover-lift"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://linkedin.com/company/allotmealafroc"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors hover-lift"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://youtube.com/@allotmealafroc"
                target="_blank"
                className="text-gray-400 hover:text-red-400 transition-colors hover-lift"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg text-yellow-400">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/hotel-industry" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Hotel & Industry
                </Link>
              </li>
              <li>
                <Link href="/services/sme-products" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  SME Products
                </Link>
              </li>
              <li>
                <Link href="/services/entertainment" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/services/jobs" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/services/agriculture" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Agriculture
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg text-blue-400">More Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/tenders" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Tenders
                </Link>
              </li>
              <li>
                <Link href="/services/education" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/services/health" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/services/transport" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Transport
                </Link>
              </li>
              <li>
                <Link href="/services/construction" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Construction
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg text-yellow-400">Contact & Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Allotmeal Afroc Ltd. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Made with ❤️ in Kenya</span>
              <span>•</span>
              <span>Connecting Africa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
