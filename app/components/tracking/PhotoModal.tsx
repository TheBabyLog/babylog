import { useFetcher } from "@remix-run/react";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { t } from "~/src/utils/translate";

interface DashboardPhotos {
  id: number;
  url: string;
  caption?: string;
  timestamp: Date;
  babyId: number;
}

interface PhotoModalProps {
  photo: DashboardPhotos;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (photoId: number) => void;
  babyId: number;
  isDeleting?: boolean;
}

export function PhotoModal({
  photo,
  isOpen,
  onClose,
  onDelete,
  babyId,
  isDeleting,
}: PhotoModalProps) {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(photo.caption || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (!isOpen) return null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    onDelete(photo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    fetcher.submit(
      { caption },
      {
        method: "PATCH",
        action: `/baby/${babyId}/photos/${photo.id}`,
      }
    );
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-transparent rounded-lg max-w-4xl w-full">
        <div className="absolute top-0 right-0 p-2 z-10">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="relative">
          <img
            src={photo.url}
            alt={caption || "Photo"}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSave}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Save className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <h3 className="text-white text-lg font-bold">
                  {caption || t("photoModal.untitled")}
                </h3>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-white">
          <p className="text-sm">
            {t("tracking.photo.uploaded")}: {formatDate(photo.timestamp)}
          </p>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                <Edit className="w-4 h-4" />
                <span>{t("photoModal.edit")}</span>
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>
                {isDeleting ? t("common.loading") : t("photoModal.delete")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
