import { Link } from "@remix-run/react";
import { PlusIcon, PencilIcon } from "lucide-react";
import { t } from "~/src/utils/translate";
import { getRelativeTime } from "~/src/utils/date";

interface TrackingEvent {
  id: number;
  type: string;
  timestamp?: Date;
  startTime?: Date;
  weight?: number | null;
  amount?: number | null;
  quality?: number | null;
  url?: string | null;
  caption?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  // Additional feeding fields
  side?: string | null;
  food?: string | null;
}

interface TrackingSectionProps {
  title: string;
  events: TrackingEvent[];
  babyId: number;
  trackingType: "elimination" | "feeding" | "sleep" | "photo";
  renderEventDetails?: (event: TrackingEvent) => React.ReactNode;
}

export function TrackingSection({
  title,
  events,
  babyId,
  trackingType,
  renderEventDetails,
}: TrackingSectionProps) {
  const getTranslatedType = (type: string) => {
    return t(`tracking.${trackingType}.types.${type}`);
  };

  // Custom render function for feeding details
  const renderFeedingDetails = (event: TrackingEvent) => {
    const details = [];

    if (event.amount) {
      details.push(`${t("baby.details.amount")}: ${event.amount}ml`);
    }

    // Show side for breast feedings
    if (event.type === "breast" && event.side) {
      details.push(
        `${t("tracking.feeding.side")}: ${t(
          `tracking.feeding.sides.${event.side}`
        )}`
      );
    }

    // Show food for solid feedings
    if (event.type === "solid" && event.food) {
      details.push(`${t("tracking.feeding.food")}: ${event.food}`);
    }

    if (details.length > 0) {
      return <div className="text-sm text-gray-600">{details.join(" • ")}</div>;
    }

    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <Link
            to={`/baby/${babyId}/track/${trackingType}`}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label={`Add ${trackingType}`}
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <Link
            to={`/baby/${babyId}/${trackingType}s`}
            className="text-blue-500 hover:underline"
          >
            {t("baby.recent.viewAll")}
          </Link>
        </div>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-500">
          {t(`baby.recent.noData.${trackingType}s`)}
        </p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => {
            const eventDate = new Date(event.timestamp || event.startTime!);
            const dayIndicator = getRelativeTime(eventDate);

            return (
              <li key={event.id} className="border-b pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-500">
                        {getTranslatedType(event.type)}
                      </span>
                      <div className="text-right">
                        <span className="text-gray-500">
                          {eventDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <div className="text-xs text-gray-400">
                          {dayIndicator}
                        </div>
                      </div>
                    </div>
                    {trackingType === "feeding"
                      ? renderFeedingDetails(event)
                      : renderEventDetails && renderEventDetails(event)}
                  </div>
                  <Link
                    to={`/baby/${babyId}/edit/${trackingType}/${event.id}`}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100"
                    aria-label={`Edit ${trackingType}`}
                  >
                    <PencilIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
