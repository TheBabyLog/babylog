import { useState } from "react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { getRecentTrackingEvents } from "~/.server/tracking";
import { PlusIcon } from "lucide-react";
import AddCaregiverModal from "~/components/AddCaregiverModal";
import { t } from "~/src/utils/translate";
import { LanguageSelector } from "~/components/LanguageSelector";
import { TrackingSection } from "~/components/tracking/TrackingSection";

interface Caregiver {
  userId: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface Baby {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string | null;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  caregivers: Caregiver[];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const baby = await getBaby(Number(params.id), {
    include: {
      caregivers: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!baby) return redirect("/dashboard");

  const isAuthorized =
    baby.ownerId === userId ||
    (baby as Baby).caregivers.some((c: Caregiver) => c.userId === userId);

  if (!isAuthorized) return redirect("/dashboard");

  const { eliminations, feedings, sleepSessions } =
    await getRecentTrackingEvents(request, baby.id);

  return { baby, eliminations, feedings, sleepSessions };
}

export default function BabyDetails() {
  const { baby, eliminations, feedings, sleepSessions } =
    useLoaderData<typeof loader>();
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);

  const caregivers = (baby as Baby).caregivers
    .map((c: Caregiver) => `${c.user.firstName} ${c.user.lastName}`)
    .join(", ");

    return (
      <> 
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {baby.firstName} {baby.lastName}
          </h1>
          <div className="flex items-centered gap-3">
            <span className="text-lg font-normal text-gray-600">
            {t("baby.caregivers")}: {caregivers}
            </span>
          <button
            onClick={() => setShowCaregiverModal(true)}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Add caregiver"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">
              {t("settings.language")}:
            </span>
            <LanguageSelector />
          </div>
        </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <TrackingSection
            title={t('baby.recent.eliminations')}
            events={eliminations}
            babyId={baby.id}
            trackingType="elimination"
            renderEventDetails={(event) =>
              event.weight && (
                <div className="text-sm text-gray-600">
                  {t('baby.details.weight')}: {event.weight}g
                </div>
              )
            }
          />
  
          <TrackingSection
            title={t('baby.recent.feedings')}
            events={feedings}
            babyId={baby.id}
            trackingType="feeding"
            renderEventDetails={(event) =>
              event.amount && (
                <div className="text-sm text-gray-600">
                  {t('baby.details.amount')}: {event.amount}ml
                </div>
              )
            }
          />
  
          <TrackingSection
            title={t('baby.recent.sleep')}
            events={sleepSessions}
            babyId={baby.id}
            trackingType="sleep"
            renderEventDetails={(event) =>
              event.quality && (
                <div className="text-sm text-gray-600">
                  {t('baby.details.quality')}: {event.quality}/5
                </div>
              )
            }
          />
        </div>
  
        <Outlet />
  
        <AddCaregiverModal
          babyId={baby.id}
          isOpen={showCaregiverModal}
          onClose={() => setShowCaregiverModal(false)}
        />
      </div>
    </>
    );
  }
  
