import { Routes, Route, Router } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import VerifyOtp from "./components/VerifyOtp";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  return (
      <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <div className="pt-16"> 
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      </Routes>
      </div>
      </div>
      </>
  );
}

export default App;