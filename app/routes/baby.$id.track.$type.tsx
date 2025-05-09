import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import {
  trackElimination,
  trackFeeding,
  trackSleep,
  trackPhoto,
} from "~/.server/tracking";
import { TrackingModal } from "~/components/tracking/TrackingModal";
import { t } from "~/src/utils/translate";
import { Baby, BabyCaregiver } from "prisma/generated/client";

type TrackingType = "elimination" | "feeding" | "sleep" | "photo";

function getTrackingConfig(type: TrackingType) {
  const configs = {
    elimination: {
      title: t("tracking.elimination.title"),
      fields: [
        {
          id: "timestamp",
          label: t("tracking.when"),
          type: "datetime-local" as const,
          required: true,
        },
        {
          id: "type",
          label: t("tracking.type"),
          type: "select" as const,
          required: true,
          options: [
            { value: "wet", label: t("tracking.elimination.types.wet") },
            { value: "dirty", label: t("tracking.elimination.types.dirty") },
            { value: "both", label: t("tracking.elimination.types.both") },
          ],
        },
        {
          id: "weight",
          label: t("tracking.elimination.weight"),
          type: "number" as const,
        },
        {
          id: "notes",
          label: t("tracking.notes"),
          type: "textarea" as const,
          placeholder: t("tracking.notesPlaceholder"),
        },
      ],
    },
    feeding: {
      title: t("tracking.feeding.title"),
      fields: [
        {
          id: "timestamp",
          label: t("tracking.when"),
          type: "datetime-local" as const,
          required: true,
        },
        {
          id: "type",
          label: t("tracking.type"),
          type: "select" as const,
          required: true,
          options: [
            { value: "breast", label: t("tracking.feeding.types.breast") },
            { value: "bottle", label: t("tracking.feeding.types.bottle") },
            { value: "formula", label: t("tracking.feeding.types.formula") },
          ],
        },
        {
          id: "amount",
          label: t("tracking.feeding.amount"),
          type: "number" as const,
        },
        {
          id: "notes",
          label: t("tracking.notes"),
          type: "textarea" as const,
          placeholder: t("tracking.notesPlaceholder"),
        },
      ],
    },
    sleep: {
      title: t("tracking.sleep.title"),
      fields: [
        {
          id: "startTime",
          label: t("tracking.sleep.startTime"),
          type: "datetime-local" as const,
          required: true,
        },
        {
          id: "endTime",
          label: t("tracking.sleep.endTime"),
          type: "datetime-local" as const,
          required: true,
        },
        {
          id: "how",
          label: t("tracking.sleep.how"),
          type: "text" as const,
          required: false,
        },
        {
          id: "whereFellAsleep",
          label: t("tracking.sleep.whereFellAsleep"),
          type: "text" as const,
          required: false,
        },
        {
          id: "whereSlept",
          label: t("tracking.sleep.whereSlept"),
          type: "text" as const,
          required: false,
        },
        {
          id: "type",
          label: t("tracking.type"),
          type: "select" as const,
          required: true,
          options: [
            { value: "nap", label: t("tracking.sleep.types.nap") },
            { value: "night", label: t("tracking.sleep.types.night") },
          ],
        },
        {
          id: "quality",
          label: t("tracking.sleep.quality"),
          type: "select" as const,
          required: false,
          options: [
            { value: "1", label: "★" },
            { value: "2", label: "★★" },
            { value: "3", label: "★★★" },
            { value: "4", label: "★★★★" },
            { value: "5", label: "★★★★★" },
          ],
        },
        {
          id: "notes",
          label: t("tracking.notes"),
          type: "textarea" as const,
          placeholder: t("tracking.notesPlaceholder"),
        },
      ],
    },
    photo: {
      title: t("tracking.photo.title"),
      fields: [
        {
          id: "photo",
          label: t("tracking.photo.upload"),
          type: "file" as const,
          required: true,
          accept: "image/*",
        },
        {
          id: "caption",
          label: t("tracking.photo.caption"),
          type: "text" as const,
          required: false,
          placeholder: t("tracking.photo.captionPlaceholder"),
        },
        {
          id: "notes",
          label: t("tracking.notes"),
          type: "textarea" as const,
          placeholder: t("tracking.notesPlaceholder"),
        },
      ],
    },
  };

  return configs[type];
}

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { prisma } = context;
  const userId = await requireUserId(request);
  const baby = await getBaby(prisma, Number(params.id));

  if (!baby) return redirect("/dashboard");
  const isAuthorized =
    baby.ownerId === userId ||
    (baby as Baby & { caregivers: BabyCaregiver[] }).caregivers.some(
      (c) => c.userId === userId
    );

  if (!isAuthorized) return redirect("/dashboard");

  const type = params.type as TrackingType;
  if (!getTrackingConfig(type)) {
    return redirect(`/baby/${params.id}`);
  }

  return new Response(
    JSON.stringify({ baby, trackingConfig: getTrackingConfig(type) }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { prisma } = context;
  const formData = await request.formData();
  const type = params.type as TrackingType;
  const babyId = Number(params.id);

  const baseData = {
    babyId,
    type: formData.get("type") as string,
    notes: formData.get("notes") as string | null,
  };

  const timestamp = new Date(formData.get("timestamp") as string);

  switch (type) {
    case "elimination":
      await trackElimination(prisma, request, {
        ...baseData,
        timestamp,
        weight: formData.get("weight") ? Number(formData.get("weight")) : null,
      });
      break;
    case "feeding":
      await trackFeeding(prisma, request, {
        ...baseData,
        startTime: timestamp,
        amount: formData.get("amount") ? Number(formData.get("amount")) : null,
      });
      break;
    case "sleep":
      await trackSleep(prisma, request, {
        ...baseData,
        startTime: timestamp,
        quality: formData.get("quality")
          ? Number(formData.get("quality"))
          : null,
      });
      break;
    case "photo":
      await trackPhoto(prisma, request, {
        ...baseData,
        timestamp: timestamp,
        id: 0,
        url: "",
        caption: "",
      });
      break;
    default:
      throw new Error(`Invalid tracking type: ${type}`);
  }

  return redirect(`/baby/${params.id}`);
}

export default function TrackEvent() {
  const { baby, trackingConfig } = useLoaderData<typeof loader>();
  const type = trackingConfig.title.toLowerCase() as TrackingType;

  const config = getTrackingConfig(type);

  return (
    <TrackingModal
      babyId={baby.id}
      title={config.title}
      fields={config.fields}
    />
  );
}
