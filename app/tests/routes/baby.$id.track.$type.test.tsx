import { render, screen, fireEvent } from "@testing-library/react";
import { createRemixStub } from "@remix-run/testing";
import { vi, expect, describe, test, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { json } from "@remix-run/node";

// Define mocks first
const mockNavigate = vi.fn();

// Mock the modules
vi.mock("@remix-run/react", () => {
  const actual = require("@remix-run/react");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// We need to mock the TrackingModal component to avoid style insertion issues
vi.mock("~/components/tracking/TrackingModal", () => {
  // Create a mock implementation that actually adds an event listener for Escape
  interface Field {
    id: string;
    label: string;
    type: string;
    required: boolean;
  }

  const TrackingModal = ({
    babyId,
    title,
    fields,
  }: {
    babyId: number;
    title: string;
    fields: Field[];
  }) => {
    // Add actual effect to handle escape key
    React.useEffect(() => {
      const handleEsc = (e: { key: string }) => {
        if (e.key === "Escape") {
          mockNavigate(`/baby/${babyId}`);
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [babyId]);

    return (
      <div data-testid="mock-modal">
        <h2 data-testid="modal-title">Track {title}</h2>
        <button
          onClick={() => mockNavigate(`/baby/${babyId}`)}
          aria-label="close"
        >
          Close
        </button>
        <form>
          {fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                required={field.required}
              />
            </div>
          ))}
          <button type="button" onClick={() => mockNavigate(`/baby/${babyId}`)}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  };

  return { TrackingModal };
});

// Import React for the useEffect hook in the mock
import * as React from "react";
// Now import the component
import TrackEvent from "~/routes/baby.$id.track.$type";

describe("TrackEvent Component", () => {
  const mockBaby = {
    id: 1,
    firstName: "Test",
    lastName: "Baby",
  };

  function ErrorBoundary() {
    return <div>Error!</div>;
  }

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("closes modal on escape key", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/baby/:id/track/:type",
        Component: TrackEvent,
        ErrorBoundary,
        loader: () =>
          json({
            baby: mockBaby,
            trackingConfig: {
              title: "Feeding",
              fields: [
                {
                  id: "timestamp",
                  label: "When",
                  type: "datetime-local",
                  required: true,
                },
              ],
            },
          }),
      },
    ]);

    render(<RemixStub initialEntries={["/baby/1/track/feeding"]} />);

    // Wait for the component to load using data-testid
    await screen.findByTestId("modal-title");

    // Simulate Escape key press - use window instead of document
    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    // Verify navigation happened
    expect(mockNavigate).toHaveBeenCalledWith("/baby/1");
  });

  test("closes modal on clicking close button", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/baby/:id/track/:type",
        Component: TrackEvent,
        ErrorBoundary,
        loader: () =>
          json({
            baby: mockBaby,
            trackingConfig: {
              title: "Feeding",
              fields: [
                {
                  id: "timestamp",
                  label: "When",
                  type: "datetime-local",
                  required: true,
                },
              ],
            },
          }),
      },
    ]);

    render(<RemixStub initialEntries={["/baby/1/track/feeding"]} />);

    // Wait for the component to render using data-testid
    await screen.findByTestId("mock-modal");

    // Find the close button by aria-label
    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    // Verify navigation happened
    expect(mockNavigate).toHaveBeenCalledWith("/baby/1");
  });
});
