import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
  <img
    src="/sslogo.png"
    alt="StyleScout Logo"
    className="h-8 w-8 object-contain transition-transform group-hover:scale-110"
  />
  <span className="font-serif text-2xl font-bold text-foreground">
    StyleScout
  </span>
</Link>

          
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/discover") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Discover
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/pinterest">
              <Button
                variant="outline"
                className={`rounded-full px-6 ${
                  isActive("/pinterest")
                    ? "border-primary text-primary"
                    : "text-foreground border-border hover:border-primary/60"
                }`}
              >
                Pinterest Vault
              </Button>
            </Link>
            <Link to="/quiz">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
              >
                Find My Style
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
