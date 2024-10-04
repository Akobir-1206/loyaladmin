import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './Components/Login/Login'
import Sidebar from './Components/Home'
import Category from './pages/Category'
import News from './pages/News'
import Faqs from './pages/Faqs'
import Services from './pages/Services'
import Sources from './pages/Sources'
import Blogs from './pages/Blogs'
import ProtectedRoute from './Components/Login/Protect'
import Home from './Components/Home/Home'

function App() {
  return (
    <Routes>
      {/* Login sahifasi */}
      <Route path='/login' element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
        <Route index element={<Category />} />
        <Route path="category" element={<Category />} />
        <Route path="news" element={<News />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="services" element={<Services />} />
        <Route path="sources" element={<Sources />} />
        <Route path="blogs" element={<Blogs />} />
      </Route>

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App



