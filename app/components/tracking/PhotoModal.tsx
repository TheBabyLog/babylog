import { Link } from "@remix-run/react";
import { Edit, Trash2 } from "lucide-react";
import { useEffect } from "react";
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
}

export function PhotoModal({
  photo,
  isOpen,
  onClose,
  onDelete,
  babyId,
}: PhotoModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <img
            src={photo.url}
            alt={photo.caption || "Photo"}
            className="w-full h-auto rounded-lg"
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t("tracking.photo.uploaded")}:</span>{" "}
            {formatDate(photo.timestamp)}
          </p>
          {photo.caption && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">
                {t("tracking.photo.caption")}:
              </span>{" "}
              {photo.caption}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Link
            to={`/baby/${babyId}/edit/photo/${photo.id}`}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Edit className="w-4 h-4" />
            <span>{t("photoModal.edit")}</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t("photoModal.delete")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
