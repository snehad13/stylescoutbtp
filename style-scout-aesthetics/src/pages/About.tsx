import { Sparkles, Heart, Users, Zap, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Our Mission</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Because Style Has No Size
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              StyleScout is redefining online fashion discovery by connecting you to authentic brands 
              that celebrate individuality, inclusivity, and aesthetic expression.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">Inclusivity</h3>
              <p className="text-sm text-muted-foreground">
                Fashion for every body, every style, every identity
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/10">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Uncover hidden gems and indie brands you'll love
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-secondary/5 border border-accent/10">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">AI Personalization</h3>
              <p className="text-sm text-muted-foreground">
                Smart technology that truly understands your vibe
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="prose prose-lg max-w-none mb-20">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Story</h2>
            
            <p className="text-muted-foreground leading-relaxed mb-4">
              StyleScout was born from a simple observation: the best fashion brands are often the hardest to find. 
              Hidden on Instagram, tucked away in indie D2C stores, or simply overshadowed by mainstream retailers, 
              these authentic voices struggle to reach the people who would love them most.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe that fashion discovery should be personal, inclusive, and exciting. Not another endless 
              scroll through the same mass-market options, but a curated journey that celebrates your unique aesthetic 
              and connects you with brands that share your values.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Using AI technology, we've created a platform that learns your style preferences and uncovers brands 
              that match your vibe—whether you're into minimalist chic, bohemian flow, street edge, or anything in between. 
              Every brand we feature embraces size inclusivity and authentic expression.
            </p>
          </div>

          {/* Vision Section */}
          <div className="gradient-lavender-pink rounded-3xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-primary" />
            </div>
            
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              To become the go-to platform where fashion lovers discover their next favorite brand, 
              and where indie designers find their perfect audience—all powered by AI that truly understands style.
            </p>
          </div>

          {/* Join CTA */}
          <div className="text-center mt-20 pt-12 border-t border-border">
            <Heart className="h-12 w-12 text-primary mx-auto mb-6 animate-float" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Join Our Community
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're a fashion explorer or an indie brand looking to connect with your ideal customers, 
              StyleScout is your platform.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Your Style. Our Scout.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
