import { useEffect, useRef, useState } from "react";
import functionPlot from "function-plot";
import { LineChart, X } from "lucide-react";

interface GraphPlotProps {
  plotFunction: string;
  plotDomain?: [number, number];
  title?: string;
}

export function GraphPlot({ plotFunction, plotDomain = [-10, 10], title }: GraphPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    try {
      // Clear previous graph
      containerRef.current.innerHTML = "";

      functionPlot({
        target: containerRef.current,
        width: 400,
        height: 300,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: plotDomain },
        grid: true,
        data: [
          {
            fn: plotFunction,
            color: "#8b5cf6", // Purple to match theme
          },
        ],
        tip: {
          xLine: true,
          yLine: true,
        },
      });

      setError(null);
    } catch (err) {
      console.error("Graph plotting error:", err);
      setError("Could not plot this function");
    }
  }, [isOpen, plotFunction, plotDomain]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors mt-1"
        title="View graph"
      >
        <LineChart className="w-3 h-3" />
        View Graph
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <div>
                <h3 className="font-mono text-sm font-medium">Graph</h3>
                {title && <p className="text-xs text-stone-500 mt-0.5">{title}</p>}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-stone-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Graph Container */}
            <div className="p-4">
              {error ? (
                <div className="text-center py-8 text-stone-500">
                  <p>{error}</p>
                  <p className="text-xs mt-1">Function: {plotFunction}</p>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="w-full flex items-center justify-center"
                />
              )}
            </div>

            {/* Function display */}
            <div className="px-4 pb-4">
              <div className="bg-stone-50 rounded-lg p-3 font-mono text-sm text-stone-700">
                f(x) = {plotFunction}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
