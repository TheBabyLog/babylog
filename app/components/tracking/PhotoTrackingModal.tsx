import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { Loader2, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "~/src/utils/translate";
import { PhotoUploadField } from "./PhotoUploadField";

interface PhotoTrackingModalProps {
  babyId: number;
  error?: string | null;
}

export function PhotoTrackingModal({ babyId, error }: PhotoTrackingModalProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/baby/${babyId}`);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate, babyId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {t("tracking.photo.title")}
          </h2>
          <button
            onClick={() => navigate(`/baby/${babyId}`)}
            className="p-1 hover:bg-gray-800 rounded-full text-white"
            aria-label={t("modal.close")}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <Form method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label
              htmlFor="photo"
              className="block text-sm font-medium mb-1 text-white"
            >
              {t("tracking.photo.upload")}
            </label>
            <PhotoUploadField
              id="photo"
              name="photo"
              required
              accept="image/*"
              onFileChange={setPhotoFile}
              error={error}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="caption"
              className="block text-sm font-medium mb-1 text-white"
            >
              {t("tracking.photo.caption")}
            </label>
            <input
              id="caption"
              name="caption"
              type="text"
              placeholder={t("tracking.photo.captionPlaceholder")}
              className="w-full p-2 border rounded bg-black text-white"
            />
          </div>

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
              disabled={isSubmitting || !photoFile}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("modal.actions.save")}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
