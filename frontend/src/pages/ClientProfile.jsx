import React, { useEffect, useMemo, useState, memo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ProjectCard from "../components/ProjectCard";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { reviewsAPI } from "../utils/reviewsAPI";
import ReviewCard from "../components/ReviewCard";

/* ----------------- Small utils ----------------- */

const pickDefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

/* ----------------- Child components (memoized) ----------------- */

const Stars = ({ value = 0 }) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.floor(value) ? "text-yellow-400" : "text-gray-300"}>
      ⭐
    </span>
  ));

const HeaderCard = memo(function HeaderCard({
  profile,
  draft,
  editMode,
  canSave,
  saving,
  onStartEdit,
  onCancel,
  onSave,
  onChange,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {(profile.companyName || "TC").slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div className="w-full md:max-w-xl">
              {editMode ? (
                <>
                  <input
                    className="text-2xl font-bold text-gray-900 border rounded-lg p-2 w-full mb-2"
                    value={draft.companyName ?? ""}
                    onChange={(e) => onChange("companyName", e.target.value)}
                    placeholder="Company name"
                    autoFocus
                  />
                  <input
                    className="text-lg text-gray-600 border rounded-lg p-2 w-full"
                    value={draft.industryType ?? ""}
                    onChange={(e) => onChange("industryType", e.target.value)}
                    placeholder="Industry type"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.companyName || "—"}</h1>
                  <p className="text-lg text-gray-600">{profile.industryType || "—"}</p>
                </>
              )}

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📍 {profile.location || "—"}</span>
                <span>📅 Member since {profile.joinDate || "—"}</span>
              </div>
            </div>

            {!editMode ? (
              <button
                onClick={() => onStartEdit()}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  disabled={!canSave}
                  onClick={onSave}
                  className={`px-4 py-2 rounded-lg text-white ${saving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={onCancel} className="px-4 py-2 rounded-lg border">
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                <Stars value={profile.rating || 0} />
              </div>
              <span className="font-medium text-gray-900">{profile.rating || 0}</span>
              <span className="text-gray-500">({profile.totalReviews || 0} reviews)</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{profile.projectsPosted || 0}</span> projects posted
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{profile.hiredStudents || 0}</span> students hired
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const AboutCard = memo(function AboutCard({
  profile,
  draft,
  editMode,
  canSave,
  saving,
  onStartEdit,
  onCancel,
  onSave,
  onChange,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">About Company</h3>
        {!editMode ? (
          <button onClick={onStartEdit} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              disabled={!canSave}
              onClick={onSave}
              className={`px-3 py-1.5 rounded-lg text-white ${saving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border">
              Cancel
            </button>
          </div>
        )}
      </div>

      {editMode ? (
        <textarea
          className="w-full p-3 border rounded-lg resize-none"
          rows="4"
          value={draft.description ?? ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your company…"
          autoFocus
        />
      ) : (
        <p className="text-gray-600 leading-relaxed">{profile.description || "No description yet."}</p>
      )}
    </div>
  );
});

const DetailsCard = memo(function DetailsCard({
  profile,
  draft,
  editMode,
  canSave,
  saving,
  onStartEdit,
  onCancel,
  onSave,
  onChange,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
        {!editMode ? (
          <button onClick={onStartEdit} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              disabled={!canSave}
              onClick={onSave}
              className={`px-3 py-1.5 rounded-lg text-white ${saving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border">
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {/* Industry */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">🏢</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Industry</p>
              {editMode ? (
                <input
                  className="w-full p-2 border rounded-lg"
                  value={draft.industryType ?? ""}
                  onChange={(e) => onChange("industryType", e.target.value)}
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.industryType || "—"}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">📍</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Location</p>
              {editMode ? (
                <input
                  className="w-full p-2 border rounded-lg"
                  value={draft.location ?? ""}
                  onChange={(e) => onChange("location", e.target.value)}
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.location || "—"}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">🌐</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Website</p>
              {editMode ? (
                <input
                  className="w-full p-2 border rounded-lg"
                  value={draft.website ?? ""}
                  onChange={(e) => onChange("website", e.target.value)}
                />
              ) : profile.website ? (
                <a
                  href={`https://${profile.website.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {profile.website}
                </a>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Size */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">👥</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Company Size</p>
              {editMode ? (
                <input
                  className="w-full p-2 border rounded-lg"
                  value={draft.companySize ?? ""}
                  onChange={(e) => onChange("companySize", e.target.value)}
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.companySize || "—"}</p>
              )}
            </div>
          </div>

          {/* Member since */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">📅</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Member Since</p>
              {editMode ? (
                <input
                  className="w-full p-2 border rounded-lg"
                  value={draft.joinDate ?? ""}
                  onChange={(e) => onChange("joinDate", e.target.value)}
                  placeholder="January 2024"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.joinDate || "—"}</p>
              )}
            </div>
          </div>

          {/* Response time */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">⏱️</span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Avg Response Time</p>
              {editMode ? (
                <input
                  className="w-full p-2 border rounded-lg"
                  value={draft.responseTime ?? ""}
                  onChange={(e) => onChange("responseTime", e.target.value)}
                  placeholder="e.g., 4 hours"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.responseTime || "—"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* --------------------------- Page component --------------------------- */

const emptyProfile = {
  companyName: "",
  industryType: "",
  location: "",
  joinDate: "",
  website: "",
  companySize: "",
  profileImage: "",
  rating: 0,
  totalReviews: 0,
  projectsPosted: 0,
  totalSpent: "₹0",
  hiredStudents: 0,
  responseTime: "",
  description: "",
  postedProjects: [],
  hiredHistory: [],
  reviews: [],
  stats: [],
};

export default function ClientProfile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState([]);

  const [editMode, setEditMode] = useState({ header: false, about: false, details: false });

  const canSave = useMemo(
    () => !saving && (editMode.header || editMode.about || editMode.details),
    [saving, editMode]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/profile");
        if (res.data?.success) {
          const data = { ...emptyProfile, ...(res.data?.data || {}) };
          setProfile(data);
          setDraft(data);
        }
      } catch (err) {
        console.error("load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (user?._id) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      if (user?._id) {
        console.log('🔍 Fetching reviews for user:', user._id);
        // Use getMyReviews instead to get received reviews for the logged-in user
        const response = await reviewsAPI.getMyReviews('received');
        console.log('📦 Full response:', JSON.stringify(response, null, 2));
        console.log('📦 Response structure:', {
          hasSuccess: 'success' in response,
          successValue: response.success,
          hasData: 'data' in response,
          dataType: typeof response.data,
          dataIsArray: Array.isArray(response.data)
        });
        
        if (response.success) {
          const reviewsList = response.data || [];
          console.log('✅ Reviews found:', reviewsList.length);
          console.log('✅ First review:', reviewsList[0]);
          setReviews(reviewsList);
        } else {
          console.log('❌ Failed to fetch reviews:', response);
        }
      } else {
        console.log('⚠️ No user ID available');
      }
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  // helpers
  const startEdit = (section) => {
    setDraft(profile);
    setEditMode((m) => ({ ...m, [section]: true }));
  };
  const cancelEdit = (section) => {
    setDraft(profile);
    setEditMode((m) => ({ ...m, [section]: false }));
  };
  const onChange = (name, value) => setDraft((d) => ({ ...d, [name]: value }));

  const saveSection = async (section) => {
    if (saving) return;
    setSaving(true);

    let payload = {};
    if (section === "about") {
      payload = pickDefined({ description: draft.description });
    } else if (section === "details") {
      payload = pickDefined({
        industryType: draft.industryType,
        location: draft.location,
        website: draft.website,
        companySize: draft.companySize,
        joinDate: draft.joinDate,
        responseTime: draft.responseTime,
      });
    } else if (section === "header") {
      payload = pickDefined({
        companyName: draft.companyName,
        industryType: draft.industryType,
      });
    }

    try {
      // console.log("PUT /profile payload:", payload);
      const res = await api.put("/profile", payload);
      // console.log("PUT /profile response:", res.status, res.data);
      if (res.data?.success) {
        const data = { ...emptyProfile, ...(res.data?.data || {}) };
        setProfile(data);
        setDraft(data);
        setEditMode((m) => ({ ...m, [section]: false }));
      } else {
        alert(res.data?.error || "Failed to save");
      }
    } catch (err) {
      console.error("save profile error:", err?.response?.status, err?.response?.data || err);
      alert(err?.response?.data?.error || "Failed to save. See console.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏢" },
    { id: "projects", label: "Posted Projects", icon: "📁" },
    { id: "hired", label: "Hired Students", icon: "👥" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
  ];

  const HiringStatsCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(profile.stats || []).map((stat, i) => (
          <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{stat.projects}</div>
            <div className="text-sm text-gray-600 mb-1">{stat.category}</div>
            <div className="text-xs text-gray-500">Avg: {stat.avgBudget}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <div className="text-2xl font-bold text-gray-900">{profile.projectsPosted}</div>
        <div className="text-sm text-gray-600">Projects Posted</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <div className="text-2xl font-bold text-gray-900">{profile.hiredStudents}</div>
        <div className="text-sm text-gray-600">Students Hired</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <div className="text-2xl font-bold text-gray-900">{profile.totalSpent}</div>
        <div className="text-sm text-gray-600">Total Spent</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <div className="text-2xl font-bold text-gray-900">{profile.rating}</div>
        <div className="text-sm text-gray-600">Average Rating</div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Posted Projects</h3>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Post New Project</button>
      </div>
      <div className="space-y-4">
        {(profile.postedProjects || []).map((p) => (
          <ProjectCard key={p.id || p._id} project={p} isClientView />
        ))}
      </div>
    </div>
  );

  const renderHired = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Hired Students History</h3>
      <div className="space-y-6">
        {(profile.hiredHistory || []).map((h) => (
          <div key={h.id || h._id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {h.studentName?.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{h.studentName}</h4>
                  <p className="text-sm text-gray-500">
                    {h.project} • {h.completedDate}
                  </p>
                  <p className="text-sm font-medium text-green-600 mt-1">{h.amount}</p>
                </div>
              </div>
              <div className="flex">
                <Stars value={h.rating || 0} />
              </div>
            </div>
            <p className="text-gray-600 text-sm ml-16">{h.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Reviews ({reviews.length})
      </h3>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={user?._id}
              onUpdate={fetchReviews}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No reviews yet
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="p-6">Loading profile…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        <HeaderCard
          profile={profile}
          draft={draft}
          editMode={editMode.header}
          canSave={canSave}
          saving={saving}
          onStartEdit={() => startEdit("header")}
          onCancel={() => cancelEdit("header")}
          onSave={() => saveSection("header")}
          onChange={onChange}
        />

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <>
                <AboutCard
                  profile={profile}
                  draft={draft}
                  editMode={editMode.about}
                  canSave={canSave}
                  saving={saving}
                  onStartEdit={() => startEdit("about")}
                  onCancel={() => cancelEdit("about")}
                  onSave={() => saveSection("about")}
                  onChange={onChange}
                />

                <DetailsCard
                  profile={profile}
                  draft={draft}
                  editMode={editMode.details}
                  canSave={canSave}
                  saving={saving}
                  onStartEdit={() => startEdit("details")}
                  onCancel={() => cancelEdit("details")}
                  onSave={() => saveSection("details")}
                  onChange={onChange}
                />

                <HiringStatsCard />
                <QuickStats />
              </>
            )}
            {activeTab === "projects" && renderProjects()}
            {activeTab === "hired" && renderHired()}
            {activeTab === "reviews" && renderReviews()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
