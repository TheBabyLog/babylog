import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { redirect } from "@remix-run/node";

// Define mocks within the factory functions
vi.mock("@remix-run/react", () => ({
  useActionData: vi.fn(() => undefined),
  Form: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <form {...props}>{children}</form>,
  useNavigate: () => vi.fn(),
  useSubmit: () => vi.fn(),
  useLoaderData: vi.fn(),
  useDataRouterState: () => ({
    navigation: {
      state: "idle",
      location: undefined,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
    },
    location: { pathname: "/" },
    loaderData: {},
    actionData: null,
    errors: null,
  }),
  useNavigation: () => ({
    state: "idle",
    formData: null,
    location: undefined,
  }),
  useLocation: () => ({ pathname: "/" }),
  useMatches: () => [],
}));

vi.mock("~/.server/session", () => ({
  createUserSession: vi.fn(),
  getUserId: vi.fn(),
}));

vi.mock("~/.server/auth", () => ({
  verifyLogin: vi.fn(),
}));

vi.mock("~/src/utils/translate", () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      "auth.errors.invalidCredentials": "Invalid credentials",
      "auth.errors.credentialsRequired": "Email and password are required",
    };
    return translations[key] || key;
  },
}));

// Now import the mocked modules after all vi.mock calls
import { useActionData } from "@remix-run/react";
import { createUserSession, getUserId } from "~/.server/session";
import { verifyLogin } from "~/.server/auth";
import Login, { loader, action } from "~/routes/_index";

// Create a mock prisma client
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
};

// Create a mock context object
const mockContext = {
  prisma: mockPrisma,
  cloudflare: { env: {} },
};

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useActionData as any).mockImplementation(() => undefined);
  });

  describe("loader", () => {
    it("redirects to dashboard if user is already logged in", async () => {
      (getUserId as any).mockResolvedValue(1);

      const request = new Request("http://localhost:3000/");

      const response = await (loader as any)({
        request,
        context: mockContext,
        params: {},
      });

      expect(response).toEqual(redirect("/dashboard"));
    });

    it("returns null if user is not logged in", async () => {
      (getUserId as any).mockResolvedValue(null);

      const request = new Request("http://localhost:3000/");

      const response = await (loader as any)({
        request,
        context: mockContext,
        params: {},
      });

      expect(response).toBeNull();
    });
  });

  describe("action", () => {
    it("returns error for invalid credentials", async () => {
      (verifyLogin as any).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "wrongpassword");

      const request = new Request("http://localhost:3000/", {
        method: "POST",
        body: formData,
      });

      const response = await (action as any)({
        request,
        context: mockContext,
        params: {},
      });

      const responseData = await response.json();

      expect(responseData).toEqual({ error: "Invalid credentials" });
      expect(response.status).toBe(400);
    });

    it("creates user session on successful login", async () => {
      (verifyLogin as any).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        phone: null,
      });

      (createUserSession as any).mockResolvedValue(redirect("/dashboard"));

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "correctpassword");

      const request = new Request("http://localhost:3000/", {
        method: "POST",
        body: formData,
      });

      await (action as any)({
        request,
        context: mockContext,
        params: {},
      });

      expect(createUserSession).toHaveBeenCalledWith(1, "/dashboard");
    });
  });

  describe("Login Component", () => {
    it("renders login form", () => {
      render(<Login />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    it("displays error message when provided", () => {
      (useActionData as any).mockImplementation(() => ({
        error: "Test error message",
      }));

      render(<Login />);
      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("updates form fields on user input", () => {
      render(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(emailInput).toHaveValue("test@example.com");
      expect(passwordInput).toHaveValue("password123");
    });
  });
});
