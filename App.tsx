import React, { useState } from "react";
import { ApplicationForm } from "./components/ApplicationForm";
import { SuccessScreen } from "./components/SuccessScreen";
import { Header } from "./components/Header";
import { Toaster, toast } from "react-hot-toast";

/**
 * Sends application data to Netlify Function for email
 * Backend already exists and is working
 */
async function sendApplicationEmail(payload: any) {
  const res = await fetch("/.netlify/functions/sendApplicationEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to send application email");
  }
}

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  /**
   * Called ONLY after the form is completed successfully
   * This is the single point where backend email is triggered
   */
  const handleSuccess = async (tId: string, formData?: any) => {
    try {
      // Send email to backend (admin + optional student)
      await sendApplicationEmail({
        trackingNumber: tId,
        application: formData, // full form data for admin
      });

      setTrackingNumber(tId);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      toast.error(
        "Application saved, but email notification failed. Please contact admin."
      );
    }
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
          &copy; {new Date().getFullYear()} AA Maritime & Offshore Institute. All
          Rights Reserved.
        </p>
      </footer>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
