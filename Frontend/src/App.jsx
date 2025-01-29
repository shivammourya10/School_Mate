import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminSignUp from "./pages/AdminSignUp";
import AdminSignIn from "./pages/AdminSignIn";
import AdminHomePage from "./pages/AdminHomePage";
import ViewCertPage from "./pages/ViewCertPage";
import ViewSyllabusPage from "./pages/ViewSyllabusPage";
import ViewFeesPage from "./pages/ViewFeesPage";
import ViewImgGalleryPage from "./pages/ViewImgGalleryPage";
import UploadCertPage from "./pages/UploadCertPage";
import UploadSyllabusPage from "./pages/UploadSyllabusPage";
import UploadFeesPage from "./pages/UploadFeesPage";
import UploadImgGalleryPage from "./pages/UploadGalleryItemPage";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [isUser, setIsUser] = useState(() => {
    // Restore authentication state from localStorage
    return localStorage.getItem("isUser") === "true";
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkingAuthenticityOfUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/verifyUser`,
          { withCredentials: true }
        );
        console.log(response);
        if (response.status === 200) {
          setIsUser(true);
          localStorage.setItem("isUser", true);
        } else {
          setIsUser(false);
          localStorage.setItem("isUser", false);
        }
      } catch (e) {
        console.log(e);
        setIsUser(false);
        localStorage.setItem("isUser", false);
      } finally {
        setIsLoading(false);
      }
    };
    checkingAuthenticityOfUser();

    console.log("from use effect ");
  }, []);


  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center ">
        <div className="w-36 md:w-56 h-full flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle
              fill="none"
              stroke-opacity="1"
              stroke="#000000"
              stroke-width=".5"
              cx="100"
              cy="100"
              r="0"
            >
              <animate
                attributeName="r"
                calcMode="spline"
                dur="2"
                values="1;80"
                keyTimes="0;1"
                keySplines="0 .2 .5 1"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="stroke-width"
                calcMode="spline"
                dur="2"
                values="0;25"
                keyTimes="0;1"
                keySplines="0 .2 .5 1"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="stroke-opacity"
                calcMode="spline"
                dur="2"
                values="1;0"
                keyTimes="0;1"
                keySplines="0 .2 .5 1"
                repeatCount="indefinite"
              ></animate>
            </circle>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        {/* <Route path="/admin-signin" element={<AdminSignUp />} /> */}
        {console.log("isUser : ", isUser)}
        <Route
          path="/admin-signin"
          element={
            isUser === true ? (
              <Navigate to="/admin-homepage" />
            ) : (
              <AdminSignIn />
            )
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="admin-homepage"
          element={isUser ? <AdminHomePage setIsUser={setIsUser} /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-getcertificates"
          element={isUser ? <ViewCertPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-getsyllabus"
          element={
            isUser ? <ViewSyllabusPage /> : <Navigate to="/admin-signin" />
          }
        />
        <Route
          path="/admin-getfees"
          element={isUser ? <ViewFeesPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-getgallery"
          element={
            isUser ? <ViewImgGalleryPage /> : <Navigate to="/admin-signin" />
          }
        />
        <Route
          path="/admin-add-certificates"
          element={
            isUser ? <UploadCertPage /> : <Navigate to="/admin-signin" />
          }
        />
        <Route
          path="/admin-add-syllabus"
          element={
            isUser ? <UploadSyllabusPage /> : <Navigate to="/admin-signin" />
          }
        />
        <Route
          path="/admin-add-fees"
          element={
            isUser ? <UploadFeesPage /> : <Navigate to="/admin-signin" />
          }
        />
        <Route
          path="/admin-add-gallery"
          element={
            isUser ? <UploadImgGalleryPage /> : <Navigate to="/admin-signin" />
          }
        />
        <Route
          path="*"
          element={
            isUser ? (
              <Navigate to="/admin-homepage" />
            ) : (
              <Navigate to="/admin-signin" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
