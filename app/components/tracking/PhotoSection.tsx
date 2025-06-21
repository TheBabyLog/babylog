import { useState, useEffect } from "react";
import { ArrowUpDown, PlusIcon } from "lucide-react";
import { PhotoModal } from "./PhotoModal";
import { Link, useFetcher } from "@remix-run/react";
import { t } from "~/src/utils/translate";

interface DashboardPhotos {
  id: number;
  url: string;
  caption?: string;
  timestamp: Date;
  babyId: number;
}

interface CurrentSort {
  sortBy: "newest" | "oldest" | "random";
  limit: number;
  showCaption: boolean;
}

interface PhotoSectionProps {
  photos: DashboardPhotos[];
  babyId: number;
  sortBy: "newest" | "oldest" | "random";
  limit: number;
  showCaption: boolean;
}

export function PhotoSection({
  photos,
  babyId,
  sortBy,
  limit,
  showCaption,
}: PhotoSectionProps) {
  const fetcher = useFetcher();
  const [currentSort, setCurrentSort] = useState<CurrentSort>({
    sortBy,
    limit,
    showCaption,
  });

  const [selectedPhoto, setSelectedPhoto] = useState<DashboardPhotos | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSort = () => {
    setCurrentSort((prev) => ({
      ...prev,
      sortBy: prev.sortBy === "newest" ? "oldest" : "newest",
    }));
  };

  const handlePhotoClick = (photo: DashboardPhotos) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (window.confirm(t("photoModal.deleteConfirmation"))) {
      fetcher.submit(
        { photoId: photoId.toString() },
        { method: "DELETE", action: `/baby/${babyId}/photos/${photoId}` }
      );
      handleCloseModal();
    }
  };

  // Close modal and refresh data when delete action is complete
  useEffect(() => {
    const isSuccess =
      fetcher.state === "idle" &&
      fetcher.data &&
      typeof fetcher.data === "object" &&
      "success" in fetcher.data &&
      (fetcher.data as any).success;
    if (isSuccess) {
      handleCloseModal();
    }
  }, [fetcher.state, fetcher.data]);

  const sortedPhotos = photos.sort((a, b) => {
    if (currentSort.sortBy === "newest") {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else if (currentSort.sortBy === "oldest") {
      return a.timestamp.getTime() - b.timestamp.getTime();
    }
    return 0; // Default case
  });

  // Get the first photo for the featured display
  const featuredPhoto = sortedPhotos.length > 0 ? sortedPhotos[0] : null;
  // Get the next 4 photos for the smaller grid
  const smallerPhotos = sortedPhotos.slice(1, 5);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {t("baby.recent.photos")}
        </h2>
        <div className="flex items-center gap-4">
          <Link
            to={`/baby/${babyId}/track/photo`}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Add photo"
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <Link
            to={`/baby/${babyId}/photos`}
            className="text-blue-500 hover:underline text-sm"
          >
            {t("baby.recent.viewAll")}
          </Link>
        </div>
      </div>

      {/* Photo Gallery Section */}
      {photos.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Featured Photo with Sort Control */}
          {featuredPhoto && (
            <div className="md:w-1/2">
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                  aria-label="Toggle sort order"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>
                    {currentSort.sortBy === "newest"
                      ? t("tracking.photo.sort.newest")
                      : t("tracking.photo.sort.oldest")}
                  </span>
                </button>
              </div>
              <div
                className="relative aspect-square w-full overflow-hidden rounded-lg cursor-pointer"
                onClick={() => handlePhotoClick(featuredPhoto)}
              >
                <img
                  src={featuredPhoto.url}
                  alt={featuredPhoto.caption || "Featured photo"}
                  className="w-full h-full object-cover"
                />
                {showCaption && featuredPhoto.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    {featuredPhoto.caption}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smaller Photos Grid */}
          {smallerPhotos.length > 0 && (
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-2 h-full">
                {smallerPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "Photo"}
                      className="w-full h-full object-cover"
                    />
                    {showCaption && photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          {t("baby.recent.noData.photos")}
        </p>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDeletePhoto}
          babyId={babyId}
        />
      )}
    </div>
  );
}
