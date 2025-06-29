"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useRouter } from "next/navigation";
import UserNavbar from "@/components/ui/UserNavbar.js";
import { toast } from "react-toastify";

// Register Chart.js components
Chart.register(...registerables);

export default function GetLoan() {
  const [formData, setFormData] = useState({
    fullName: "",
    loanAmount: "",
    tenure: "",
    employmentStatus: "",
    reason: "",
    employmentAddress: "",
    agreeTerms: false,
    agreeCreditInfo: false,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      toast.error("Please accept the terms and conditions before submitting.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("userToken");

    const requestData = {
      amount: parseInt(formData.loanAmount, 10),
      tenure: parseInt(formData.tenure, 10),
      empStatus: formData.employmentStatus,
      reason: formData.reason,
      empAddress: formData.employmentAddress,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Loan application submitted successfully!");
        router.push("/dashboard/user");
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit loan application.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Loan Trends",
        data: [200, 500, 700, 400, 800, 600, 900, 300, 750, 450],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="flex justify-center items-center flex-1 p-4 md:p-6 mt-12">
        <Card className="w-full max-w-4xl shadow-lg bg-white rounded-xl">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800">
              Apply for a Loan
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
              <Input name="loanAmount" type="number" placeholder="Loan Amount ($)" value={formData.loanAmount} onChange={handleChange} required />
              <Input name="tenure" type="number" placeholder="Tenure (Months)" value={formData.tenure} onChange={handleChange} required />
              <Input name="employmentStatus" placeholder="Employment Status" value={formData.employmentStatus} onChange={handleChange} required />
              <Input name="employmentAddress" placeholder="Employment Address" value={formData.employmentAddress} onChange={handleChange} required />
              <Textarea name="reason" placeholder="Reason for Loan" value={formData.reason} onChange={handleChange} required className="md:col-span-2" />

              {/* Checkboxes full-width */}
             {/* Checkboxes side by side */}
<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="flex items-start space-x-2 text-sm text-gray-600">
    <Checkbox
      checked={formData.agreeTerms}
      onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked)}
    />
    <label className="leading-snug">
      I have read the important information and agree to the{" "}
      <span className="text-green-600 underline">terms and conditions</span>
    </label>
  </div>

  <div className="flex items-start space-x-2 text-sm text-gray-600">
    <Checkbox
      checked={formData.agreeCreditInfo}
      onCheckedChange={(checked) => handleCheckboxChange("agreeCreditInfo", checked)}
    />
    <label className="leading-snug">
      Any personal and credit information may be disclosed from time to time to financial institutions, credit bureaus, and other third parties as necessary for the purpose of processing this application and managing the loan.
      <span className="text-green-600 underline">Learn more</span>
    </label>
  </div>
</div>


              {/* <div className="flex items-start space-x-2 text-sm text-gray-600 md:col-span-2">
                <Checkbox checked={formData.agreeCreditInfo} onCheckedChange={(checked) => handleCheckboxChange("agreeCreditInfo", checked)} />
                <label>I consent to my credit information being shared with financial institutions.</label>
              </div> */}

              <Button type="submit" disabled={loading} className="md:col-span-2 w-full bg-green-600 text-white hover:bg-green-700 py-2 rounded-lg transition">
                {loading ? "Submitting..." : "Apply Now"}
              </Button>
            </form>

            {/* Chart Section */}
            <div className="mt-8">
  <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Loan Trends</h3>
  <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-center">
    <img
      src="/graph.webp" // update the path if hosted somewhere else
      alt="Loan Trends"
      className="max-h-[400px] w-auto object-contain"
    />
  </div>
</div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}