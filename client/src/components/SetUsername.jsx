import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SetUsername = () => {
  const query = useQuery();
  const pendingId = query.get("pendingId");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Optional: fetch pending info (email) from server to show email
  useEffect(() => {
    if (!pendingId) return;
    // We can create an endpoint to fetch GoogleUser by id if desired.
    // For now skip fetch — we rely on redirect carrying pendingId and frontend will just show username input.
    // If you want to fetch email, implement GET /api/auth/google/pending/:id
  }, [pendingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!pendingId) {
      setError("No signup session found. Please signup with Google again.");
      return;
    }
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/google/set-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingId, username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to set username.");
        setLoading(false);
        return;
      }

      // success -> redirect to login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Network error.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-2xl font-semibold mb-2">Choose a username</h1>
        <p className="text-center text-sm text-slate-500 mb-4">
          Complete your Google signup by picking a unique username.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourusername"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Set username"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetUsername;