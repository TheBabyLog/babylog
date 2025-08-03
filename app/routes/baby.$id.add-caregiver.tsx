import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { json } from "@remix-run/server-runtime";
import { requireUserId } from "~/.server/session";
import { inviteNewCaregiver } from "~/.server/caregiver";

export async function loader({ request }: LoaderFunctionArgs) {
  // Redirect GET requests back to the baby page
  const url = new URL(request.url);
  const babyId = url.pathname.split("/")[2];
  return redirect(`/baby/${babyId}`);
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { prisma } = context;
  const userId = await requireUserId(request);

  // Validate that we have a valid baby ID
  if (!params.id || isNaN(Number(params.id))) {
    return redirect("/dashboard");
  }

  const formData = await request.formData();
  const babyId = Number(params.id);
  const email = formData.get("email") as string;

  if (!email) {
    return json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Use the inviteNewCaregiver function to create the invitation
    await inviteNewCaregiver(
      prisma,
      request,
      babyId,
      email.toLowerCase(),
      userId
    );
    return redirect(`/baby/${babyId}`);
  } catch (error) {
    console.error("Error inviting caregiver:", error);
    return json(
      { error: "There was an error inviting the caregiver. Please try again." },
      { status: 400 }
    );
  }
}
