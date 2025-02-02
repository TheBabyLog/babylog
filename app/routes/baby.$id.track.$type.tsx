import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { trackElimination, trackFeeding, trackSleep } from "~/.server/tracking";
import { TrackingModal } from "~/components/tracking/TrackingModal";
import { t } from '~/src/utils/translate';

type TrackingType = 'elimination' | 'feeding' | 'sleep';

const trackingConfigs = {
  elimination: {
    title: t('tracking.elimination.title'),
    fields: [
      {
        id: "timestamp",
        label: t('tracking.when'),
        type: "datetime-local" as const,
        required: true
      },
      {
        id: "type",
        label: t('tracking.type'),
        type: "select" as const,
        required: true,
        options: [
          { value: "wet", label: t('tracking.elimination.types.wet') },
          { value: "dirty", label: t('tracking.elimination.types.dirty') },
          { value: "both", label: t('tracking.elimination.types.both') }
        ]
      },
      {
        id: "weight",
        label: t('tracking.elimination.weight'),
        type: "number" as const
      },
      {
        id: "notes",
        label: t('tracking.notes'),
        type: "textarea" as const,
        placeholder: t('tracking.notesPlaceholder')
      }
    ]
  },
  feeding: {
    title: t('tracking.feeding.title'),
    fields: [
      {
        id: "timestamp",
        label: t('tracking.when'),
        type: "datetime-local" as const,
        required: true
      },
      {
        id: "type",
        label: t('tracking.type'),
        type: "select" as const,
        required: true,
        options: [
          { value: "breast", label: t('tracking.feeding.types.breast') },
          { value: "bottle", label: t('tracking.feeding.types.bottle') },
          { value: "formula", label: t('tracking.feeding.types.formula') }
        ]
      },
      {
        id: "amount",
        label: t('tracking.feeding.amount'),
        type: "number" as const
      },
      {
        id: "notes",
        label: t('tracking.notes'),
        type: "textarea" as const,
        placeholder: t('tracking.notesPlaceholder')
      }
    ]
  },
  sleep: {
    title: t('tracking.sleep.title'),
    fields: [
      {
        id: "timestamp",
        label: t('tracking.when'),
        type: "datetime-local" as const,
        required: true
      },
      {
        id: "type",
        label: t('tracking.type'),
        type: "select" as const,
        required: true,
        options: [
          { value: "nap", label: t('tracking.sleep.types.nap') },
          { value: "night", label: t('tracking.sleep.types.night') }
        ]
      },
      {
        id: "quality",
        label: t('tracking.sleep.quality'),
        type: "select" as const,
        required: false,
        options: [
          { value: "1", label: "★" },
          { value: "2", label: "★★" },
          { value: "3", label: "★★★" },
          { value: "4", label: "★★★★" },
          { value: "5", label: "★★★★★" }
        ]
      },
      {
        id: "notes",
        label: t('tracking.notes'),
        type: "textarea" as const,
        placeholder: t('tracking.notesPlaceholder')
      }
    ]
  }
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const baby = await getBaby(Number(params.id));
  
  if (!baby) return redirect("/dashboard");
  const isAuthorized = baby.ownerId === userId || 
    baby.caregivers.some((c: { userId: number }) => c.userId === userId);
  
  if (!isAuthorized) return redirect("/dashboard");

  const type = params.type as TrackingType;
  if (!trackingConfigs[type]) {
    return redirect(`/baby/${params.id}`);
  }

  return json({ baby, trackingConfig: trackingConfigs[type] });
}

export async function action({ request, params }: ActionFunctionArgs) {
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
    case 'elimination':
      await trackElimination({
        ...baseData,
        timestamp,
        weight: formData.get("weight") ? Number(formData.get("weight")) : null,
      });
      break;
    case 'feeding':
      await trackFeeding({
        ...baseData,
        startTime: timestamp,
        amount: formData.get("amount") ? Number(formData.get("amount")) : null,
      });
      break;
    case 'sleep':
      await trackSleep({
        ...baseData,
        startTime: timestamp,
        quality: formData.get("quality") ? Number(formData.get("quality")) : null,
      });
      break;
    default:
      throw new Error(`Invalid tracking type: ${type}`);
  }

  return redirect(`/baby/${params.id}`);
}

export default function TrackEvent() {
  const { baby, trackingConfig } = useLoaderData<typeof loader>();
  
  return (
    <TrackingModal 
      babyId={baby.id}
      title={trackingConfig.title}
      fields={trackingConfig.fields}
    />
  );
}
