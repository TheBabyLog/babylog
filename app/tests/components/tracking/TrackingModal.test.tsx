import { render, screen, fireEvent } from "@testing-library/react";
import { TrackingModal } from "~/components/tracking/TrackingModal";
import { vi, expect, describe, beforeEach, it, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock the dependencies
const mockNavigate = vi.fn();

// Mock modules
vi.mock("@remix-run/react", () => ({
  Form: ({ children, ...props }: any) => (
    <form data-testid="mock-form" {...props}>
      {children}
    </form>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock("lucide-react", () => ({
  XIcon: () => <div data-testid="x-icon">X</div>,
}));

// Mock the translation function to return custom values for tests
vi.mock("../../src/utils/translate", () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      "modal.close": "Close",
      "modal.actions.cancel": "Cancel",
      "modal.actions.save": "Save",
      "tracking.chooseFile": "Choose File",
      "tracking.dragAndDrop": "or drag and drop",
      "tracking.preview": "Preview",
    };
    return translations[key] || key;
  },
}));

// This is the most important part - mock the DOM methods properly
// to prevent the removeChild error
beforeEach(() => {
  // Keep track of added elements
  const addedElements = new Set();

  // Save original methods
  const originalCreateElement = document.createElement;
  const originalAppendChild = document.head.appendChild;
  const originalRemoveChild = document.head.removeChild;

  // Mock createElement
  document.createElement = vi.fn((tag) => {
    if (tag === "style") {
      const element = {
        textContent: "",
        nodeType: 1,
        nodeName: "STYLE",
        tagName: "style",
      };
      return element as unknown as HTMLStyleElement;
    }
    return originalCreateElement.call(document, tag);
  });

  // Mock appendChild
  document.head.appendChild = vi.fn((element) => {
    addedElements.add(element);
    return element;
  });

  // Mock removeChild
  document.head.removeChild = vi.fn((element) => {
    if (addedElements.has(element)) {
      addedElements.delete(element);
      return element;
    }
    return originalRemoveChild.call(document.head, element);
  });

  // Restore original methods after tests
  vi.restoreAllMocks();
});

describe("TrackingModal", () => {
  const babyId = 1;
  const defaultFields = [
    {
      id: "when",
      label: "When",
      type: "datetime-local" as const,
      required: true,
    },
    {
      id: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { value: "wet", label: "Wet" },
        { value: "dirty", label: "Dirty" },
      ],
      required: true,
    },
    {
      id: "weight",
      label: "Weight (g)",
      type: "number" as const,
      required: false,
    },
    {
      id: "notes",
      label: "Notes",
      type: "textarea" as const,
      required: false,
    },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the modal with correct title", () => {
    render(
      <TrackingModal
        babyId={babyId}
        title="elimination"
        fields={defaultFields}
      />
    );

    expect(screen.getByText("elimination")).toBeInTheDocument();
  });

  it("closes modal when clicking X button", () => {
    render(
      <TrackingModal
        babyId={babyId}
        title="elimination"
        fields={defaultFields}
      />
    );

    // Use the data-testid to find the X button
    const closeButtonIcon = screen.getByTestId("x-icon");
    const closeButton = closeButtonIcon.closest("button");

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(mockNavigate).toHaveBeenCalledWith("/baby/1");
  });

  it("closes modal when pressing Escape key", () => {
    render(
      <TrackingModal
        babyId={babyId}
        title="elimination"
        fields={defaultFields}
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });

    expect(mockNavigate).toHaveBeenCalledWith("/baby/1");
  });

  it("closes modal when clicking cancel button", () => {
    render(
      <TrackingModal
        babyId={babyId}
        title="elimination"
        fields={defaultFields}
      />
    );

    // Find cancel button by the text "Cancel"
    // (Our mock t function returns "Cancel" for "modal.actions.cancel")
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/baby/1");
  });

  it("renders select options correctly", () => {
    render(
      <TrackingModal
        babyId={babyId}
        title="elimination"
        fields={defaultFields}
      />
    );

    const selectElement = screen.getByLabelText("Type");
    expect(selectElement).toBeInTheDocument();

    // Check options exist
    const options = Array.from(selectElement.getElementsByTagName("option"));
    expect(options.length).toBe(2);
    expect(options[0].textContent).toBe("Wet");
    expect(options[1].textContent).toBe("Dirty");
  });
});
