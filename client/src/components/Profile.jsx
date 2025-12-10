import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const maskEmail = (email) => {
    if (!email) return "";
    if (showEmail) return email;

    // Show first 2 and last 2 characters, mask the middle
    if (email.length <= 4) {
      return "*".repeat(email.length);
    }
    const start = email.slice(0, 2);
    const end = email.slice(-2);
    const middleLength = email.length - 4;
    const middleMask = "*".repeat(middleLength);
    return `${start}${middleMask}${end}`;
  };

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-3 text-sm text-slate-700">
            You are not logged in.
          </p>
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-center text-2xl font-semibold text-slate-800">
          Profile
        </h1>

        <div className="space-y-4 text-sm text-slate-700">
          {/* Username */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-600">Username</span>
            <span>{user.username}</span>
          </div>

          {/* Email with censor + toggle */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-600">Email</span>
              <span className="font-mono text-xs text-slate-800">
                {maskEmail(user.email)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowEmail((prev) => !prev)}
              className="self-end text-xs text-indigo-600 hover:underline"
            >
              {showEmail ? "Hide email" : "Show email"}
            </button>
          </div>

          {/* Login method */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-600">Login method</span>
            <div className="flex items-center gap-2">
              {/* Simple email icon (SVG) */}
              <span className="inline-flex items-center justify-center rounded-full bg-slate-100 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3 7 12 13 21 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;