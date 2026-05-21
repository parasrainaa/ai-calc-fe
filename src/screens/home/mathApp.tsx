import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import MathCanvas from "@/components/MathCanvas";
import { ArrowLeft, History, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LaTexRenderer, toLatex } from "@/components/LaTexRenderer";
import { StepByStepDisplay } from "@/components/StepByStepDisplay";
import { ImageUploader } from "@/components/ImageUploader";
import { GraphPlot } from "@/components/GraphPlot";
import type { MathResult, DictOfVars } from "@/types";

const getCalculateUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }

  return `${apiUrl.replace(/\/+$/, "")}/calculate`;
};

function MathApp() {
  const [results, setResults] = useState<MathResult[]>([]);
  const [dictOfVars, setDictOfVars] = useState<DictOfVars>({});
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Extract variable value from result string like "x = 5" or "5"
  const extractVarValue = useCallback((_expr: string, result: string): number | null => {
    // First try to extract from result like "x = 5" → 5
    const assignMatch = result.match(/=\s*(-?[\d.]+)/);
    if (assignMatch) {
      return parseFloat(assignMatch[1]);
    }
    // If result is just a number
    const numMatch = result.match(/^(-?[\d.]+)$/);
    if (numMatch) {
      return parseFloat(numMatch[1]);
    }
    return null;
  }, []);

  const handleResult = useCallback((result: MathResult) => {
    setResults((prev) => [result, ...prev]);

    // If this is an assignment, store the variable
    if (result.assign && result.expr) {
      const varName = result.expr.trim();
      const value = extractVarValue(result.expr, result.result);
      if (value !== null && varName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        setDictOfVars((prev) => ({ ...prev, [varName]: value }));
      }
    }
  }, [extractVarValue]);

  const handleResults = useCallback((newResults: MathResult[]) => {
    setResults((prev) => [...newResults, ...prev]);

    // Extract all variable assignments
    newResults.forEach((result) => {
      if (result.assign && result.expr) {
        const varName = result.expr.trim();
        const value = extractVarValue(result.expr, result.result);
        if (value !== null && varName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
          setDictOfVars((prev) => ({ ...prev, [varName]: value }));
        }
      }
    });
  }, [extractVarValue]);

  const clearResults = () => {
    setResults([]);
    setDictOfVars({});
  };

  const handleImageUpload = useCallback(async (imageData: string) => {
    try {
      setIsProcessing(true);

      const response = await axios({
        method: "post",
        url: getCalculateUrl(),
        data: {
          image: imageData,
          dict_of_vars: dictOfVars,
        },
      });

      const result = response.data;

      if (Array.isArray(result.data) && result.data.length > 0) {
        const allResults = result.data.map((item: MathResult) => ({
          expr: item.expr || "Expression",
          result: String(item.result || "No result"),
          assign: item.assign || false,
          steps: item.steps,
          graphable: item.graphable || false,
          plotFunction: item.plotFunction,
          plotDomain: item.plotDomain,
        }));

        handleResults(allResults);
        toast.success(`Solved ${allResults.length} equation(s) from image!`);
      } else {
        toast.warning("No equations detected in the image. Try a clearer photo.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error ||
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to process image. Please try again."
        : error instanceof Error
          ? error.message
        : "Failed to process image. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [dictOfVars, handleResults]);

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
            <ImageUploader onImageUpload={handleImageUpload} isProcessing={isProcessing} />
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

      <MathCanvas onResult={handleResult} onResults={handleResults} dictOfVars={dictOfVars} />

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
                    <LaTexRenderer
                      latex={toLatex(result.expr, result.result)}
                      displayMode={true}
                      className="text-base"
                      showCopy={true}
                    />
                    {result.assign && (
                      <div className="text-xs text-stone-500 mt-1">
                        Variable assigned
                      </div>
                    )}
                    {result.steps && result.steps.length > 0 && (
                      <StepByStepDisplay steps={result.steps} />
                    )}
                    {result.graphable && result.plotFunction && (
                      <GraphPlot
                        plotFunction={result.plotFunction}
                        plotDomain={result.plotDomain}
                        title={result.expr}
                      />
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
          <div className="text-lg">
            <LaTexRenderer
              latex={toLatex(results[0].expr, results[0].result)}
              displayMode={true}
              className="my-2"
            />
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
