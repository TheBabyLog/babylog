import { useMemo } from "react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { TrackingModal } from "~/components/tracking/TrackingModal";
import { t } from "~/src/utils/translate";
import type { Baby, BabyCaregiver } from "@prisma/client";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const baby = await getBaby(Number(params.id));

  if (!baby) return redirect("/dashboard");
  const isAuthorized =
    baby.ownerId === userId ||
    (baby as Baby & { caregivers: BabyCaregiver[] }).caregivers.some(
      (c) => c.userId === userId
    );

  if (!isAuthorized) return redirect("/dashboard");

  return { baby };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const babyId = Number(params.id);

  // TODO: Implement photo upload functionality
  // This would involve:
  // 1. Processing the uploaded file
  // 2. Storing it in your storage solution (e.g., S3, local filesystem)
  // 3. Creating a database record for the photo

  return redirect(`/baby/${babyId}`);
}

export default function TrackPhoto() {
  const { baby } = useLoaderData<typeof loader>();

  const fields = useMemo(
    () => [
      {
        id: "takenOn",
        label: t("tracking.photo.takenOn"),
        type: "datetime-local" as const,
        required: true,
      },
      {
        id: "takenAt",
        label: t("tracking.photo.takenAt"),
        type: "text" as const,
        required: false,
      },
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
      },
      {
        id: "notes",
        label: t("tracking.photo.notes"),
        type: "textarea" as const,
        placeholder: t("tracking.notesPlaceholder"),
      },
    ],
    []
  ); // Empty dependency array since t() is stable

  return (
    <TrackingModal
      babyId={baby.id}
      title={t("tracking.photo.title")}
      fields={fields}
      multipart={true}
    />
  );
}
