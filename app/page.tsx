import CertificateGenerator from "./components/CertificateGenerator";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-16 px-4">
        <div className="absolute top-4 right-4">
          <Link
            href="/admin"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            View Admin Panel
          </Link>
        </div>
        <CertificateGenerator />
      </main>
    </div>
  );
}
