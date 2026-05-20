import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LaTexRendererProps {
  latex: string;
  className?: string;
  displayMode?: boolean;
  showCopy?: boolean;
}

export function LaTexRenderer({ latex, className = '', displayMode = false, showCopy = false }: LaTexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <div ref={containerRef} className={className} />
      {showCopy && (
        <button
          onClick={handleCopy}
          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs px-1.5 py-0.5 rounded border border-stone-300"
          title="Copy LaTeX"
        >
          {copied ? '✓' : 'Copy'}
        </button>
      )}
    </div>
  );
}

// Standalone copy button for use in other components
interface CopyLatexButtonProps {
  latex: string;
  className?: string;
}

export function CopyLatexButton({ latex, className = '' }: CopyLatexButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs text-stone-500 hover:text-stone-700 transition-colors ${className}`}
      title="Copy LaTeX to clipboard"
    >
      {copied ? '✓ Copied!' : '📋 Copy LaTeX'}
    </button>
  );
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
