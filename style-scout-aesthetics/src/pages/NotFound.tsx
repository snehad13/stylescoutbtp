import { Link } from "react-router-dom";
import { Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <Sparkles className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-foreground mb-4">404</h1>
        <p className="text-2xl md:text-3xl text-foreground mb-4 font-light">Page Not Found</p>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Oops! This page seems to have wandered off the runway. Let's get you back on track.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
