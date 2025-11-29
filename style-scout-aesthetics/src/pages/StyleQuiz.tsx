import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const styleOptions = [
  { id: "minimal", label: "Minimal", description: "Clean lines, neutral tones, timeless pieces" },
  { id: "boho", label: "Boho", description: "Free-spirited, earthy, flowing silhouettes" },
  { id: "street", label: "Street", description: "Urban edge, bold graphics, trendy vibes" },
  { id: "chic", label: "Chic", description: "Sophisticated, elegant, polished looks" },
  { id: "ethnic", label: "Ethnic", description: "Cultural fusion, vibrant patterns, traditional elements" },
  { id: "vintage", label: "Vintage", description: "Retro-inspired, nostalgic, timeless charm" },
];

const occasionOptions = [
  { id: "casual", label: "Everyday Casual" },
  { id: "work", label: "Work/Professional" },
  { id: "evening", label: "Evening Out" },
  { id: "special", label: "Special Events" },
];

const StyleQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);

  const handleStyleToggle = (id: string) => {
    setSelectedStyle(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleOccasionToggle = (id: string) => {
    setSelectedOccasion(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    // Navigate to results page with quiz data
    navigate("/quiz/results", {
      state: {
        styles: selectedStyle,
        occasions: selectedOccasion,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">AI Style Quiz</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Your Fashion Vibe
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help us understand your aesthetic preferences to curate the perfect brands for you
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Step {step} of 2</span>
              <span className="text-sm text-muted-foreground">{step === 1 ? 'Style Preferences' : 'Occasions'}</span>
            </div>
            <div className="h-2 bg-white/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Style Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 text-center">
                What's your style vibe? (Choose all that apply)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {styleOptions.map((option) => (
                  <Card
                    key={option.id}
                    onClick={() => handleStyleToggle(option.id)}
                    className={`p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
                      selectedStyle.includes(option.id)
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {option.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={selectedStyle.length === 0}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Occasion Selection */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 text-center">
                What occasions do you shop for? (Choose all that apply)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {occasionOptions.map((option) => (
                  <Card
                    key={option.id}
                    onClick={() => handleOccasionToggle(option.id)}
                    className={`p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
                      selectedOccasion.includes(option.id)
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <h3 className="font-semibold text-lg text-foreground text-center">
                      {option.label}
                    </h3>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={selectedOccasion.length === 0}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                >
                  See My Recommendations
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StyleQuiz;
