import { useState } from "react";
import MathCanvas from "@/components/MathCanvas";
import { ArrowLeft, History, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MathResult {
  expr: string;
  result: string;
  assign?: boolean;
}

function MathApp() {
  const [results, setResults] = useState<MathResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  const handleResult = (result: MathResult) => {
    setResults((prev) => [result, ...prev]);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="h-screen bg-black relative">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-stone-900/90 backdrop-blur-sm border-b border-stone-700/50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors text-stone-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-mono text-lg font-medium text-stone-100">
              MathDraw
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors text-stone-300"
            >
              <History className="w-4 h-4" />
              <span className="text-sm">Solutions ({results.length})</span>
            </button>
          </div>
        </div>
      </div>

      <MathCanvas onResult={handleResult} />

      {showHistory && (
        <div className="absolute top-20 right-4 w-80 max-h-[calc(100vh-100px)] bg-white rounded-xl shadow-2xl border border-stone-200 z-30">
          <div className="p-4 border-b border-stone-200">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-medium">
                Solution History
              </h2>
              <div className="flex items-center space-x-2">
                {results.length > 0 && (
                  <button
                    onClick={clearResults}
                    className="text-xs text-stone-500 hover:text-stone-700"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-stone-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-96 p-4">
            <div className="space-y-3">
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-stone-400 text-lg">∑</span>
                  </div>
                  <p className="text-sm text-stone-500">No solutions yet</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Draw an equation and click "Solve Math"
                  </p>
                </div>
              ) : (
                results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-stone-50 rounded-lg p-3 border border-stone-200 hover:bg-stone-100 transition-colors"
                  >
                    <div className="font-mono text-sm mb-1 text-stone-600">
                      {result.expr}
                    </div>
                    <div className="font-mono text-lg font-medium text-stone-900">
                      = {result.result}
                    </div>
                    {result.assign && (
                      <div className="text-xs text-stone-500 mt-1">
                        Variable assigned
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-stone-200 bg-stone-50 rounded-b-xl">
            <div className="text-xs text-stone-600 space-y-1">
              <p className="font-medium">💡 Tips:</p>
              <p>• Use pen tool for handwriting</p>
              <p>• Try drawing: 2+3, x²+5x=0, √16</p>
              <p>• Zoom in for better precision</p>
            </div>
          </div>
        </div>
      )}
      {results.length > 0 && !showHistory && (
        <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg border border-stone-200 p-4 z-20 min-w-64">
          <div className="text-xs text-stone-500 mb-1">Latest Solution:</div>
          <div className="font-mono text-sm text-stone-600 mb-1">
            {results[0].expr}
          </div>
          <div className="font-mono text-xl font-bold text-stone-900">
            = {results[0].result}
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="text-xs text-blue-600 hover:text-blue-700 mt-2"
          >
            View all solutions →
          </button>
        </div>
      )}
    </div>
  );
}

export default MathApp;
