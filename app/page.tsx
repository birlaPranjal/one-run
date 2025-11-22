import CertificateGenerator from "./components/CertificateGenerator";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-16 px-4">
        <CertificateGenerator />
      </main>
    </div>
  );
}
