import { vi, describe, it, expect } from "vitest";

vi.mock("~/.server/baby", () => ({
  getUserBabies: vi.fn(),
}));

import { render, screen } from "@testing-library/react";
import { createRemixStub } from "@remix-run/testing";
import Dashboard from "~/routes/dashboard/route";

vi.mock("~/services/session.server", () => ({
  requireUserId: vi.fn(() => "user-1"),
}));

describe("Dashboard", () => {
  it("renders empty state and Add Baby button", async () => {
    const { getUserBabies } = await import("~/.server/baby");
    vi.mocked(getUserBabies).mockResolvedValueOnce([]);

    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Dashboard,
        loader: () =>
          new Response(JSON.stringify({ babies: [] }), {
            headers: { "Content-Type": "application/json" },
          }),
      },
    ]);

    render(<RemixStub />);

    expect(await screen.findByText("No babies added yet.")).toBeInTheDocument();
    expect(screen.getByText("Add Baby")).toBeInTheDocument();
  });

  it("renders babies list", async () => {
    const { getUserBabies } = await import("~/.server/baby");
    vi.mocked(getUserBabies).mockResolvedValueOnce([
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("2024-01-01T00:00:00.000Z"),
        gender: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 1,
      },
    ]);

    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Dashboard,
        loader: () =>
          new Response(
            JSON.stringify({
              babies: [
                {
                  id: "1",
                  firstName: "John",
                  lastName: "Doe",
                  dateOfBirth: "2024-01-01T00:00:00.000Z",
                },
              ],
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          ),
      },
    ]);

    render(<RemixStub />);

    const babyLink = await screen.findByRole("link", { name: /John Doe/i });
    expect(babyLink).toBeInTheDocument();
    expect(babyLink).toHaveTextContent("Born:");
    expect(babyLink).toHaveTextContent("John Doe");
  });
});
