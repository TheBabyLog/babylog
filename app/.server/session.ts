import { createCookieSessionStorage, redirect } from "react-router";

function getSessionSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (process.env.NODE_ENV === "production") {
        if (!secret || secret.length < 32) {
            throw new Error(
                "SESSION_SECRET must be set to a string of at least 32 characters in production. " +
                    "Use `wrangler secret put SESSION_SECRET` to set it."
            );
        }
        return secret;
    }
    return secret || "dev-session-secret-min-32-chars";
}

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [getSessionSecret()],
        secure: process.env.NODE_ENV === "production",
    },
});

export async function createUserSession(userId: number, redirectTo: string) {
    const session = await sessionStorage.getSession();
    session.set("userId", userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
}

export async function getUserSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    if (!cookie) {
        return sessionStorage.getSession();
    }
    return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "number") return null;
    return userId;
}

export async function requireUserId(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        throw redirect("/login");
    }
    return userId;
}

export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}
