import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LaTexRendererProps {
  latex: string;
  className?: string;
  displayMode?: boolean;
}

export function LaTexRenderer({ latex, className = '', displayMode = false }: LaTexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode,
          throwOnError: false,
          strict: false,
        });
      } catch (error) {
        console.warn('LaTeX rendering error:', error);
        // Fallback to plain text if LaTeX fails
        if (containerRef.current) {
          containerRef.current.textContent = latex;
        }
      }
    }
  }, [latex, displayMode]);

  return <div ref={containerRef} className={className} />;
}

// Helper function to convert mathematical expressions to LaTeX
export function toLatex(expression: string, result: string): string {
  // Basic conversion for common mathematical operations
  let latexExpr = expression
    .replace(/\*/g, ' \\cdot ')
    .replace(/\^(\w+)/g, '^{$1}')  // Better exponent handling
    .replace(/\^(\d+)/g, '^{$1}')  // Handle numeric exponents
    .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')  // Handle sqrt with content
    .replace(/sin\(/g, '\\sin(')
    .replace(/cos\(/g, '\\cos(')
    .replace(/tan\(/g, '\\tan(')
    .replace(/log\(/g, '\\log(')
    .replace(/ln\(/g, '\\ln(')
    .replace(/pi/g, '\\pi')
    .replace(/infinity/g, '\\infty')
    .replace(/alpha/g, '\\alpha')
    .replace(/beta/g, '\\beta')
    .replace(/gamma/g, '\\gamma')
    .replace(/delta/g, '\\delta')
    .replace(/theta/g, '\\theta');

  // Handle fractions (improved pattern)
  latexExpr = latexExpr.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
  latexExpr = latexExpr.replace(/(\w+)\/(\w+)/g, '\\frac{$1}{$2}');

  // Handle subscripts
  latexExpr = latexExpr.replace(/_(\w+)/g, '_{$1}');
  latexExpr = latexExpr.replace(/_(\d+)/g, '_{$1}');

  // Clean up any double spaces
  latexExpr = latexExpr.replace(/\s+/g, ' ').trim();

  return `${latexExpr} = ${result}`;
}
