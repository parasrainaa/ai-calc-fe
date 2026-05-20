import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StepByStepDisplayProps {
  steps: string[];
  className?: string;
}

export function StepByStepDisplay({ steps, className = "" }: StepByStepDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-3 h-3" />
            Hide steps
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3" />
            Show {steps.length} step{steps.length > 1 ? "s" : ""}
          </>
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2 pl-3 border-l-2 border-blue-200 space-y-1">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 text-sm text-stone-600">
              <span className="font-mono text-xs text-stone-400 select-none">
                {index + 1}.
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
