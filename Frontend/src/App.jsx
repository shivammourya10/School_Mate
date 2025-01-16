import { Routes, Route } from 'react-router-dom';
import './App.css';
import AdminSignUp from './pages/AdminSignUp';
import AdminSignIn from './pages/AdminSignIn';
import AdminHomePage from './pages/AdminHomePage';
import ViewCertPage from './pages/ViewCertPage';
import ViewSyllabusPage from './pages/ViewSyllabusPage';
import ViewFeesPage from './pages/ViewFeesPage';
import ViewImgGalleryPage from './pages/ViewImgGalleryPage';
import UploadCertPage from './pages/UploadCertPage';
import UploadSyllabusPage from './pages/UploadSyllabusPage';
import UploadFeesPage from './pages/UploadFeesPage';
import UploadImgGalleryPage from './pages/UploadGalleryItemPage';
import { Navigate } from 'react-router-dom';

function App() {
  const checkAuth = () => {
    const token = localStorage.getItem('auth_token'); // or use cookies
    return token ? true : false;
  };

  return (
    <div>
      <Routes>
        {/* <Route path="/admin-signup" element={<AdminSignUp />} /> */}
        <Route path="/admin-signin" element={<AdminSignIn />} />

        {/* Protected Admin Routes */}
        <Route
          path="admin-homepage"
          element={checkAuth() ? <AdminHomePage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-getcertificates"
          element={checkAuth() ? <ViewCertPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-getsyllabus"
          element={checkAuth() ? <ViewSyllabusPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-getfees"
          element={checkAuth() ? <ViewFeesPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-getgallery"
          element={checkAuth() ? <ViewImgGalleryPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-add-certificates"
          element={checkAuth() ? <UploadCertPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-add-syllabus"
          element={checkAuth() ? <UploadSyllabusPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-add-fees"
          element={checkAuth() ? <UploadFeesPage /> : <Navigate to="/admin-signin" />}
        />
        <Route
          path="/admin-add-gallery"
          element={checkAuth() ? <UploadImgGalleryPage /> : <Navigate to="/admin-signin" />}
        />
      </Routes>
    </div>
  );
}

export default App