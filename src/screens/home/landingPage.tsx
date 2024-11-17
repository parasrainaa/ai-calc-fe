import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, 
  PenLine, 
  Calculator, 
  Sparkles,
  Brain,
  Github,
  Menu
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const LandingPage = () => {
  const navigation = [
    { name: 'Features', href: '#features' },
    // { name: 'Demo', href: '#demo' },
    { name: 'GitHub', href: 'https://github.com/ParasRaina01/ai' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Calculator className="w-6 h-6 text-purple-400" />
              <span className="font-bold text-lg hidden sm:inline">MathDraw</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => window.location.href = '/app'}
              >
                Try Now
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-900 border-gray-800">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                      >
                        {item.name}
                      </a>
                    ))}
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                      onClick={() => window.location.href = '/app'}
                    >
                      Try Now
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 lg:pt-40 pb-20 lg:pb-32">
        <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
          <div className="inline-block animate-bounce bg-purple-500/10 rounded-full p-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 px-4 leading-tight">
            Draw Math, Get Answers
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 px-4">
            Transform your handwritten mathematical expressions into instant solutions. 
            Just draw, click, and watch the magic happen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 px-4">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
              onClick={() => window.location.href = '/app'}
            >
              Try It Now
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-600 text-purple-400 hover:bg-purple-600/10 w-full sm:w-auto"
              onClick={() => window.location.href = 'https://github.com/yourusername/your-repo'}
            >
              <Github className="mr-2 w-4 h-4" />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-900/50 py-16 lg:py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-500/10 w-12 h-12 flex items-center justify-center mb-4">
                  <PenLine className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Natural Drawing</h3>
                <p className="text-gray-400">
                  Draw mathematical expressions as naturally as you would on paper. 
                  Our app recognizes your handwriting in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-500/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Solutions</h3>
                <p className="text-gray-400">
                  Get immediate results for your mathematical expressions, 
                  from simple arithmetic to complex calculations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-500/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Recognition</h3>
                <p className="text-gray-400">
                  Powered by AI, our app accurately recognizes 
                  and interprets your mathematical expressions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      {/* <div id="demo" className="container mx-auto px-4 py-16 lg:py-24 scroll-mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 px-4">See It In Action</h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-4">
            Watch how easily you can solve mathematical problems with just a few strokes.
          </p>
        </div>
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <img 
              src="/api/placeholder/800/450" 
              alt="Math Recognition Demo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="bg-gradient-to-t from-purple-900/20 to-transparent">
        <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 px-4">
            Ready to Transform Your Math Experience?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto px-4">
            Join today to use our tool to solve mathematical expressions effortlessly.
          </p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            onClick={() => window.location.href = '/app'}
          >
            Start Drawing Now
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} MathDraw. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;