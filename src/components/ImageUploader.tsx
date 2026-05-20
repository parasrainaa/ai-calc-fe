import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Upload, X, Image as ImageIcon, Clipboard, Camera } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
  isProcessing?: boolean;
}

export function ImageUploader({ onImageUpload, isProcessing = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewImage(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleFile(file);
          break;
        }
      }
    }
  }, [handleFile]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste, isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPreviewImage(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (previewImage) {
      onImageUpload(previewImage);
      handleClose();
    }
  }, [previewImage, onImageUpload, handleClose]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <>
      {/* Upload Button */}
      <button
        onClick={handleOpen}
        className="flex items-center space-x-2 px-3 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors text-stone-300"
        title="Upload image of math problem"
      >
        <Camera className="w-4 h-4" />
        <span className="text-sm hidden sm:inline">Upload</span>
      </button>

      {/* Modal */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <h3 className="font-mono text-sm font-medium">Upload Math Problem</h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-stone-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {previewImage ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full shadow"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-mono text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Processing..." : "Solve Math Problem"}
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                    ${isDragging 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-stone-300 hover:border-stone-400 hover:bg-stone-50"
                    }
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Upload className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                  <p className="text-stone-600 font-medium mb-1">
                    Drop an image here or click to upload
                  </p>
                  <p className="text-stone-400 text-sm">
                    Or press <kbd className="px-1 py-0.5 bg-stone-200 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-stone-200 rounded text-xs">V</kbd> to paste
                  </p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="px-4 pb-4">
              <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" />
                  <span>Supports: PNG, JPG, JPEG, WebP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clipboard className="w-3 h-3" />
                  <span>Paste screenshots directly from clipboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
