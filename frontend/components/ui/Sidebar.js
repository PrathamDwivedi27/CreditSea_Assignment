"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Banknote,
  CheckCircle,
  Scale,
  CreditCard,
  BarChart2,
  FileText,
  Settings2,
  PiggyBank,
  ReceiptText,
  PencilLine,
  Briefcase,
  CalendarDays,
  Cog,
  LogOut,
  X,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Borrowers", icon: <Users className="w-5 h-5" /> },
  { name: "Loans", icon: <Banknote className="w-5 h-5" /> },
  { name: "Repayments", icon: <CheckCircle className="w-5 h-5" /> },
  { name: "Loan Parameters", icon: <Scale className="w-5 h-5" /> },
  { name: "Accounting", icon: <CreditCard className="w-5 h-5" /> },
  { name: "Reports", icon: <BarChart2 className="w-5 h-5" /> },
  { name: "Collateral", icon: <FileText className="w-5 h-5" /> },
  { name: "Access Configuration", icon: <Settings2 className="w-5 h-5" /> },
  { name: "Savings", icon: <PiggyBank className="w-5 h-5" /> },
  { name: "Expenses", icon: <ReceiptText className="w-5 h-5" /> },
];

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const router = useRouter();

  return (
    <aside
      className={`fixed md:static top-0 left-0 w-64 bg-green-900 text-white p-5 transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:block z-50`}
    >
      {/* Close Button for Mobile */}
      <button
        className="md:hidden absolute top-4 right-4 text-white"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={24} />
      </button>

      {/* Admin Profile */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
        <p className="text-lg font-semibold">Mr Fool</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-green-700 cursor-pointer transition"
            // onClick={() => router.push('/your-path')} // Optional: Define per route
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </div>
        ))}

        {/* Sign Out */}
        <button
          className="mt-6 flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-red-700 transition w-full text-left"
          onClick={() => {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userRole");
            router.push("/");
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
