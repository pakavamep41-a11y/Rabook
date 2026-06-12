import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, File as FileIcon, X, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { toPersianDigits } from "../../lib/persian";

interface FileUploadFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  accept?: string; // e.g. "image/*,.pdf"
  maxSizeMB?: number;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export function FileUploadField({
  label,
  hint,
  error,
  accept,
  maxSizeMB = 5,
  onFileSelect,
  className
}: FileUploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // simulation
  const [localError, setLocalError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (f: File) => {
    setLocalError("");
    if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`حجم فایل نباید بیشتر از ${toPersianDigits(maxSizeMB.toString())} مگابایت باشد.`);
      return;
    }
    setFile(f);
    onFileSelect(f);

    // Simulate progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 20;
      });
    }, 100);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayError = error || localError;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-sm font-medium text-text-base">{label}</span>}
      
      {!file ? (
        <div
          className={cn(
            "relative w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-colors",
            dragActive ? "border-primary-500 bg-primary-50" : "border-surface-border bg-surface-base hover:bg-surface-hover",
            displayError && "border-danger-base bg-danger-base/5"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
          <UploadCloud className={cn("w-8 h-8 mb-2", dragActive ? "text-primary-600" : "text-text-muted")} />
          <p className="text-sm text-text-base font-medium">فایل خود را اینجا رها کنید یا کلیک کنید</p>
          <p className="text-xs text-text-muted mt-1">حداکثر حجم: {toPersianDigits(maxSizeMB.toString())} مگابایت</p>
        </div>
      ) : (
        <div className="w-full rounded-xl border border-surface-border bg-surface-base p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center shrink-0">
               {file.type.startsWith('image/') ? (
                 <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-lg" />
               ) : (
                 <FileIcon className="w-5 h-5 text-text-muted" />
               )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
               <span className="text-sm font-medium text-text-base truncate">{file.name}</span>
               <div className="w-full h-1.5 bg-surface-muted rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
               </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={removeFile}
            className="p-2 ml-2 rounded-md hover:bg-surface-hover text-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {displayError && <span className="text-xs text-danger-base mt-0.5">{displayError}</span>}
      {hint && !displayError && <span className="text-xs text-text-muted mt-0.5">{hint}</span>}
    </div>
  );
}

// Simple Jalali Date Picker mockup for UI kit purposes
export function JalaliDatePicker({ label, className }: { label?: string; className?: string }) {
  const [value, setValue] = useState("");
  // In a real app we'd use a library like react-multi-date-picker
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-sm font-medium text-text-base">{label}</span>}
      <div className="relative">
        <input 
          type="text" 
          placeholder="مثلاً 1403/05/12"
          className="flex h-10 w-full rounded-lg border border-surface-border bg-surface-base px-3 py-2 pr-10 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          dir="ltr"
        />
        <CalendarIcon className="w-4 h-4 text-text-muted absolute mt-auto mb-auto top-0 bottom-0 right-3" />
      </div>
    </div>
  );
}
