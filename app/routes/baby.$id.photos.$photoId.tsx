import { ActionFunctionArgs, json } from "@remix-run/node";
import { deletePhoto } from "~/.server/tracking";
import { requireUserId } from "~/.server/session";

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "DELETE") {
    return json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    await requireUserId(request);
    const photoId = parseInt(params.photoId || "", 10);

    if (isNaN(photoId)) {
      return json(
        { success: false, error: "Invalid photo ID" },
        { status: 400 }
      );
    }

    await deletePhoto(request, photoId);
    return json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return json(
      { success: false, error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
