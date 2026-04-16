// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";

const CABINET_LINES = [
  "Mallorca",
  "Aspen",
  "Franco",
  "Shady",
  "Irena",
  "Newport",
];

export default async function DashboardPage() {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect("/login");
  // }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contractor Dashboard</h1>
      <p className="text-lg mb-8">
        Welcome back!
      </p>

      {/* Trade Pricing */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Trade Pricing</h2>
        <div className="border rounded p-6">
          <p>Trade pricing information will appear here.</p>
        </div>
      </section>

      {/* Downloads */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Downloads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CABINET_LINES.map((line) => (
            <div key={line} className="border rounded p-4">
              <h3 className="font-semibold mb-2">{line}</h3>
              <p className="text-sm mb-3">Catalog, spec sheets, and install guides.</p>
              <button className="underline text-sm" disabled>
                Downloads coming soon
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sales Rep Contact */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Sales Rep</h2>
        <div className="border rounded p-6">
          <p className="font-semibold">Sales Representative</p>
          <p className="text-sm">Contact information will be assigned after onboarding.</p>
        </div>
      </section>
    </main>
  );
}
