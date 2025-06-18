"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen">
      {/* Left Green Panel */}
      <section className="w-1/3 bg-green-700 text-white flex flex-col justify-center items-start px-12">
        <h1 className="text-5xl font-bold mb-4 leading-tight">Loan Website</h1>
        {/* <p className="text-xl font-light mb-6">landing page</p> */}
        <Button 
          variant="outline" 
          className="text-green-700 bg-white font-semibold hover:bg-green-100 transition rounded-full cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Get Started
        </Button>
      </section>

      {/* Right White Content */}
      <section className="w-2/3 bg-white flex flex-col">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-12 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">
            <span className="text-green-700">Credit</span>Sea
          </h2>
          <div className="space-x-8 text-gray-700 font-medium">
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">How we work?</a>
            <a href="#">About Us</a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex px-12 py-16 items-center justify-between">
          {/* Text Content */}
          <div className="max-w-lg">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Quick and Easy Loans for Your Financial Needs.
            </h1>
            <p className="text-gray-600 mb-8">
              Our loan services offer a hassle-free and streamlined borrowing experience,
              providing you with the funds you need in a timely manner to meet your financial requirements.
            </p>
            <Button 
              className="bg-green-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-800 transition cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Get started
            </Button>
          </div>

          {/* Illustration */}
          <img
            src="/bank.jpg"
            alt="Loan Illustration"
            className="max-w-md"
          />
        </div>
      </section>
    </main>
  );
}
