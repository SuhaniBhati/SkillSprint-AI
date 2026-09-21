import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Presentational drag-and-drop resume uploader. Purely controlled: the
 * selected File lives in the parent (GenerateReportForm) and is passed in
 * via `file`; this component only validates and reports intent upward.
 */
export default function ResumeUpload({ file, onFileSelect, onRemove, onError }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSelect = useCallback(
    (selected) => {
      if (!selected) return;
      onError?.(null);

      if (selected.type !== "application/pdf") {
        onError?.("Please upload your resume as a PDF file.");
        return;
      }
      if (selected.size > MAX_FILE_SIZE_BYTES) {
        onError?.(`Resume must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      onFileSelect(selected);
    },
    [onFileSelect, onError]
  );

  const handleBrowseClick = () => inputRef.current?.click();

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    validateAndSelect(dropped);
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(event) => validateAndSelect(event.target.files?.[0])}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      <AnimatePresence mode="wait" initial={false}>
        {file ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-2xl border border-[#EAA7C4]/60 bg-gradient-to-br from-[#970747]/[0.06] to-[#D65795]/[0.06] p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#970747] shadow-sm ring-1 ring-[#ECE5EA]">
              <FileText size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1F1F1F]">{file.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[#666666]">
                <CheckCircle2 size={12} className="text-[#34C759]" />
                {formatSize(file.size)} &bull; Ready to upload
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove resume"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#666666] transition hover:bg-white hover:text-[#FF3B30] focus:outline-none focus:ring-2 focus:ring-[#EAA7C4]"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            onClick={handleBrowseClick}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragEnter={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-9 text-center transition focus:outline-none focus:ring-4 focus:ring-[#EAA7C4]/30 ${
              isDragging
                ? "border-[#970747] bg-[#EAA7C4]/15"
                : "border-[#ECE5EA] bg-gradient-to-br from-[#FAF8FB] to-[#EAA7C4]/10 hover:border-[#D65795] hover:bg-[#EAA7C4]/10"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#970747] to-[#D65795] text-white shadow-sm">
              <UploadCloud size={22} />
            </div>
            <p className="text-sm font-semibold text-[#1F1F1F]">
              <span className="text-[#970747]">Choose Resume</span> or drag it here
            </p>
            <p className="text-xs text-[#666666]">PDF only &bull; Up to {MAX_FILE_SIZE_MB}MB</p>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}