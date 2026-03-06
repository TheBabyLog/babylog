import { ActionFunctionArgs, LoaderFunctionArgs, data, redirect } from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { getBaby } from "~/.server/baby";
import { requireUserId } from "~/.server/session";
import { trackPhoto } from "~/.server/tracking";
import { prepareFileUpload } from "~/.server/s3_auth";
import { PhotoTrackingModal } from "~/components/tracking/PhotoTrackingModal";
import { t } from "~/src/utils/translate";
import type { Baby, BabyCaregiver, PrismaClient } from "@prisma/client";

export async function loader({
  request,
  params,
  context,
}: LoaderFunctionArgs & { context: { prisma: PrismaClient } }) {
  const { prisma } = context;
  const userId = await requireUserId(request);

  // Validate that we have a valid baby ID
  if (!params.id || isNaN(Number(params.id))) {
    return redirect("/dashboard");
  }

  const baby = await getBaby(prisma, Number(params.id));

  if (!baby) return redirect("/dashboard");
  const isAuthorized =
    baby.ownerId === userId ||
    (baby as Baby & { caregivers: BabyCaregiver[] }).caregivers.some(
      (c) => c.userId === userId
    );

  if (!isAuthorized) return redirect("/dashboard");

  return data({ baby });
}

export async function action({
  request,
  params,
  context,
}: ActionFunctionArgs & { context: { prisma: PrismaClient } }) {
  const { prisma } = context;
  await requireUserId(request);

  // Validate that we have a valid baby ID
  if (!params.id || isNaN(Number(params.id))) {
    return redirect("/dashboard");
  }

  const formData = await request.formData();
  const babyId = Number(params.id);

  const caption = (formData.get("caption") as string) || undefined;
  const photoFile = formData.get("photo") as File;

  if (!photoFile || photoFile.size === 0) {
    return data({ error: "noFileSelected" }, { status: 400 });
  }

  if (!photoFile.type.startsWith("image/")) {
    return data({ error: "invalidFileType" }, { status: 400 });
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  if (photoFile.size > MAX_FILE_SIZE) {
    return data({ error: "fileTooLarge" }, { status: 400 });
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
    return data({ error: "uploadFailed" }, { status: 500 });
  }
}

export default function TrackPhoto() {
  const { baby } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const getErrorMessage = (errorKey: string | undefined) => {
    if (!errorKey) return null;
    return t(`form.errors.${errorKey}`);
  };

  return (
    <PhotoTrackingModal
      babyId={baby.id}
      error={getErrorMessage(actionData?.error)}
    />
  );
}
