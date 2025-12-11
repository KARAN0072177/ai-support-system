import { useEffect, useState } from "react";
import AvatarUploader from "./AvatarUploader";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
];

const timezones = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
];

export default function ProfileEdit() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    language: "en",
    timezone: "UTC",
    notificationPrefs: { newsletter: "weekly", updates: true, offers: true, mentions: true },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({
        displayName: u.displayName || "",
        bio: u.bio || "",
        language: u.language || "en",
        timezone: u.timezone || "UTC",
        notificationPrefs: u.notificationPrefs || { newsletter: "weekly", updates: true, offers: true, mentions: true },
      });
    }
  }, []);

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleNotifChange = (k, v) => setForm((s) => ({ ...s, notificationPrefs: { ...s.notificationPrefs, [k]: v } }));

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      // save updated user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Profile updated");
    } catch (err) {
      console.error("Profile save error", err);
      alert(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const onAvatarUploaded = (avatarUrl) => {
    const updated = { ...(user || {}), avatarUrl };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    alert("Avatar updated");
  };

  if (!user) return <div className="p-6">Please login first</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Avatar</label>
        <AvatarUploader initialUrl={user.avatarUrl || user.avatar} onUploaded={onAvatarUploaded} />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Display name</label>
        <input value={form.displayName} onChange={(e) => handleChange("displayName", e.target.value)} className="w-full rounded border px-3 py-2" />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Bio (links allowed)</label>
        <textarea value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} rows={4} className="w-full rounded border px-3 py-2" />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select value={form.language} onChange={(e) => handleChange("language", e.target.value)} className="w-full rounded border px-3 py-2">
            {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Timezone</label>
          <select value={form.timezone} onChange={(e) => handleChange("timezone", e.target.value)} className="w-full rounded border px-3 py-2">
            {timezones.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Notification preferences</label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>Newsletter frequency</span>
            <select value={form.notificationPrefs.newsletter} onChange={(e) => handleNotifChange("newsletter", e.target.value)} className="rounded border px-2 py-1">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
              <option value="off">Off</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.notificationPrefs.updates} onChange={(e) => handleNotifChange("updates", e.target.checked)} />
            <span>Product updates</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.notificationPrefs.offers} onChange={(e) => handleNotifChange("offers", e.target.checked)} />
            <span>Offers & promotions</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.notificationPrefs.mentions} onChange={(e) => handleNotifChange("mentions", e.target.checked)} />
            <span>Mentions (in tickets / replies)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} className="rounded bg-indigo-600 px-4 py-2 text-white" disabled={loading}>
          {loading ? "Saving..." : "Save profile"}
        </button>
      </div>
    </div>
  );
}