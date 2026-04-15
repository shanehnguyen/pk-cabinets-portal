"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PROJECT_TYPE_OPTIONS = [
  "Kitchen Remodel",
  "Bathroom",
  "New Construction",
  "Commercial",
  "Other",
];

const YEARS_OPTIONS = ["1-2", "3-5", "5-10", "10+"];

export default function HomePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const projectTypes = PROJECT_TYPE_OPTIONS.filter(
      (pt) => formData.get(`projectType-${pt}`) === "on"
    );

    const body = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      licenseNumber: formData.get("licenseNumber"),
      yearsExperience: formData.get("yearsExperience"),
      serviceArea: formData.get("serviceArea"),
      projectTypes,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      router.push("/apply/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-4">PK Cabinets Contractor Program</h1>
        <p className="text-lg mb-2">
          Join our network of trusted contractors and gain access to trade pricing,
          dedicated sales support, and our full catalog of premium cabinet lines.
        </p>
        <p>
          Fill out the application below and our team will review your information.
          Approved contractors get immediate access to the contractor dashboard.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Apply Now</h2>

        {error && (
          <div className="border border-red-400 bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
                License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="yearsExperience" className="block text-sm font-medium mb-1">
                Years of Experience *
              </label>
              <select
                id="yearsExperience"
                name="yearsExperience"
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select...</option>
                {YEARS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="serviceArea" className="block text-sm font-medium mb-1">
                Service Area *
              </label>
              <input
                type="text"
                id="serviceArea"
                name="serviceArea"
                required
                placeholder="e.g. Los Angeles Metro"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium mb-2">Project Types *</legend>
            <div className="space-y-2">
              {PROJECT_TYPE_OPTIONS.map((pt) => (
                <label key={pt} className="flex items-center gap-2">
                  <input type="checkbox" name={`projectType-${pt}`} />
                  <span>{pt}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>
    </main>
  );
}
