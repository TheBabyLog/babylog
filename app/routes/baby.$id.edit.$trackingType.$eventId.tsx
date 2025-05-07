import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TrackingModal } from "~/components/tracking/TrackingModal";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import {
  getElimination,
  getFeeding,
  getSleep,
  getPhoto,
  editElimination,
  editFeeding,
  editSleep,
  editPhoto,
  type EliminationUpdateData,
  type FeedingUpdateData,
  type SleepUpdateData,
  type PhotoUpdateData,
} from "~/.server/tracking";
import { t } from "~/src/utils/translate";
import { Baby, BabyCaregiver } from "prisma/generated/client";

type FieldType = "text" | "number" | "select" | "textarea" | "datetime-local";

interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string | number | null;
}

const TRACKING_FIELDS: Record<string, Field[]> = {
  elimination: [
    {
      id: "type",
      label: t("tracking.elimination.type"),
      type: "select",
      options: [
        { value: "wet", label: t("tracking.elimination.types.wet") },
        { value: "dirty", label: t("tracking.elimination.types.dirty") },
        { value: "mixed", label: t("tracking.elimination.types.mixed") },
      ],
      required: true,
    },
    {
      id: "timestamp",
      label: t("tracking.elimination.time"),
      type: "datetime-local",
      required: true,
    },
    { id: "weight", label: t("tracking.elimination.weight"), type: "number" },
    { id: "location", label: t("tracking.elimination.location"), type: "text" },
    { id: "notes", label: t("tracking.elimination.notes"), type: "textarea" },
  ],
  feeding: [
    {
      id: "type",
      label: t("tracking.feeding.type"),
      type: "select",
      options: [
        { value: "breast", label: t("tracking.feeding.types.breast") },
        { value: "bottle", label: t("tracking.feeding.types.bottle") },
        { value: "solid", label: t("tracking.feeding.types.solid") },
      ],
      required: true,
    },
    {
      id: "startTime",
      label: t("tracking.feeding.startTime"),
      type: "datetime-local",
      required: true,
    },
    {
      id: "endTime",
      label: t("tracking.feeding.endTime"),
      type: "datetime-local",
    },
    {
      id: "side",
      label: t("tracking.feeding.side"),
      type: "select",
      options: [
        { value: "left", label: t("tracking.feeding.sides.left") },
        { value: "right", label: t("tracking.feeding.sides.right") },
      ],
    },
    { id: "amount", label: t("tracking.feeding.amount"), type: "number" },
    { id: "food", label: t("tracking.feeding.food"), type: "text" },
    { id: "notes", label: t("tracking.feeding.notes"), type: "textarea" },
  ],
  sleep: [
    {
      id: "type",
      label: t("tracking.sleep.type"),
      type: "select",
      options: [
        { value: "nap", label: t("tracking.sleep.types.nap") },
        { value: "night", label: t("tracking.sleep.types.night") },
      ],
      required: true,
    },
    {
      id: "startTime",
      label: t("tracking.sleep.startTime"),
      type: "datetime-local",
      required: true,
    },
    {
      id: "endTime",
      label: t("tracking.sleep.endTime"),
      type: "datetime-local",
    },
    { id: "how", label: t("tracking.sleep.how"), type: "text" },
    {
      id: "whereFellAsleep",
      label: t("tracking.sleep.whereFellAsleep"),
      type: "text",
    },
    { id: "whereSlept", label: t("tracking.sleep.whereSlept"), type: "text" },
    { id: "quality", label: t("tracking.sleep.quality"), type: "number" },
    { id: "notes", label: t("tracking.sleep.notes"), type: "textarea" },
  ],
  photo: [
    {
      id: "caption",
      label: t("tracking.photo.caption"),
      type: "text" as const,
    },
  ],
};

