import { useMemo } from "react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { trackPhoto } from "~/.server/tracking";
import { prepareFileUpload } from "~/.server/s3_auth";
import { TrackingModal } from "~/components/tracking/TrackingModal";
import { t } from "~/src/utils/translate";
import type { Baby, BabyCaregiver, PrismaClient } from "@prisma/client";

export async function loader({
  request,
  params,
  context,
}: LoaderFunctionArgs & { context: { prisma: PrismaClient } }) {
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

  return { baby };
}

export async function action({
  request,
  params,
  context,
}: ActionFunctionArgs & { context: { prisma: PrismaClient } }) {
  const { prisma } = context;
  const formData = await request.formData();
  const babyId = Number(params.id);
  await requireUserId(request);

  try {
    const caption = (formData.get("caption") as string) || undefined;
    const photoFile = formData.get("photo") as File;

    if (!photoFile || !(photoFile instanceof File)) {
      throw new Error("No photo file uploaded");
    }

    // Validate file type
    if (!photoFile.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Validate file size (e.g., 5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (photoFile.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 5MB limit");
    }

    try {
      const uploadDetails = await prepareFileUpload(photoFile);

      const response = await fetch(uploadDetails.uploadUrl, {
        method: "PUT",
        body: await photoFile.arrayBuffer(),
        headers: {
          "Content-Type": uploadDetails.contentType,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      await trackPhoto(prisma, request, {
        id: 0,
        url: uploadDetails.filename,
        caption,
        timestamp: new Date(),
        babyId,
      });

      return redirect(`/baby/${babyId}`);
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload photo");
    }
  } catch (error) {
    console.error("Processing error:", error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
}

export default function TrackPhoto() {
  const { baby } = useLoaderData<typeof loader>();

  const fields = useMemo(
    () => [
      {
        id: "photo",
        label: t("tracking.photo.upload"),
        type: "file" as const,
        required: true,
        accept: "image/*",
        dragDrop: true, // Enable drag and drop
      },
      {
        id: "caption",
        label: t("tracking.photo.caption"),
        type: "text" as const,
        required: false,
        placeholder: t("tracking.photo.captionPlaceholder"),
      },
    ],
    []
  );

  return (
    <TrackingModal
      babyId={baby.id}
      title={t("tracking.photo.title")}
      fields={fields}
      multipart={true}
    />
  );
}
