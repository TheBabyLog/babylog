import { Link, useLoaderData, Form } from "@remix-run/react";
import { requireUserId, logout } from "~/.server/session";
import { getUserBabies } from "~/.server/baby";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import type { Baby } from "@prisma/client";
import { t } from "~/src/utils/translate";
import { withPrisma } from "~/.server/db";

export const loader = withPrisma(async ({ request, prisma }) => {
  const userId = await requireUserId(request);
  const babies = await getUserBabies(prisma, userId);
  return { babies };
});

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toLowerCase() === "post") {
    return logout(request);
  }
}

export default function Dashboard() {
  const { babies } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <div className="flex gap-3">
          {" "}
          <Link
            to="/baby/new"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t("dashboard.addBaby")}
          </Link>
          <Form method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t("common.logout")}
            </button>
          </Form>
        </div>
      </div>

      {babies.length === 0 ? (
        <p className="text-gray-600">{t("dashboard.noBabies")}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {babies.map((baby: Baby) => (
            <Link
              key={baby.id}
              to={`/baby/${baby.id}`}
              className="p-4 border rounded-lg hover:border-blue-500"
            >
              <h2 className="text-xl font-semibold">
                {baby.firstName} {baby.lastName}
              </h2>
              <p className="text-gray-600">
                {t("common.born")}:{" "}
                {new Date(baby.dateOfBirth).toISOString().split("T")[0]}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
