import { Form, useNavigate } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "~/src/utils/translate";

interface Field {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "datetime-local" | "file";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  accept?: string;
}

interface TrackingModalProps {
  babyId: number;
  title: string;
  fields: Field[];
  multipart?: boolean;
}

export function TrackingModal({
  babyId,
  title,
  fields,
  multipart,
}: TrackingModalProps) {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/baby/${babyId}`);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate, babyId]);

  // Add style for file input button text
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      input[type="file"]::-webkit-file-upload-button {
        margin-right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        border: 0;
        font-size: 0.875rem;
        font-weight: 600;
        background-color: rgb(239 246 255);
        color: rgb(29 78 216);
      }
      input[type="file"]::-webkit-file-upload-button:hover {
        background-color: rgb(219 234 254);
      }
      input[type="file"]::file-selector-button {
        margin-right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        border: 0;
        font-size: 0.875rem;
        font-weight: 600;
        background-color: rgb(239 246 255);
        color: rgb(29 78 216);
      }
      input[type="file"]::file-selector-button:hover {
        background-color: rgb(219 234 254);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const inputClasses =
    "w-full p-2 border rounded bg-black text-white [&>option]:text-black";
  const labelClasses = "block text-sm font-medium mb-1 text-white";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            id={field.id}
            name={field.id}
            className={inputClasses}
            required={field.required}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            id={field.id}
            name={field.id}
            className={inputClasses}
            rows={3}
            placeholder={field.placeholder}
          />
        );
      case "file":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById(field.id)?.click()}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors"
              >
                {t("tracking.chooseFile")}
              </button>
              <span className="text-gray-400 text-sm truncate">
                {previewUrl
                  ? previewUrl.split("/").pop()
                  : t("tracking.noFileSelected")}
              </span>
              <input
                id={field.id}
                name={field.id}
                type="file"
                className="hidden"
                required={field.required}
                accept={field.accept}
                onChange={handleFileChange}
              />
            </div>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-xs rounded"
                />
              </div>
            )}
          </div>
        );
      default:
        return (
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            className={inputClasses}
            required={field.required}
            placeholder={field.placeholder}
            defaultValue={
              field.type === "datetime-local"
                ? new Date().toISOString().slice(0, 16)
                : undefined
            }
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={() => navigate(`/baby/${babyId}`)}
            className="p-1 hover:bg-gray-800 rounded-full text-white"
            aria-label={t("modal.close")}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <Form
          method="post"
          encType={
            multipart
              ? "multipart/form-data"
              : "application/x-www-form-urlencoded"
          }
        >
          {fields.map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className={labelClasses}>
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/baby/${babyId}`)}
              className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded"
            >
              {t("modal.actions.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t("modal.actions.save")}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
