import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import VerifyOtp from "./components/VerifyOtp";
import Login from "./components/Login";
import Profile from "./components/Profile";
import SetUsername from "./components/SetUsername";
import ProfileEdit from "./components/ProfileEdit";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthFromUrlAndLoadUser = async () => {
      try {
        // 1) If Google login placed token in URL fragment (#google_token=...), extract & store it
        const hash = window.location.hash; // e.g. "#google_token=..."
        if (hash && hash.includes("google_token=")) {
          const params = new URLSearchParams(hash.replace("#", ""));
          const token = params.get("google_token");
          if (token) {
            localStorage.setItem("token", token);
            // remove the fragment without reloading the page
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
            // optional: navigate to home after storing token
            navigate("/", { replace: true });
          }
        }

        // 2) Try to load user info from backend
        const token = localStorage.getItem("token");

        // If token exists, call /api/auth/me with Bearer header
        if (token) {
          const res = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
              return;
            }
          } else {
            // token invalid/expired -> clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } else {
          // No token in storage: try cookie-based auth (if you later set httpOnly cookie)
          // This call includes credentials so browser will send cookies (if any)
          const res = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
            }
          }
        }
      } catch (err) {
        // don't break UI if network fails; just log
        console.error("Auth load failed:", err);
      }
    };

    handleAuthFromUrlAndLoadUser();
    // run once on mount
  }, [navigate]);

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
            <Route path="/set-username" element={<SetUsername />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;