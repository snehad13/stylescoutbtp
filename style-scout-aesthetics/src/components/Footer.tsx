import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
  <img
    src="/sslogo2.png"
    alt="StyleScout Logo"
    className="h-7 w-7 object-contain"
  />
  <span className="font-serif text-2xl font-bold text-foreground">
    StyleScout
  </span>
</div>

            <p className="text-muted-foreground text-sm mb-4">
              Your Style. Our Scout.
            </p>
            <p className="text-muted-foreground text-sm max-w-md">
              Discover hidden fashion gems that match your aesthetic. 
              AI-powered discovery for the modern fashion explorer.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Our Vision
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Discover Brands
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Join as a Store
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 StyleScout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
