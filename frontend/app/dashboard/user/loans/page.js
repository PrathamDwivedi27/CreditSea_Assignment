"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import UserNavbar from "@/components/ui/UserNavbar";
import UserProtectedRoute from "@/components/ui/UserProtectedRoute";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.error("No token found, redirecting to login...");
        router.push("/login");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loan/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch loans");
      }

      const data = await response.json();
      setLoans(data.loans);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };  //   setPayingEmi(loanId);

  //   try {
  //     const token = localStorage.getItem("userToken");
  //     if (!token) {
  //       toast.error("No authentication token found. Please login again.");
  //       return;
  //     }

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/loan/pay/${loanId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to process EMI payment");
  //     }

  //     toast.success("✅ EMI Paid Successfully");

  //     // Fetch updated loan details after EMI payment
  //     fetchLoans();
  //   } catch (error) {
  //     console.error("Error processing EMI payment:", error);
  //     toast.error("❌ EMI payment failed. Please try again.");
  //   } finally {
  //     setPayingEmi(null);
  //   }
  // };

  return (
    <UserProtectedRoute>
      <div className="min-h-screen bg-green-100">
        <UserNavbar />
        <div className="max-w-4xl mx-auto mt-8 p-4">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Your Active Loans
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading your loans...</p>
          ) : loans.length === 0 ? (
            <p className="text-center text-gray-500">No active loans found.</p>
          ) : (
            loans.map((loan) => (
              <Card key={loan.id} className="mb-6 shadow-md bg-white">
                <CardContent className="p-6">
                  {/* Loan Summary */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Loan Amount Left: ₹{Math.max(0, loan.principalLeft)}
                    </h3>

                    <span className="text-sm text-gray-600">
                      {loan.tenureMonths} Months | {loan.interestRate}% Interest
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </UserProtectedRoute>
  );
}
