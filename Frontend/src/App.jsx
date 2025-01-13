import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import AdminSignUp from './pages/AdminSignUp'
import AdminSignIn from './pages/AdminSignIn'
import AdminHomePage from './pages/AdminHomePage'
import ViewCertPage from './pages/ViewCertPage'
import ViewSyllabusPage from './pages/ViewSyllabusPage'
import ViewFeesPage from './pages/ViewFeesPage'
import ViewImgGalleryPage from './pages/ViewImgGalleryPage'
import AdminProtectedWrapper from './pages/AdminProtectedWrapper';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path="/admin-signup" element={<AdminSignUp />} />
        <Route path="/admin-signin" element={<AdminSignIn />} />

        {/* <Route element={<AdminProtectedWrapper />}> */}
          <Route path="/admin-homepage" element={<AdminHomePage />} />
          <Route path="/admin-getcertificates" element={<ViewCertPage />} />
          <Route path="/admin-getsyllabus" element={<ViewSyllabusPage />} />
          <Route path="/admin-getfees" element={<ViewFeesPage />} />
          <Route path="/admin-getgallery" element={<ViewImgGalleryPage />} />
        {/* </Route> */}
      </Routes>
    </div>
  )
}

export default App
