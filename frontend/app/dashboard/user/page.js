"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import UserNavbar from "@/components/ui/UserNavbar";
import UserProtectedRoute from "@/components/ui/UserProtectedRoute";

export default function UserDashboard() {
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setApplications(data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalLoanAmount = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loan/get-total`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setTotalLoanAmount(data.totalAmount);
      } catch (error) {
        console.error("Error fetching total loan amount:", error);
      }
    };

    fetchApplications();
    fetchTotalLoanAmount();
  }, []);

  const statusColors = {
    PENDING: "bg-yellow-400",
    VERIFIED: "bg-green-500",
    REJECTED: "bg-red-500",
    APPROVED: "bg-blue-600",
  };

  const toggleReason = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <UserProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <UserNavbar />
        <div className="max-w-5xl mx-auto mt-8">
          <div className="flex justify-between items-center bg-green-100 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 text-white p-3 rounded-full">💰</div>
              <div>
                <p className="text-gray-500 text-sm">Total Loan Amount</p>
                <p className="text-2xl font-semibold">Rs {totalLoanAmount.toFixed(2)}</p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/dashboard/user/get-loan")}
              className="bg-green-600 text-white hover:cursor-pointer"
            >
              Get A Loan
            </Button>
          </div>

          {/* Tabs: Borrow Cash | Transact | Deposit Cash */}
<div className="mt-6 flex justify-center">
  <div className="flex shadow-md rounded-full overflow-hidden border border-gray-300">
    <button
      onClick={() => router.push("/dashboard/user/get-loan")}
      className="px-6 py-2 font-semibold focus:outline-none bg-green-50 text-black border-r border-gray-300 hover:bg-green-100"
    >
      Borrow Cash
    </button>
    <button
      className="px-6 py-2 font-semibold focus:outline-none bg-white text-black border-r border-gray-300 hover:bg-gray-100"
    >
      Transact
    </button>
    <button
      
      className="px-6 py-2 font-semibold focus:outline-none bg-white text-black hover:bg-gray-100"
    >
      Deposit Cash
    </button>
  </div>
</div>


          <div className="mt-6 relative">
            <Input
              type="text"
              placeholder="Search for loans"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <Search className="absolute top-2 right-4 text-gray-500" />
          </div>

          <Card className="mt-8 shadow-lg">
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Applied Loans
              </h2>

              <div className="flex justify-between text-gray-500 text-sm border-b pb-2">
                <p>Tenure</p>
                <p>Amount</p>
                <p>Date Applied</p>
                <p>Status</p>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 mt-4">Loading applications...</p>
              ) : applications.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No loan applications found.</p>
              ) : (
                applications
                  .filter((loan) =>
                    loan.reason.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((loan) => (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="py-4 border-b cursor-pointer"
                      onClick={() => toggleReason(loan.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{loan.tenure} Months</p>
                          <p className="text-xs text-gray-500">
                            Updated {new Date(loan.updatedOn).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-700 font-medium">Rs.{loan.amount}</p>
                        <p className="text-gray-600">
                          {new Date(loan.dateTime).toLocaleDateString()}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            statusColors[loan.status]
                          }`}
                        >
                          {loan.status}
                        </span>
                      </div>

                      {expandedIds.has(loan.id) && (
                        <div className="mt-2 text-sm text-gray-700">
                          <span className="font-medium">Reason:</span> {loan.reason}
                        </div>
                      )}
                    </motion.div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserProtectedRoute>
  );
}
