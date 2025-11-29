import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 gradient-hero">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI-Powered Fashion Discovery</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Shop Your Vibe
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
              Discover hidden fashion gems that match your aesthetic
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/quiz">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-lg h-14 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Start Discovering
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/discover">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-14 border-2 hover:bg-accent">
                  Browse Brands
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Image Placeholder - would be generated */}
          {/* Hero Image Section */}
<div className="mt-16 relative">
  <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/40">
    <img
      src="/heroimage3.png"
      alt="Diverse fashion aesthetics — StyleScout"
      className="w-full h-full object-cover object-center"
    />

    {/* Optional overlay for gradient mood */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

    {/* Optional caption */}
    <div className="absolute bottom-6 left-6 text-white/90 text-sm italic bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
      Discover your vibe across diverse fashion aesthetics
    </div>
  </div>
</div>

        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Fashion Discovery, Reimagined
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We connect you with authentic brands that celebrate your unique style
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 hover:border-primary/30 transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3 text-foreground">AI Personalization</h3>
              <p className="text-muted-foreground">
                Smart recommendations that learn and adapt to your unique aesthetic preferences
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/10 hover:border-secondary/30 transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3 text-foreground">Niche Brands</h3>
              <p className="text-muted-foreground">
                Curated selection of indie D2C stores and Instagram gems you won't find elsewhere
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-secondary/5 border border-accent/10 hover:border-accent/30 transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-3 text-foreground">Truly Inclusive</h3>
              <p className="text-muted-foreground">
                Size-inclusive filters and diverse representation across all fashion aesthetics
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 gradient-lavender-pink">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Find Your Style?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Take our AI-powered style quiz and discover brands that speak to your aesthetic
          </p>
          <Link to="/quiz">
            <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-10 text-lg h-14 shadow-xl hover:scale-105 transition-all">
              Take the Style Quiz
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
