"use client";

import { useState } from "react";

type Application = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  licenseNumber: string | null;
  yearsExperience: string;
  serviceArea: string;
  projectTypes: string;
  status: string;
  reviewedAt: string | null;
  notes: string | null;
};

type Filter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/applications", {
        headers: { "x-admin-password": password },
      });

      if (!res.ok) {
        throw new Error("Invalid password");
      }

      const data = await res.json();
      setApplications(data);
      setAuthenticated(true);
    } catch {
      setError("Invalid admin password");
    } finally {
      setLoading(false);
    }
  }

  async function refreshApplications() {
    const res = await fetch("/api/admin/applications", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setApplications(await res.json());
    }
  }

  async function handleApprove(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}/approve`, {
        method: "POST",
        headers: { "x-admin-password": password },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to approve");
        return;
      }

      await refreshApplications();
    } catch {
      alert("Failed to approve application");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string, sendEmail: boolean) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}/reject`, {
        method: "POST",
        headers: {
          "x-admin-password": password,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sendEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to reject");
        return;
      }

      await refreshApplications();
    } catch {
      alert("Failed to reject application");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered =
    filter === "ALL"
      ? applications
      : applications.filter((a) => a.status === filter);

  if (!authenticated) {
    return (
      <main className="max-w-sm mx-auto px-4 py-24">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        {error && (
          <div className="border border-red-400 bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium mb-1"
            >
              Admin Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter Admin Panel"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contractor Applications</h1>
        <button
          onClick={() => {
            setAuthenticated(false);
            setPassword("");
          }}
          className="text-sm underline"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as Filter[]).map((f) => {
          const count =
            f === "ALL"
              ? applications.length
              : applications.filter((a) => a.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()} (
              {count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold">Company</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Submitted</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="py-3 pr-4">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="py-3 pr-4">{app.company}</td>
                  <td className="py-3 pr-4">{app.email}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        app.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    {app.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={actionLoading === app.id}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
                        >
                          {actionLoading === app.id
                            ? "..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(app.id, false)}
                          disabled={actionLoading === app.id}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleReject(app.id, true)}
                          disabled={actionLoading === app.id}
                          className="border border-red-600 text-red-600 px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
                        >
                          Reject + Email
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
