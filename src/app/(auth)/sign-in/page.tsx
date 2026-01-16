"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <p className="text-sm text-gray-500 animate-pulse">
        Loading...
      </p>
    );
  }

  // ❌ Not signed in
  if (!session) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">
          Not signed in
        </p>

        <button
          onClick={() => signIn()}
          className="w-fit rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-300"
        >
          Sign In
        </button>
      </div>
    );
  }

  // ✅ Signed in
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-700">
        Signed in as {session.user?.email}
        <span className="font-semibold">
          {session.user?.name}
        </span>
      </p>

      <button
        onClick={() => signOut()}
        className="w-fit rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
      >
        Sign Out
      </button>
    </div>
  );
}
