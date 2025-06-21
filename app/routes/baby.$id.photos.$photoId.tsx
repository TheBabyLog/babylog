import {
  ActionFunctionArgs,
  json,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { deletePhoto, editPhoto } from "~/.server/tracking";
import { requireUserId } from "~/.server/session";
import type { PrismaClient } from "@prisma/client";

export async function action({
  request,
  params,
  context,
}: ActionFunctionArgs & { context: { prisma: PrismaClient } }) {
  const { prisma } = context;
  const photoId = parseInt(params.photoId || "", 10);
  if (isNaN(photoId)) {
    return json({ success: false, error: "Invalid photo ID" }, { status: 400 });
  }

  await requireUserId(request);

  if (request.method === "DELETE") {
    try {
      await deletePhoto(prisma, request, photoId);
      return json({ success: true });
    } catch (error) {
      console.error("Error deleting photo:", error);
      return json(
        { success: false, error: "Failed to delete photo" },
        { status: 500 }
      );
    }
  }

  if (request.method === "PATCH") {
    try {
      const formData = await request.formData();
      const caption = formData.get("caption") as string;

      if (caption === null) {
        return json(
          { success: false, error: "Caption is required" },
          { status: 400 }
        );
      }

      await editPhoto(prisma, request, photoId, { caption });
      return json({ success: true });
    } catch (error) {
      console.error("Error updating photo caption:", error);
      return json(
        { success: false, error: "Failed to update photo caption" },
        { status: 500 }
      );
    }
  }

  return json({ success: false, error: "Method not allowed" }, { status: 405 });
}
