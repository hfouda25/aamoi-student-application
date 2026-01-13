import React, { useState } from "react";
import { ApplicationForm } from "../components/ApplicationForm";
import { SuccessScreen } from "../components/SuccessScreen";
import { Header } from "../components/Header";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  const handleSuccess = (tId: string) => {
    setTrackingNumber(tId);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isSubmitted && trackingNumber ? (
          <SuccessScreen trackingNumber={trackingNumber} />
        ) : (
          <ApplicationForm onSuccess={handleSuccess} />
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} AA Maritime & Offshore Institute. All Rights Reserved.
        </p>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>AA MOI Student Application</h1>
      <p>React is now rendering correctly.</p>
    </div>
  );
}

