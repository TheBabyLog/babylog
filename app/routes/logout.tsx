import type { ActionFunctionArgs } from "react-router";
import { logout } from "~/.server/session";
import { redirect } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}

export async function loader() {
  return redirect("/login");
}
