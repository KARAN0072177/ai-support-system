// client/src/components/Profile.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AvatarUploader from "./AvatarUploader";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Switch } from "@radix-ui/react-switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  User,
  Mail,
  Globe,
  Clock,
  Bell,
  Edit2,
  Save,
  X,
  Shield,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

/**
 * Enhanced linkify with better URL detection and safety
 */
const linkify = (text) => {
  if (!text) return "";
  const urlRegex = /((https?:\/\/)|(www\.))[^\s/$.?#].[^\s]*/gi;
  return text.split(urlRegex).map((part, idx) => {
    if (!part) return null;
    if (part.match(urlRegex)) {
      let href = part;
      if (!href.startsWith("http")) href = "https://" + href;
      return (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors group"
        >
          {part}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
];

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Asia/Kolkata", label: "IST (Indian Standard Time)" },
  { value: "America/New_York", label: "EST (Eastern Time)" },
  { value: "Europe/London", label: "GMT (Greenwich Mean Time)" },
  { value: "Asia/Tokyo", label: "JST (Japan Standard Time)" },
  { value: "America/Los_Angeles", label: "PST (Pacific Time)" },
  { value: "Australia/Sydney", label: "AEST (Australian Eastern Time)" },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showEmail, setShowEmail] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const notificationPrefs = watch("notificationPrefs");

  // Load user from backend
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      try {
        if (token) {
          const res = await fetch("http://localhost:5000/api/profile/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              setUser(data.user);
              localStorage.setItem("user", JSON.stringify(data.user));
              reset({
                displayName: data.user.displayName || "",
                bio: data.user.bio || "",
                language: data.user.language || "en",
                timezone: data.user.timezone || "UTC",
                notificationPrefs: data.user.notificationPrefs || {
                  newsletter: "weekly",
                  updates: true,
                  offers: true,
                  mentions: true,
                },
              });
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }

      // Fallback to localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUser(u);
          reset({
            displayName: u.displayName || "",
            bio: u.bio || "",
            language: u.language || "en",
            timezone: u.timezone || "UTC",
            notificationPrefs: u.notificationPrefs || {
              newsletter: "weekly",
              updates: true,
              offers: true,
              mentions: true,
            },
          });
        } catch (err) {
          console.error("Error parsing user:", err);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [reset]);

  const isGoogle = (user?.provider || "").toLowerCase() === "google";

  const maskEmail = (email) => {
    if (!email) return "";
    if (showEmail) return email;
    
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    
    const maskedLocal = local.length <= 2 
      ? "*".repeat(local.length)
      : `${local.slice(0, 2)}${"*".repeat(Math.max(0, local.length - 2))}`;
    
    return `${maskedLocal}@${domain}`;
  };

  const onSubmit = async (data) => {
    try {
      setLoadingSave(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Save failed");

      // Update state
      setUser(responseData.user);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      
      // Show success animation
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditing(false);
      }, 2000);
      
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message || "Failed to save profile");
    } finally {
      setLoadingSave(false);
    }
  };

  const onAvatarUploaded = (avatarUrl) => {
    const updated = { ...user, avatarUrl };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-800 rounded-lg"></div>
          <div className="flex gap-4">
            <div className="h-24 w-24 bg-gray-800 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="mb-3 text-xl font-semibold text-white">Authentication Required</h3>
          <p className="mb-6 text-sm text-gray-400">Please sign in to access your profile</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Manage your personal information and preferences
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              {saveSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Saved!</span>
                </motion.div>
              ) : editing ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      reset();
                      setEditing(false);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loadingSave}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                  >
                    {loadingSave ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {loadingSave ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <motion.button
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setEditing(true)}
                  className="group flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-all hover:border-gray-600"
                >
                  <Edit2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Edit Profile
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Avatar & Basic Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Avatar Card */}
              <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="p-6">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="relative">
                      {user.avatarUrl || user.avatar ? (
                        <img
                          src={user.avatarUrl || user.avatar}
                          alt="Profile"
                          className="h-32 w-32 rounded-full border-4 border-gray-800 object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-800">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-2">
                        <Edit2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-white">
                      {user.displayName || user.username}
                    </h2>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>

                  {editing && (
                    <div className="mb-6">
                      <AvatarUploader 
                        initialUrl={user.avatarUrl || user.avatar} 
                        onUploaded={onAvatarUploaded} 
                      />
                    </div>
                  )}

                  {/* Account Type Badge */}
                  <div className="rounded-xl bg-gray-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isGoogle ? (
                          <>
                            <div className="rounded-lg bg-white p-2">
                              <svg className="h-5 w-5" viewBox="0 0 533.5 544.3">
                                <path fill="#4285f4" d="M533.5 278.4c0-17.3-1.4-34-4.2-50.2H272v95.1h147.4c-6.3 34-25 62.8-53.4 82.1v68.2h86.3c50.4-46.5 79.2-114.9 79.2-195.2z"/>
                                <path fill="#34a853" d="M272 544.3c72.6 0 133.6-23.9 178.1-64.9l-86.3-68.2c-24 16-54.8 25.4-91.8 25.4-70.6 0-130.5-47.6-152-111.4H33.6v69.9C77.9 480.3 169.1 544.3 272 544.3z"/>
                                <path fill="#fbbc04" d="M120 323.7c-10.8-32.4-10.8-67.3 0-99.7V154.1H33.6C12 197.1 0 243.9 0 292.6s12 95.5 33.6 138.5L120 323.7z"/>
                                <path fill="#ea4335" d="M272 109.6c39 0 74 13.4 101.6 39l76-76C406.5 27.6 344.6 0 272 0 169.1 0 77.9 64 33.6 154.1l86.4 69.9c21.5-63.8 81.4-111.4 152-111.4z"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">Google Account</p>
                              <p className="text-xs text-gray-400">Connected</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="rounded-lg bg-gray-700 p-2">
                              <Mail className="h-5 w-5 text-gray-300" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">Email Account</p>
                              <p className="text-xs text-gray-400">Standard login</p>
                            </div>
                          </>
                        )}
                      </div>
                      <Shield className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-300">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Email Verified</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">2FA Enabled</span>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Profile Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Profile Details Card */}
              <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="mb-6 text-lg font-semibold text-white">Personal Information</h3>
                  
                  {!editing ? (
                    <div className="space-y-6">
                      {/* Email with toggle */}
                      <div className="rounded-xl bg-gray-800/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2">
                              <Mail className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-400">Email Address</p>
                              <p className="font-mono text-sm text-white">
                                {maskEmail(user.email)}
                              </p>
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setShowEmail(!showEmail)}
                                className="rounded-lg bg-gray-800 p-2 hover:bg-gray-700 transition-colors"
                              >
                                {showEmail ? (
                                  <EyeOff className="h-4 w-4 text-gray-300" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-300" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{showEmail ? "Hide email" : "Reveal email"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <User className="h-4 w-4 text-purple-400" />
                          </div>
                          <h4 className="text-sm font-semibold text-gray-300">Bio</h4>
                        </div>
                        <div className="rounded-xl bg-gray-800/30 p-4">
                          <p className="text-sm text-gray-300">
                            {user.bio ? linkify(user.bio) : "No bio provided"}
                          </p>
                        </div>
                      </div>

                      {/* Language & Timezone */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-gray-800/30 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium text-gray-400">Language</span>
                          </div>
                          <p className="text-sm text-white">
                            {languages.find(l => l.code === user.language)?.label || user.language}
                          </p>
                        </div>
                        <div className="rounded-xl bg-gray-800/30 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-400">Timezone</span>
                          </div>
                          <p className="text-sm text-white">{user.timezone}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Display Name */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Display Name
                        </label>
                        <input
                          {...register("displayName")}
                          className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Enter your display name"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                          Bio <span className="text-gray-500">(Supports links)</span>
                        </label>
                        <textarea
                          {...register("bio")}
                          rows={4}
                          className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      {/* Language & Timezone */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-300">
                            Language
                          </label>
                          <Select
                            value={watch("language")}
                            onValueChange={(value) => setValue("language", value)}
                          >
                            <SelectTrigger className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-gray-800 bg-gray-900 text-white">
                              {languages.map((lang) => (
                                <SelectItem
                                  key={lang.code}
                                  value={lang.code}
                                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800"
                                >
                                  <span>{lang.flag}</span>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-300">
                            Timezone
                          </label>
                          <Select
                            value={watch("timezone")}
                            onValueChange={(value) => setValue("timezone", value)}
                          >
                            <SelectTrigger className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-gray-800 bg-gray-900 text-white">
                              {timezones.map((tz) => (
                                <SelectItem
                                  key={tz.value}
                                  value={tz.value}
                                  className="px-4 py-2 hover:bg-gray-800"
                                >
                                  {tz.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Notifications Card */}
              <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-orange-500/10 p-2">
                      <Bell className="h-4 w-4 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-gray-800/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">Newsletter</p>
                          <p className="text-xs text-gray-500">Receive our weekly newsletter</p>
                        </div>
                        {editing ? (
                          <select
                            {...register("notificationPrefs.newsletter")}
                            className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="off">Off</option>
                          </select>
                        ) : (
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                            {user.notificationPrefs?.newsletter || "weekly"}
                          </span>
                        )}
                      </div>
                    </div>

                    {["updates", "offers", "mentions"].map((pref) => {
                      const labels = {
                        updates: "Product Updates",
                        offers: "Special Offers",
                        mentions: "Mentions & Tags",
                      };
                      const descriptions = {
                        updates: "Get notified about new features and updates",
                        offers: "Receive special offers and promotions",
                        mentions: "When someone mentions you in comments",
                      };

                      return (
                        <div key={pref} className="rounded-xl bg-gray-800/30 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-300">
                                {labels[pref]}
                              </p>
                              <p className="text-xs text-gray-500">{descriptions[pref]}</p>
                            </div>
                            {editing ? (
                              <Switch
                                checked={notificationPrefs?.[pref]}
                                onCheckedChange={(checked) =>
                                  setValue(`notificationPrefs.${pref}`, checked)
                                }
                                className="relative h-6 w-11 rounded-full bg-gray-700 data-[state=checked]:bg-blue-600"
                              >
                                <span className="block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
                              </Switch>
                            ) : (
                              <div
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  user.notificationPrefs?.[pref]
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {user.notificationPrefs?.[pref] ? "On" : "Off"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}