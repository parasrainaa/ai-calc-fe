import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  PenTool,
  Lightbulb,
  Github,
  Menu,
  Circle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const navigation = [
    { name: "About", href: "#about" },
    { name: "GitHub", href: "https://github.com/ParasRaina01/ai-calc-fe" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-32 h-32 rounded-full bg-amber-200/20 blur-xl transition-all duration-1000 ease-out"
          style={{
            left: mousePos.x - 64,
            top: mousePos.y - 64,
          }}
        />
        <div className="absolute top-1/4 left-1/4 text-6xl text-stone-200 font-light select-none">
          ∑
        </div>
        <div className="absolute top-1/3 right-1/4 text-4xl text-stone-200 font-light select-none rotate-12">
          ∞
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-5xl text-stone-200 font-light select-none">
          π
        </div>
        <div className="absolute top-1/2 right-1/3 text-3xl text-stone-200 font-light select-none -rotate-12">
          ∂
        </div>
      </div>
      <nav className="fixed top-0 w-full bg-stone-50/90 backdrop-blur-sm z-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-stone-900 rounded-sm flex items-center justify-center">
                <PenTool className="w-4 h-4 text-stone-50" />
              </div>
              <span className="font-mono text-xl font-medium tracking-tight">
                MathDraw
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-stone-600 hover:text-stone-900 transition-colors font-mono text-sm tracking-wide"
                >
                  {item.name}
                </a>
              ))}
              <Button
                className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono px-6 rounded-none"
                onClick={() => navigate("/app")}
              >
                Launch App
              </Button>
            </div>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-stone-50 border-stone-200">
                  <div className="flex flex-col space-y-6 mt-12">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-stone-600 hover:text-stone-900 transition-colors font-mono"
                      >
                        {item.name}
                      </a>
                    ))}
                    <Button
                      className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono rounded-none"
                      onClick={() => navigate("/app")}
                    >
                      Launch App
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="font-mono text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-sm">
                    v2.0 • AI-Powered
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-light leading-[0.9] tracking-tight">
                  <span className="block">Mathematical</span>
                  <span className="block italic font-extralight text-stone-600">
                    expression
                  </span>
                  <span className="block font-medium">recognition</span>
                </h1>

                <p className="text-xl text-stone-600 leading-relaxed max-w-lg font-light">
                  Transform handwritten equations into digital solutions.
                  <span className="text-stone-900 font-medium">
                    {" "}
                    Draw naturally, solve instantly.
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono px-8 py-4 rounded-none group"
                  onClick={() => navigate("/app")}
                >
                  Try Now
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-stone-300 text-stone-700 hover:bg-stone-100 font-mono px-8 py-4 rounded-none"
                  onClick={() =>
                    window.open(
                      "https://github.com/ParasRaina01/ai-calc-fe",
                      "_blank",
                    )
                  }
                >
                  <Github className="mr-2 w-4 h-4" />
                  Source Code
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border-2 border-stone-200 p-8 relative">
                <div className="aspect-[4/3] bg-stone-50 border border-stone-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-light text-stone-400 font-mono">
                        2x + 5 = 13
                      </div>
                      <div className="w-16 h-px bg-stone-300 mx-auto"></div>
                      <div className="text-2xl font-medium text-stone-600 font-mono">
                        x = 4
                      </div>
                    </div>
                  </div>

                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 50 120 Q 100 80 150 120 Q 200 160 250 120"
                      stroke="#a8a29e"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="200"
                      strokeDashoffset="200"
                      className="animate-pulse"
                    />
                  </svg>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono text-stone-500">
                    Ready to solve
                  </span>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-amber-300 rotate-45"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-stone-900 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center">
                <PenTool className="w-6 h-6 text-stone-700" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Natural Input</h3>
                <p className="text-stone-600 leading-relaxed">
                  Write equations as you naturally would on paper. Our interface
                  captures every stroke with precision.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-stone-700" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Instant Recognition</h3>
                <p className="text-stone-600 leading-relaxed">
                  Advanced AI interprets your handwriting and converts it to
                  computational solutions in real-time.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-stone-100 flex items-center justify-center">
                <Circle className="w-6 h-6 text-stone-700" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Accurate Results</h3>
                <p className="text-stone-600 leading-relaxed">
                  From basic arithmetic to complex calculus, get precise
                  solutions for any mathematical expression.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-900 text-stone-50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-light leading-tight">
              Start solving equations
              <span className="block italic font-extralight text-stone-300">
                the natural way
              </span>
            </h2>

            <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Sketch, type, or draw your equations however feels natural. Write
              equations the way you think about them, not the way computers want
              them.
            </p>

            <Button
              size="lg"
              className="bg-stone-50 hover:bg-stone-100 text-stone-900 font-mono px-10 py-4 rounded-none"
              onClick={() => navigate("/app")}
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-stone-50 border-t border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-stone-900 rounded-sm flex items-center justify-center">
                <PenTool className="w-3 h-3 text-stone-50" />
              </div>
              <span className="font-mono text-stone-600">MathDraw</span>
            </div>
            <div className="text-stone-500 text-sm font-mono">
              Made by Paras
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
