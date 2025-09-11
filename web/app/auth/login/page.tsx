"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/src/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </main>
  );
}
