"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid email or password");

      const data = await res.json();
      toast.success("Login successful!");
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userRole", data.user.role);

      if (data.user.role === "USER") router.push("/dashboard/user");
      else if (["ADMIN", "SUPER_ADMIN"].includes(data.user.role)) router.push("/dashboard/admin");
      else if (data.user.role === "VERIFIER") router.push("/dashboard/verifier");
    } catch (err) {
      setError(err.message);
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        {/* Left Side - Credentials */}
        <motion.div
          className="w-full md:w-1/2 max-w-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl bg-white border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-green-700">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-green-700 text-white hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <span
                  className="text-green-700 cursor-pointer hover:underline"
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Test credentials */}
          {/* <div className="bg-gray-50 px-4 py-2 rounded-lg shadow-md border border-gray-200 mt-3">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">For Testing Purposes</h3>
            <div className="text-gray-700 space-y-1">
              <div>
                <span className="font-medium text-blue-400">Admin Email:</span>{" "}
                pratham@gmail.com
              </div>
              <div>
                <span className="font-medium text-blue-400">Verifier Email:</span>{" "}
                prathamd549@gmail.com
              </div>
              <div>
                <span className="font-medium text-blue-400">Password:</span> 1234
              </div>
            </div>
          </div> */}
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/mobile.jpg" // replace with actual image path
            alt="Loan Illustration"
            className="max-h-[450px] object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
