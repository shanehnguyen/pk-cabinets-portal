import Link from "next/link";

export default function ApplySuccessPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Application Received</h1>
      <p className="text-lg mb-8">
        Thank you for applying to the PK Cabinets contractor program.
        We&apos;ll review your information and be in touch shortly.
      </p>
      <Link href="/" className="underline">
        Back to home
      </Link>
    </main>
  );
}
