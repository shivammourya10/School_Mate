import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";

const AdminHomePage = () => {
  const [dashboardData, setDashboardData] = useState({
    certificates: [],
    syllabus: [],
    fees: [],
    children: []
  });
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const logout = async () =>{
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/adminLogout`,{ withCredentials: true });
      if (response.status === 200) {
        navigate("/admin-signin");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      
    }
  }

 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [certificatesRes, syllabusRes, feesRes] = await Promise.all([
          axios.get("/certificates"),
          axios.get("/syllabus"),
          axios.get("/fees"),
        ]);

        setDashboardData({
          certificates: certificatesRes.data.Certificates || [],
          syllabus: syllabusRes.data.syllabus || [],
          fees: feesRes.data.fees || [],
          children: [] // If you have a children endpoint, add it here
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const cardConfigs = [
    {
      title: "View Certificates",
      route: "/admin-getcertificates",
      icon: "📜",
      count: dashboardData.certificates.length,
      isAddCard: false
    },
    {
      title: "View Syllabus",
      route: "/admin-getsyllabus",
      icon: "📚",
      count: dashboardData.syllabus.length,
      isAddCard: false
    },
    {
      title: "View Fees",
      route: "/admin-getfees",
      icon: "💰",
      count: dashboardData.fees.length,
      isAddCard: false
    },
    {
      title: "View Gallery",
      route: "/admin-getgallery",
      icon: "👶",
      count: dashboardData.children.length,
      isAddCard: false
    },
    {
      title: "Add Certificate",
      route: "/admin-add-certificates",
      icon: "➕",
      count: 0,
      isAddCard: true
    },
    {
      title: "Add Syllabus",
      route: "/admin-add-syllabus",
      icon: "➕",
      count: 0,
      isAddCard: true
    },
    {
      title: "Add Fees",
      route: "/admin-add-fees",
      icon: "➕",
      count: 0,
      isAddCard: true
    },
    {
      title: "Add Gallery Item",
      route: "/admin-add-gallery",
      icon: "➕",
      count: 0,
      isAddCard: true
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <div className="mt-2 h-1 w-full bg-blue-600 mx-auto"></div>
        </div>
        <div className="relative z-10">
          <div
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            A
          </div>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={() => navigate("/change-password")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Change Password
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfigs.map((config, index) => (
          <DashboardCard
            key={index}
            title={config.title}
            count={config.count}
            icon={config.icon}
            onClick={() => navigate(config.route)}
            isAddCard={config.isAddCard}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminHomePage;