"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      const data = await res.json();

      // Show success toast
      toast.success("User registered successfully!");

      // Store token in localStorage
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userRole", data.user.role);

      // Redirect to respective dashboard
      if (data.user.role === "USER") {
        router.push("/dashboard/user");
      } else if (data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (data.user.role === "VERIFIER") {
        router.push("/dashboard/verifier");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r flex">
  {/* Left Side - Form & Credentials */}
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-xl bg-white/90 backdrop-blur-lg border border-white/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-green-700">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <Input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-green-700 text-white hover:bg-green-600 transition-all"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <motion.span
              className="text-green-700 cursor-pointer hover:underline"
              whileHover={{ scale: 1.1 }}
              onClick={() => router.push("/login")}
            >
              Login
            </motion.span>
          </p>
        </CardContent>
      </Card>

      {/* Test Credentials Section */}
      {/* <div className="bg-gray-50 px-4 py-3 rounded-lg shadow-md border border-gray-200 mt-4 w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">For Testing Purposes</h3>
        <div className="text-gray-700 space-y-1 text-sm">
          <div><span className="font-medium text-blue-600">Admin Email:</span> pratham@gmail.com</div>
          <div><span className="font-medium text-blue-600">Verifier Email:</span> prathamd549@gmail.com</div>
          <div><span className="font-medium text-blue-600">Password:</span> 1234</div>
        </div>
      </div> */}
    </motion.div>
  </div>

  {/* Right Side - Image */}
  <div className="hidden md:flex w-1/2 items-center justify-center bg-white/10">
    <img
      src="/mobile.jpg" // Replace with your actual image
      alt="Signup Illustration"
      className="w-4/5 h-auto object-contain"
    />
  </div>
</div>


  );
}
