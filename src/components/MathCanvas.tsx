import React from "react";
import { Tldraw, Editor, useEditor } from "tldraw";
import { useCallback, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import "tldraw/tldraw.css";

interface MathCanvasProps {
  onResult?: (result: MathResult) => void;
  onResults?: (results: MathResult[]) => void;
}

interface MathResult {
  expr: string;
  result: string;
  assign?: boolean;
}

function MathCanvas({ onResult, onResults }: MathCanvasProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: -20, y: -20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  interface APIErrorResponse {
    message: string;
    error: string;
    detail?: string;
  }
  const handleAPIError = (error: unknown) => {
    console.error("API Error:", error);
    let errorMessage = "An unexpected error occurred";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const data = error.response.data as APIErrorResponse;
        if (error.response.status === 500) {
          if (data.detail?.includes("UnboundLocalError: local variable")) {
            errorMessage =
              "Unable to process the mathematical expression. Please make sure your drawing is clear and try again.";
          } else {
            errorMessage = "Server error occurred. Please try again later.";
          }
        } else {
          errorMessage =
            data.message ||
            data.error ||
            "An error occurred while processing your request";
        }
      } else if (error.request) {
        errorMessage =
          "Unable to reach the server. Please check your internet connection.";
      }
    }
    toast.error("Error", { description: errorMessage, duration: 5000 });
  };

  const drawResult = (expr: string, answer: string) => {
    const canvas = resultCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "24px monospace";
    ctx.textBaseline = "top";
    const text = `${expr} = ${answer}`;
    ctx.fillText(text, 10, 10);
  };

  const handleSolveMath = useCallback(
    async (editor: Editor) => {
      try {
        setIsProcessing(true);

        const svg = await editor.getSvg(
          Array.from(editor.getCurrentPageShapeIds()),
        );
        if (!svg) {
          toast.error("Please draw an equation first");
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.naturalWidth || 800;
            canvas.height = img.naturalHeight || 600;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 0, 0);
            resolve();
          };
          img.onerror = reject;
          img.src =
            "data:image/svg+xml;base64," +
            btoa(new XMLSerializer().serializeToString(svg));
        });

        const response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_URL || "http://localhost:8900"}/calculate`,
          data: {
            image: canvas.toDataURL("image/png"),
            dict_of_vars: {},
          },
        });

        const result = response.data;

        let mathResult: MathResult | null = null;

        if (Array.isArray(result.data) && result.data.length > 0) {
          const errorExprs = [
            "API Configuration Error",
            "Response Parsing Error",
            "No Response",
            "No equation detected",
            "API Error",
          ];
          
          // Check if the first result is an error
          const first = result.data[0];
          if (errorExprs.includes(first.expr)) {
            toast.error(first.result);
            return;
          }
          
          if (result.data.length > 1) {
            const allResults = result.data.map((item: MathResult) => ({
              expr: item.expr || "Expression",
              result: String(item.result || "No result"),
              assign: item.assign || false,
            }));
            
            // Add all results to history
            onResults?.(allResults);
            
            // Show success message for multiple equations
            toast.success(`Solved ${allResults.length} equations successfully!`);
            
            // For backward compatibility, still call onResult with the first one
            mathResult = allResults[0];
          } else {
            mathResult = first;
          }
        } else if (result.expr && result.result) {
          mathResult = result;
        } else if (result.expression && result.answer) {
          mathResult = {
            expr: result.expression,
            result: result.answer,
            assign: result.assign || false,
          };
        } else if (result.answer || result.solution) {
          mathResult = {
            expr: result.expression || result.equation || "Expression",
            result: result.answer || result.solution,
            assign: result.assign || false,
          };
        } else if (typeof result === "object" && result !== null) {
          const expr =
            result.expr ||
            result.expression ||
            result.equation ||
            result.input ||
            "Unknown";
          const answer =
            result.result ||
            result.answer ||
            result.solution ||
            result.output ||
            result.value;

          if (answer) {
            mathResult = {
              expr: String(expr),
              result: String(answer),
              assign: result.assign || false,
            };
          }
        }

        if (mathResult) {
          console.log("Calling onResult with:", mathResult);
          onResult?.(mathResult);
          drawResult(mathResult.expr, mathResult.result);
          
          // Only show single success toast if we haven't already shown multi-equation toast
          if (!(Array.isArray(result.data) && result.data.length > 1)) {
            toast.success("Expression processed successfully!");
          }
          return;
        }

        if (result.status && result.status !== "success") {
          toast.error(result.message || "Unexpected response from server");
          return;
        }
        toast.warning("No expression detected. Please draw more clearly.");
        return;
      } catch (error: unknown) {
        handleAPIError(error);
        return;
      } finally {
        setIsProcessing(false);
      }
    },
    [onResult, onResults],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: toolbarPosition.x,
        initialY: toolbarPosition.y,
      };
    },
    [toolbarPosition],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      setToolbarPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY,
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragRef.current = null;
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const EsotericToolbar = () => {
    const editor = useEditor();

    return (
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          right: `${Math.max(20, -toolbarPosition.x)}px`,
          bottom: `${Math.max(20, -toolbarPosition.y)}px`,
          transform:
            toolbarPosition.x > 0 || toolbarPosition.y > 0
              ? `translate(${toolbarPosition.x}px, ${toolbarPosition.y}px)`
              : "none",
        }}
      >
        <div className="flex flex-col space-y-2 pointer-events-auto">
          <div
            className={`mx-auto w-8 h-8 bg-black/80 hover:bg-purple-900/90 border border-purple-500/50 rounded-full cursor-move transition-all duration-300 flex items-center justify-center ${isDragging ? "bg-purple-800/90 shadow-lg shadow-purple-500/20" : ""}`}
            onMouseDown={handleMouseDown}
            title="∞ Drag to transcend ∞"
          >
            <div className="text-purple-300 text-xs font-mono">⋮⋯⋮</div>
          </div>

          <div className="bg-black/95 backdrop-blur-sm border border-purple-500/30 rounded-lg p-2 sm:p-3 shadow-2xl shadow-purple-500/10 min-w-[140px] sm:min-w-[180px]">
            <div className="flex flex-col space-y-1.5 sm:space-y-2">
              <button
                onClick={() => {
                  const allShapes = Array.from(editor.getCurrentPageShapeIds());
                  editor.deleteShapes(allShapes);
                  toast.success("Canvas cleared");
                }}
                className="group relative bg-black hover:bg-gray-900 active:bg-gray-800 border border-gray-600 hover:border-red-500/50 text-white hover:text-red-300 px-2 py-1.5 sm:px-3 sm:py-2 rounded font-mono text-xs transition-all duration-200 overflow-hidden touch-manipulation"
              >
                <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center justify-center space-x-1 sm:space-x-2">
                  <span className="text-red-400">∅</span>
                  <span className="tracking-wider text-xs sm:text-xs">
                    RESET
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleSolveMath(editor)}
                disabled={isProcessing}
                className="group relative bg-black hover:bg-gray-900 active:bg-gray-800 border border-gray-600 hover:border-purple-500/50 text-white hover:text-purple-300 px-2 py-1.5 sm:px-3 sm:py-2 rounded font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden touch-manipulation"
              >
                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center justify-center space-x-1 sm:space-x-2">
                  <span className="text-purple-400">
                    {isProcessing ? "◯" : "∞"}
                  </span>
                  <span className="tracking-wider text-xs sm:text-xs">
                    {isProcessing ? "PROCESSING" : "SOLVE"}
                  </span>
                  {isProcessing && (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </button>

              <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs text-gray-400 pt-1 border-t border-gray-700/50">
                <div
                  className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${isProcessing ? "bg-purple-400 animate-pulse shadow-sm shadow-purple-400" : "bg-green-400"}`}
                ></div>
                <span className="font-mono tracking-wide text-xs">
                  {isProcessing ? "ANALYZING" : "READY"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ position: "fixed", top: "64px", left: 0, right: 0, bottom: 0 }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Tldraw>
          <EsotericToolbar />
        </Tldraw>
        <canvas
          ref={resultCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export default MathCanvas;
