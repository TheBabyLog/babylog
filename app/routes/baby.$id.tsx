import { useState } from "react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { getRecentTrackingEvents } from "~/.server/tracking";
import { PlusIcon } from "lucide-react";
import AddCaregiverModal from "~/components/AddCaregiverModal";
import { t } from "~/src/utils/translate";
import { LanguageSelector } from "~/components/LanguageSelector";
import { TrackingSection } from "~/components/tracking/TrackingSection";

interface Elimination {
  id: number;
  type: string;
  timestamp: Date;
  weight: number | null;
}

interface Sleep {
  id: number;
  type: string;
  startTime: Date;
  quality?: number | null;
}

interface Feeding {
  id: number;
  type: string;
  startTime: Date;
  amount?: number | null;
}

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
    await getRecentTrackingEvents(baby.id);

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
      <div>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {baby.firstName} {baby.lastName}
            </h1>
      </div>
      <Outlet />
      <AddCaregiverModal
        babyId={baby.id}
        isOpen={showCaregiverModal}
        onClose={() => setShowCaregiverModal(false)}
      />
    </>
  );
}