type LoaderData = {
  baby: { id: number };
  trackingType: keyof typeof TRACKING_FIELDS;
  event: {
    id: number;
    type: string;
    timestamp?: string;
    startTime?: string;
    endTime?: string | null;
    weight?: number | null;
    amount?: number | null;
    quality?: number | null;
    location?: string | null;
    notes?: string | null;
    food?: string | null;
    side?: string | null;
    how?: string | null;
    whereFellAsleep?: string | null;
    whereSlept?: string | null;
    url?: string | null;
    caption?: string | null;
    takenOn?: string | null;
    takenAt?: string | null;
  };
};

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { prisma } = context;
  const userId = await requireUserId(request);
  const baby = await getBaby(prisma, Number(params.id));

  if (!baby) return redirect("/dashboard");

  // Verify user has permission to access this baby's data
  const isAuthorized =
    baby.ownerId === userId ||
    (baby as Baby & { caregivers: BabyCaregiver[] }).caregivers.some(
      (c) => c.userId === userId
    );

  if (!isAuthorized) return redirect("/dashboard");

  const eventId = Number(params.eventId);
  const trackingType = params.trackingType as keyof typeof TRACKING_FIELDS;

  if (!TRACKING_FIELDS[trackingType]) {
    return redirect(`/baby/${params.id}`);
  }

  let event;
  switch (trackingType) {
    case "elimination":
      event = await getElimination(prisma, request, eventId);
      break;
    case "feeding":
      event = await getFeeding(prisma, request, eventId);
      break;
    case "sleep":
      event = await getSleep(prisma, request, eventId);
      break;
    case "photo":
      event = await getPhoto(prisma, request, eventId);
      break;
  }

  if (!event) return redirect(`/baby/${params.id}`);

  return new Response(JSON.stringify({ baby, event, trackingType }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { prisma } = context;
  const userId = await requireUserId(request);
  const baby = await getBaby(prisma, Number(params.id));

  if (!baby) return redirect("/dashboard");

  // Verify user has permission to modify this baby's data
  const isAuthorized =
    baby.ownerId === userId ||
    (baby as Baby & { caregivers: BabyCaregiver[] }).caregivers.some(
      (c) => c.userId === userId
    );

  if (!isAuthorized) return redirect("/dashboard");

  const formData = await request.formData();
  const eventId = Number(params.eventId);
  const trackingType = params.trackingType as keyof typeof TRACKING_FIELDS;

  const rawData = Object.fromEntries(formData);

  switch (trackingType) {
    case "elimination": {
      const data: EliminationUpdateData = {
        type: rawData.type?.toString(),
        timestamp: rawData.timestamp
          ? new Date(rawData.timestamp.toString())
          : undefined,
        weight: rawData.weight ? Number(rawData.weight) : null,
        location: rawData.location?.toString() ?? null,
        notes: rawData.notes?.toString() ?? null,
      };
      await editElimination(prisma, request, eventId, data);
      break;
    }
    case "feeding": {
      const data: FeedingUpdateData = {
        type: rawData.type?.toString(),
        startTime: rawData.startTime
          ? new Date(rawData.startTime.toString())
          : undefined,
        endTime: rawData.endTime ? new Date(rawData.endTime.toString()) : null,
        side: rawData.side?.toString() ?? null,
        amount: rawData.amount ? Number(rawData.amount) : null,
        food: rawData.food?.toString() ?? null,
        notes: rawData.notes?.toString() ?? null,
      };
      await editFeeding(prisma, request, eventId, data);
      break;
    }
    case "sleep": {
      const data: SleepUpdateData = {
        type: rawData.type?.toString(),
        startTime: rawData.startTime
          ? new Date(rawData.startTime.toString())
          : undefined,
        endTime: rawData.endTime ? new Date(rawData.endTime.toString()) : null,
        how: rawData.how?.toString() ?? null,
        whereFellAsleep: rawData.whereFellAsleep?.toString() ?? null,
        whereSlept: rawData.whereSlept?.toString() ?? null,
        quality: rawData.quality ? Number(rawData.quality) : null,
        notes: rawData.notes?.toString() ?? null,
      };
      await editSleep(prisma, request, eventId, data);
      break;
    }
    case "photo": {
      const data: PhotoUpdateData = {
        url: rawData.url?.toString() ?? null,
        caption: rawData.caption?.toString() ?? null,
        takenOn: rawData.takenOn
          ? new Date(rawData.takenOn.toString())
          : undefined,
        takenAt: rawData.takenAt
          ? new Date(rawData.takenAt.toString())
          : undefined,
      };
      await editPhoto(prisma, request, eventId, data);
      break;
    }
  }

  return redirect(`/baby/${params.id}`);
}

export default function EditTracking() {
  const { baby, event, trackingType } = useLoaderData<
    typeof loader
  >() as LoaderData;

  // Format dates for datetime-local input based on tracking type
  let defaultValues: Record<string, string | number | null> = {};

  switch (trackingType) {
    case "elimination":
      defaultValues = {
        type: event.type,
        timestamp: event.timestamp
          ? new Date(event.timestamp).toISOString().slice(0, 16)
          : "",
        weight: event.weight ?? null,
        location: event.location ?? null,
        notes: event.notes ?? null,
      };
      break;
    case "feeding":
      defaultValues = {
        type: event.type,
        startTime: event.startTime
          ? new Date(event.startTime).toISOString().slice(0, 16)
          : "",
        endTime: event.endTime
          ? new Date(event.endTime).toISOString().slice(0, 16)
          : "",
        side: event.side ?? null,
        amount: event.amount ?? null,
        food: event.food ?? null,
        notes: event.notes ?? null,
      };
      break;
    case "sleep":
      defaultValues = {
        type: event.type,
        startTime: event.startTime
          ? new Date(event.startTime).toISOString().slice(0, 16)
          : "",
        endTime: event.endTime
          ? new Date(event.endTime).toISOString().slice(0, 16)
          : "",
        how: event.how ?? null,
        whereFellAsleep: event.whereFellAsleep ?? null,
        whereSlept: event.whereSlept ?? null,
        quality: event.quality ?? null,
        notes: event.notes ?? null,
      };
      break;
    case "photo":
      defaultValues = {
        url: event.url ?? null,
        caption: event.caption ?? null,
        takenOn: event.takenOn
          ? new Date(event.takenOn).toISOString().slice(0, 16)
          : null,
        takenAt: event.takenAt
          ? new Date(event.takenAt).toISOString().slice(0, 16)
          : null,
      };
      break;
  }

  return (
    <TrackingModal
      babyId={baby.id}
      title={t(`tracking.edit.${trackingType}`)}
      fields={TRACKING_FIELDS[trackingType].map((field) => ({
        ...field,
        defaultValue: defaultValues[field.id],
      }))}
    />
  );
}
