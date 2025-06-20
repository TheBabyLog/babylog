import { useState, useCallback } from "react";
import { t } from "~/src/utils/translate";

interface PhotoUploadFieldProps {
  id: string;
  name: string;
  required?: boolean;
  accept?: string;
  onFileChange: (file: File | null) => void;
  error?: string | null;
}

export function PhotoUploadField({
  id,
  name,
  required,
  accept,
  onFileChange,
  error,
}: PhotoUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const validateAndSetFile = (file: File | null, input: HTMLInputElement) => {
    onFileChange(file);
    setInternalError(null);
    input.setCustomValidity("");

    if (file) {
      if (
        accept &&
        !accept
          .split(",")
          .some((type) => file.type.startsWith(type.trim().replace("*", "")))
      ) {
        setInternalError(t("form.errors.invalidFileType"));
        input.setCustomValidity(t("form.errors.invalidFileType"));
        setPreviewUrl(null);
        input.value = "";
        onFileChange(null);
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file, e.currentTarget);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        const file = e.dataTransfer.files[0] || null;
        if (file) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
        }
        validateAndSetFile(file, input);
      }
    },
    [id, accept]
  );

  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valueMissing) {
      setInternalError(t("form.errors.noFileSelected"));
      e.currentTarget.setCustomValidity(t("form.errors.noFileSelected"));
    }
  };

  const currentError = error || internalError;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : currentError
            ? "border-red-500"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => document.getElementById(id)?.click()}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors"
          >
            {t("tracking.chooseFile")}
          </button>
          <span className="text-gray-500 text-sm">
            {t("tracking.dragAndDrop")}
          </span>
          <input
            id={id}
            name={name}
            type="file"
            className="hidden"
            required={required}
            accept={accept}
            onChange={handleFileChange}
            onInvalid={handleInvalid}
          />
        </div>
        {previewUrl && (
          <div className="mt-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs mx-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
      {currentError && (
        <p className="text-red-500 text-sm mt-1">{currentError}</p>
      )}
    </div>
  );
}
