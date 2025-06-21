import { Link, useLoaderData, Form } from "@remix-run/react";
import { requireUserId, logout } from "~/.server/session";
import { getUserBabies } from "~/.server/baby";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { t } from "~/src/utils/translate";
import type { Baby, PrismaClient } from "@prisma/client";

export async function loader({
  request,
  context,
}: LoaderFunctionArgs & { context: { prisma: PrismaClient } }) {
  const { prisma } = context;
  const userId = await requireUserId(request);
  const babies = await getUserBabies(prisma, userId);
  return { babies };
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toLowerCase() === "post") {
    return logout(request);
  }
}

export default function Dashboard() {
  const { babies } = useLoaderData<typeof loader>();

  return (
    <div className="w-full min-h-screen p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          {t("dashboard.title")}
        </h1>
        <div className="flex gap-3">
          <Link
            to="/baby/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("dashboard.addBaby")}
          </Link>
          <Form method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("common.logout")}
            </button>
          </Form>
        </div>
      </div>

      {babies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">{t("dashboard.noBabies")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {babies.map((baby: Baby) => (
            <Link
              key={baby.id}
              to={`/baby/${baby.id}`}
              className="p-6 bg-gray-800 rounded-xl shadow-md hover:bg-gray-700 transition-colors block"
            >
              <h2 className="text-xl font-bold text-white">
                {baby.firstName} {baby.lastName}
              </h2>
              <p className="text-gray-400 mt-1">
                {t("common.born")}:{" "}
                {new Date(baby.dateOfBirth).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
