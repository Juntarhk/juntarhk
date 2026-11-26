import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Lock, LogOut, Mail, Phone, School, MessageSquare, Clock, Settings,
  Eye, EyeOff, CheckCircle, Loader2, KeyRound, Trash2, ArrowUpDown,
  Filter, ChevronDown, CheckCheck, AlertTriangle, AlertCircle, NotebookPen, Save, X,
  BarChart2, TrendingUp, BookOpen, Plus, Pencil, Star, Upload, ImageOff, Search, Globe, FileText, Tag,
  LayoutDashboard, ChevronLeft, ChevronRight, Bell, Sparkles, Activity as ActivityIcon, ArrowRight, Inbox, XCircle, Info, Shirt, ExternalLink,
} from "lucide-react";

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  kindergarten: "幼稚園",
  primary: "小學",
  secondary: "中學",
  university: "大學/專上院校",
  ngo: "非牟利機構",
  company: "企業/機構",
  other: "其他",
};

const TARGET_GROUP_LABELS: Record<string, string> = {
  kindergarten: "幼稚園",
  primary: "小學",
  secondary: "中學",
  all: "全學層",
};

const TARGET_GROUP_COLORS: Record<string, string> = {
  kindergarten: "bg-pink-100 text-pink-700",
  primary: "bg-blue-100 text-blue-700",
  secondary: "bg-purple-100 text-purple-700",
  all: "bg-gray-100 text-gray-600",
};

const MONTH_LABELS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: "待處理", color: "bg-yellow-100 text-yellow-800" },
  contacted: { label: "已聯絡", color: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-800" },
};

const CATEGORY_BADGE_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

async function fetchEnquiries(password: string) {
  const res = await fetch("/api/enquiries", {
    headers: { Authorization: `Bearer ${password}` },
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function fetchTeeOrders(password: string) {
  const res = await fetch("/api/tee/orders", {
    headers: { Authorization: `Bearer ${password}` },
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to fetch tee orders");
  return res.json();
}

async function fetchActivities() {
  const res = await fetch("/api/activities");
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}

async function fetchCategories() {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

function FilterSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-100 text-gray-700 text-xs font-medium rounded-full pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

type ProgrammeFormData = {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  categoryId: number | "";
  targetGroup: string[];
  duration: string;
  durationEn: string;
  minParticipants: number;
  maxParticipants: number;
  location: string;
  locationEn: string;
  imageUrl: string;
  images: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const emptyForm = (): ProgrammeFormData => ({
  slug: "",
  title: "",
  titleEn: "",
  description: "",
  descriptionEn: "",
  categoryId: "",
  targetGroup: ["kindergarten", "primary", "secondary"],
  duration: "",
  durationEn: "",
  minParticipants: 10,
  maxParticipants: 40,
  location: "",
  locationEn: "",
  imageUrl: "",
  images: [],
  featured: false,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
});

export default function Admin() {
  const [, setLocation] = useLocation();
  const [password, setPassword]             = useState("");
  const [showLoginPw, setShowLoginPw]       = useState(false);
  const [authedPassword, setAuthedPassword] = useState<string | null>(
    sessionStorage.getItem("admin_pw")
  );
  const [loginError, setLoginError]   = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "enquiries" | "analytics" | "settings" | "programmes" | "seo" | "teeOrders">("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; type: "success" | "error" | "info"; msg: string }[]>([]);
  const showToast = (type: "success" | "error" | "info", msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };
  const [selectedEnqIds, setSelectedEnqIds] = useState<Set<number>>(new Set());
  const [bulkActing, setBulkActing] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [enqViewMode, setEnqViewMode] = useState<"split" | "list">(() =>
    (typeof window !== "undefined" && window.localStorage.getItem("admin_enq_view") === "list") ? "list" : "split"
  );
  const [selectedEnqDetailId, setSelectedEnqDetailId] = useState<number | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("admin_enq_view", enqViewMode);
  }, [enqViewMode]);

  // Password states
  const [currentPw, setCurrentPw]     = useState("");
  const [newPw, setNewPw]             = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw]     = useState(false);
  const [pwLoading, setPwLoading]     = useState(false);
  const [pwError, setPwError]         = useState("");
  const [pwSuccess, setPwSuccess]     = useState(false);

  // Notification settings states
  const [notifEmailEnabled, setNotifEmailEnabled]     = useState(true);
  const [notifRecipient, setNotifRecipient]           = useState("info@juntarhk.com");
  const [notifAutoReply, setNotifAutoReply]           = useState(false);
  const [notifLoading, setNotifLoading]               = useState(false);
  const [notifSaving, setNotifSaving]                 = useState(false);
  const [notifError, setNotifError]                   = useState("");
  const [notifSuccess, setNotifSuccess]               = useState(false);

  // SEO settings states
  const [seoForm, setSeoForm] = useState({
    seo_title_zh: "",
    seo_title_en: "",
    seo_description_zh: "",
    seo_description_en: "",
    seo_keywords: "",
    seo_og_title: "",
    seo_og_description: "",
    seo_og_image: "",
    seo_google_verification: "",
    // per-page
    seo_page_home_title_zh: "",
    seo_page_home_title_en: "",
    seo_page_home_description_zh: "",
    seo_page_home_description_en: "",
    seo_page_home_keywords: "",
    seo_page_activities_title_zh: "",
    seo_page_activities_title_en: "",
    seo_page_activities_description_zh: "",
    seo_page_activities_description_en: "",
    seo_page_activities_keywords: "",
    seo_page_about_title_zh: "",
    seo_page_about_title_en: "",
    seo_page_about_description_zh: "",
    seo_page_about_description_en: "",
    seo_page_about_keywords: "",
    seo_page_partners_title_zh: "",
    seo_page_partners_title_en: "",
    seo_page_partners_description_zh: "",
    seo_page_partners_description_en: "",
    seo_page_partners_keywords: "",
    seo_page_contact_title_zh: "",
    seo_page_contact_title_en: "",
    seo_page_contact_description_zh: "",
    seo_page_contact_description_en: "",
    seo_page_contact_keywords: "",
    seo_page_photography_title_zh: "",
    seo_page_photography_title_en: "",
    seo_page_photography_description_zh: "",
    seo_page_photography_description_en: "",
    seo_page_photography_keywords: "",
    seo_page_ai_education_title_zh: "",
    seo_page_ai_education_title_en: "",
    seo_page_ai_education_description_zh: "",
    seo_page_ai_education_description_en: "",
    seo_page_ai_education_keywords: "",
    // Trust-section stats (admin-editable)
    stat_schools_served:       "",
    stat_activity_programmes:  "",
    stat_experience_years:     "",
    stat_campsite_sqft:        "",
  });
  const [seoSaving, setSeoSaving]   = useState(false);
  const [seoSuccess, setSeoSuccess] = useState(false);
  const [seoError, setSeoError]     = useState("");
  const [seoPageTab, setSeoPageTab] = useState<"home"|"activities"|"about"|"partners"|"contact"|"photography"|"ai_education">("home");
  const [indexnowPinging, setIndexnowPinging] = useState(false);
  const [indexnowResult, setIndexnowResult]   = useState<{ ok: boolean; message: string } | null>(null);

  // Filter / sort
  const [sortOrder, setSortOrder]             = useState<"desc" | "asc">("desc");
  const [filterSchoolType, setFilterSchoolType] = useState("all");
  const [filterStatus, setFilterStatus]       = useState("all");
  const [filterYear, setFilterYear]           = useState("all");
  const [filterMonth, setFilterMonth]         = useState("all");

  // Analytics chart year
  const [chartYear, setChartYear] = useState<string>(() => String(new Date().getFullYear()));

  // Action states (enquiries)
  const [updatingId, setUpdatingId]           = useState<number | null>(null);
  const [deletingId, setDeletingId]           = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingNotesId, setEditingNotesId]   = useState<number | null>(null);
  const [notesDraft, setNotesDraft]           = useState("");
  const [savingNotesId, setSavingNotesId]     = useState<number | null>(null);

  // Programme management states
  const [progSearch, setProgSearch]                 = useState("");
  const [progView, setProgView]                     = useState<"courses" | "categories">("courses");
  const [progFormOpen, setProgFormOpen]             = useState(false);
  const [progEditActivity, setProgEditActivity]     = useState<any | null>(null);
  const [progFormData, setProgFormData]             = useState<ProgrammeFormData>(emptyForm());
  const [progSaving, setProgSaving]                 = useState(false);
  const [progSaveError, setProgSaveError]           = useState("");
  const [progConfirmDeleteId, setProgConfirmDeleteId] = useState<number | null>(null);
  const [progDeletingId, setProgDeletingId]         = useState<number | null>(null);
  const [progSort, setProgSort]                     = useState<{ col: string; dir: "asc" | "desc" }>({ col: "title", dir: "asc" });
  const [uploadingPhoto, setUploadingPhoto]         = useState(false);
  const [uploadPhotoError, setUploadPhotoError]     = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [catFormOpen, setCatFormOpen]               = useState(false);
  const [catEditId, setCatEditId]                   = useState<number | null>(null);
  const [catFormData, setCatFormData]               = useState({ name: "", nameEn: "", slug: "", icon: "🎯", color: "#4CAF50" });
  const [catSaving, setCatSaving]                   = useState(false);
  const [catSaveError, setCatSaveError]             = useState("");
  const [catConfirmDeleteId, setCatConfirmDeleteId] = useState<number | null>(null);
  const [catDeletingId, setCatDeletingId]           = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: enquiries, isLoading, error } = useQuery({
    queryKey: ["enquiries", authedPassword],
    queryFn: () => fetchEnquiries(authedPassword!),
    enabled: !!authedPassword,
    retry: false,
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["activities-admin"],
    queryFn: fetchActivities,
    enabled: !!authedPassword,
  });

  const { data: teeOrders = [], isLoading: teeOrdersLoading, error: teeOrdersError } = useQuery({
    queryKey: ["tee-orders", authedPassword],
    queryFn: () => fetchTeeOrders(authedPassword!),
    enabled: !!authedPassword && activeTab === "teeOrders",
    retry: false,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: !!authedPassword,
  });

  useEffect(() => {
    if (!authedPassword) return;
    fetch("/api/seo-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSeoForm((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, [authedPassword]);

  useEffect(() => {
    if (activeTab === "settings" && authedPassword) {
      fetchNotificationSettings();
    }
  }, [activeTab, authedPassword]);

  useEffect(() => {
    if (!authedPassword) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const map: Record<string, typeof activeTab> = {
        "1": "dashboard", "2": "enquiries", "3": "analytics",
        "4": "programmes", "5": "seo", "6": "settings", "7": "teeOrders",
      };
      const t = map[e.key];
      if (t) { e.preventDefault(); setActiveTab(t); }
      if (e.key === "[") setSidebarCollapsed((s) => !s);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [authedPassword]);

  const totalPending = useMemo(
    () => Array.isArray(enquiries) ? (enquiries as any[]).filter((e: any) => e.status === "pending").length : 0,
    [enquiries],
  );
  const totalEnquiriesCount = Array.isArray(enquiries) ? (enquiries as any[]).length : 0;
  const totalProgrammesCount = (activities as any[]).length;
  const featuredProgrammesCount = (activities as any[]).filter((a: any) => a.featured).length;
  const recentEnquiries = useMemo(() => {
    if (!Array.isArray(enquiries)) return [] as any[];
    return [...(enquiries as any[])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [enquiries]);
  const thisMonthCount = useMemo(() => {
    if (!Array.isArray(enquiries)) return 0;
    const now = new Date();
    return (enquiries as any[]).filter((e: any) => {
      const d = new Date(e.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }, [enquiries]);
  const lastMonthCount = useMemo(() => {
    if (!Array.isArray(enquiries)) return 0;
    const now = new Date();
    const m = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const y = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return (enquiries as any[]).filter((e: any) => {
      const d = new Date(e.createdAt);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  }, [enquiries]);
  const monthDelta = lastMonthCount === 0
    ? (thisMonthCount > 0 ? 100 : 0)
    : Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);

  // Auto-select first enquiry in split-view when current selection is gone
  useEffect(() => {
    if (activeTab !== "enquiries" || enqViewMode !== "split") return;
    if (!Array.isArray(enquiries) || enquiries.length === 0) {
      if (selectedEnqDetailId !== null) setSelectedEnqDetailId(null);
      return;
    }
  }, [activeTab, enqViewMode, enquiries, selectedEnqDetailId]);
  const selectedEnqDetail = useMemo(() => {
    if (!Array.isArray(enquiries)) return null;
    return (enquiries as any[]).find((e: any) => e.id === selectedEnqDetailId) ?? null;
  }, [enquiries, selectedEnqDetailId]);

  if (error?.message === "unauthorized") {
    sessionStorage.removeItem("admin_pw");
    setAuthedPassword(null);
  }

  async function requestUploadUrl(file: File): Promise<{ uploadURL: string; objectPath: string }> {
    const res = await fetch("/api/storage/uploads/request-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authedPassword ?? ""}`,
      },
      body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "application/octet-stream" }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error ?? "Failed to get upload URL");
    }
    return res.json();
  }

  // ── Available years from data ──────────────────────────────────────────
  const availableYears = useMemo(() => {
    if (!enquiries) return [];
    const years = [...new Set((enquiries as any[]).map((e) =>
      new Date(e.createdAt).getFullYear()
    ))].sort((a, b) => b - a);
    return years as number[];
  }, [enquiries]);

  const dateFilteredEnquiries = useMemo(() => {
    if (!enquiries) return [];
    return (enquiries as any[]).filter((e) => {
      const d = new Date(e.createdAt);
      if (filterYear !== "all" && d.getFullYear() !== Number(filterYear)) return false;
      if (filterMonth !== "all" && (d.getMonth() + 1) !== Number(filterMonth)) return false;
      return true;
    });
  }, [enquiries, filterYear, filterMonth]);

  const filteredEnquiries = useMemo(() => {
    let list = [...dateFilteredEnquiries];
    if (filterSchoolType !== "all") list = list.filter((e) => e.schoolType === filterSchoolType);
    if (filterStatus === "pending")   list = list.filter((e) => e.status === "pending");
    if (filterStatus === "processed") list = list.filter((e) => e.status !== "pending");
    list.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? -diff : diff;
    });
    return list;
  }, [dateFilteredEnquiries, filterSchoolType, filterStatus, sortOrder]);

  const dateTotal   = dateFilteredEnquiries.length;
  const datePending = dateFilteredEnquiries.filter((e: any) => e.status === "pending").length;

  const usedSchoolTypes = useMemo(() => {
    if (!enquiries) return [];
    return [...new Set((enquiries as any[]).map((e) => e.schoolType))];
  }, [enquiries]);

  const chartData = useMemo(() => {
    if (!enquiries) return [];
    const year = Number(chartYear);
    const yearData = (enquiries as any[]).filter(
      (e) => new Date(e.createdAt).getFullYear() === year
    );
    return MONTH_LABELS.map((label, i) => {
      const monthEnquiries = yearData.filter(
        (e) => new Date(e.createdAt).getMonth() === i
      );
      return {
        name: label,
        待處理: monthEnquiries.filter((e) => e.status === "pending").length,
        已完成: monthEnquiries.filter((e) => e.status !== "pending").length,
        total: monthEnquiries.length,
      };
    });
  }, [enquiries, chartYear]);

  const chartYearTotal   = chartData.reduce((s, d) => s + d.total, 0);
  const chartPeakMonth   = chartData.reduce((max, d) => d.total > max.total ? d : max, chartData[0] ?? { name: "-", total: 0 });

  // ── Filtered + sorted activities for programme tab ─────────────────────
  const filteredActivities = useMemo(() => {
    const q = progSearch.trim().toLowerCase();
    if (!q) return activities as any[];
    return (activities as any[]).filter((a) =>
      a.title?.toLowerCase().includes(q) ||
      a.titleEn?.toLowerCase().includes(q) ||
      a.categoryName?.toLowerCase().includes(q)
    );
  }, [activities, progSearch]);

  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort((a, b) => {
      const d = progSort.dir === "asc" ? 1 : -1;
      if (progSort.col === "title") return a.title.localeCompare(b.title) * d;
      if (progSort.col === "category") return (a.categoryName ?? "").localeCompare(b.categoryName ?? "") * d;
      if (progSort.col === "targetGroup") {
        const aGroups = Array.isArray(a.targetGroup) ? a.targetGroup.join(",") : (a.targetGroup ?? "");
        const bGroups = Array.isArray(b.targetGroup) ? b.targetGroup.join(",") : (b.targetGroup ?? "");
        return aGroups.localeCompare(bGroups) * d;
      }
      if (progSort.col === "featured") return ((b.featured ? 1 : 0) - (a.featured ? 1 : 0)) * d;
      if (progSort.col === "createdAt") return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * d;
      return 0;
    });
  }, [filteredActivities, progSort]);

  function toggleSort(col: string) {
    setProgSort((prev) => prev.col === col
      ? { col, dir: prev.dir === "asc" ? "desc" : "asc" }
      : { col, dir: "asc" }
    );
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/enquiries", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setLoginError("密碼錯誤，請重試");
      } else if (res.ok) {
        sessionStorage.setItem("admin_pw", password);
        setAuthedPassword(password);
      }
    } catch {
      setLoginError("連接失敗，請稍後再試");
    }
    setLoginLoading(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_pw");
    setAuthedPassword(null);
    setPassword("");
    setLocation("/");
  }

  async function handleMarkProcessed(id: number) {
    setUpdatingId(id);
    try {
      await fetch(`/api/enquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
        body: JSON.stringify({ status: "completed" }),
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries", authedPassword] });
      showToast("success", "已標記為已處理");
    } catch { showToast("error", "更新失敗"); }
    finally { setUpdatingId(null); }
  }

  async function handleRevertPending(id: number) {
    setUpdatingId(id);
    try {
      await fetch(`/api/enquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
        body: JSON.stringify({ status: "pending" }),
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries", authedPassword] });
      showToast("info", "已回復為待處理");
    } catch { showToast("error", "更新失敗"); }
    finally { setUpdatingId(null); }
  }

  async function handleDeleteEnquiry(id: number) {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authedPassword}` },
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries", authedPassword] });
      showToast("success", "已刪除查詢");
    } catch {
      showToast("error", "刪除失敗，請重試");
    } finally { setDeletingId(null); }
  }

  async function handleBulkDelete() {
    if (selectedEnqIds.size === 0) return;
    setBulkActing(true);
    try {
      await Promise.all(Array.from(selectedEnqIds).map((id) =>
        fetch(`/api/enquiries/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authedPassword}` },
        })
      ));
      queryClient.invalidateQueries({ queryKey: ["enquiries", authedPassword] });
      showToast("success", `已刪除 ${selectedEnqIds.size} 條查詢`);
      setSelectedEnqIds(new Set());
      setConfirmBulkDelete(false);
    } catch {
      showToast("error", "批次刪除失敗");
    } finally { setBulkActing(false); }
  }

  async function handleBulkMarkProcessed() {
    if (selectedEnqIds.size === 0) return;
    setBulkActing(true);
    try {
      await Promise.all(Array.from(selectedEnqIds).map((id) =>
        fetch(`/api/enquiries/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
          body: JSON.stringify({ status: "completed" }),
        })
      ));
      queryClient.invalidateQueries({ queryKey: ["enquiries", authedPassword] });
      showToast("success", `已標記 ${selectedEnqIds.size} 條查詢為已處理`);
      setSelectedEnqIds(new Set());
    } catch {
      showToast("error", "批次更新失敗");
    } finally { setBulkActing(false); }
  }

  async function handleSaveNotes(id: number) {
    setSavingNotesId(id);
    try {
      await fetch(`/api/enquiries/${id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
        body: JSON.stringify({ notes: notesDraft }),
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries", authedPassword] });
      setEditingNotesId(null);
    } finally { setSavingNotesId(null); }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(""); setPwSuccess(false);
    if (newPw !== confirmPw) { setPwError("新密碼與確認密碼不符"); return; }
    if (newPw.length < 4)    { setPwError("新密碼最少4個字元");   return; }
    setPwLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${currentPw}` },
        body: JSON.stringify({ newPassword: newPw }),
      });
      const data = await res.json();
      if (res.status === 401) { setPwError("當前密碼錯誤"); showToast("error", "當前密碼錯誤"); }
      else if (!res.ok) { setPwError(data.error ?? "更改失敗，請稍後再試"); showToast("error", data.error ?? "更改失敗"); }
      else {
        sessionStorage.setItem("admin_pw", newPw);
        setAuthedPassword(newPw);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
        setPwSuccess(true);
        showToast("success", "密碼已更新");
      }
    } catch { setPwError("連接失敗，請稍後再試"); showToast("error", "連接失敗"); }
    setPwLoading(false);
  }

  async function fetchNotificationSettings() {
    if (!authedPassword) return;
    setNotifLoading(true);
    try {
      const res = await fetch("/api/admin/notification-settings", {
        headers: { Authorization: `Bearer ${authedPassword}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifEmailEnabled(data.enquiry_email_enabled !== "false");
        setNotifRecipient(data.enquiry_email_recipient ?? "info@juntarhk.com");
        setNotifAutoReply(data.enquiry_auto_reply_enabled === "true");
      }
    } catch {}
    setNotifLoading(false);
  }

  async function handleSaveNotificationSettings(e: React.FormEvent) {
    e.preventDefault();
    setNotifError(""); setNotifSuccess(false);
    setNotifSaving(true);
    try {
      const res = await fetch("/api/admin/notification-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword ?? ""}` },
        body: JSON.stringify({
          enquiry_email_enabled: notifEmailEnabled ? "true" : "false",
          enquiry_email_recipient: notifRecipient,
          enquiry_auto_reply_enabled: notifAutoReply ? "true" : "false",
        }),
      });
      const data = await res.json();
      if (res.status === 401) { setNotifError("驗證失敗，請重新登入"); showToast("error", "驗證失敗"); }
      else if (!res.ok) { setNotifError(data.error ?? "儲存失敗，請稍後再試"); showToast("error", data.error ?? "儲存失敗"); }
      else { setNotifSuccess(true); showToast("success", "通知設定已儲存"); }
    } catch { setNotifError("連接失敗，請稍後再試"); showToast("error", "連接失敗"); }
    setNotifSaving(false);
  }

  async function handleSaveSeo(e: React.FormEvent) {
    e.preventDefault();
    setSeoError("");
    setSeoSuccess(false);
    setSeoSaving(true);
    try {
      const res = await fetch("/api/admin/seo-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword ?? ""}` },
        body: JSON.stringify(seoForm),
      });
      const data = await res.json();
      if (res.status === 401) { setSeoError("驗證失敗，請重新登入"); showToast("error", "驗證失敗"); }
      else if (!res.ok) { setSeoError(data.error ?? "儲存失敗，請稍後再試"); showToast("error", data.error ?? "儲存失敗"); }
      else { setSeoSuccess(true); showToast("success", "SEO 設定已儲存"); }
    } catch { setSeoError("連接失敗，請稍後再試"); showToast("error", "連接失敗"); }
    setSeoSaving(false);
  }

  async function handlePingIndexNow() {
    setIndexnowPinging(true);
    setIndexnowResult(null);
    try {
      const res = await fetch("/api/admin/indexnow-ping", {
        method: "POST",
        headers: { Authorization: `Bearer ${authedPassword ?? ""}` },
      });
      const data = await res.json();
      if (res.status === 401) setIndexnowResult({ ok: false, message: "驗證失敗，請重新登入" });
      else if (!res.ok) setIndexnowResult({ ok: false, message: data.error ?? "Ping 失敗" });
      else setIndexnowResult({ ok: true, message: `成功通知搜尋引擎更新 5 個頁面（HTTP ${data.status}）` });
    } catch {
      setIndexnowResult({ ok: false, message: "連接失敗，請稍後再試" });
    }
    setIndexnowPinging(false);
  }

  // ── Programme management handlers ──────────────────────────────────────
  function openProgCreateForm() {
    setProgEditActivity(null);
    setProgFormData(emptyForm());
    setProgSaveError("");
    setProgFormOpen(true);
  }

  function openProgEditForm(activity: any) {
    setProgEditActivity(activity);
    setProgFormData({
      slug: activity.slug ?? "",
      title: activity.title ?? "",
      titleEn: activity.titleEn ?? "",
      description: activity.description ?? "",
      descriptionEn: activity.descriptionEn ?? "",
      categoryId: activity.categoryId ?? "",
      targetGroup: Array.isArray(activity.targetGroup) ? activity.targetGroup : (activity.targetGroup ? [activity.targetGroup] : ["kindergarten", "primary", "secondary"]),
      duration: activity.duration ?? "",
      durationEn: activity.durationEn ?? "",
      minParticipants: activity.minParticipants ?? 10,
      maxParticipants: activity.maxParticipants ?? 40,
      location: activity.location ?? "",
      locationEn: activity.locationEn ?? "",
      imageUrl: activity.imageUrl ?? "",
      images: activity.images ?? [],
      featured: activity.featured ?? false,
      seoTitle: activity.seoTitle ?? "",
      seoDescription: activity.seoDescription ?? "",
      seoKeywords: activity.seoKeywords ?? "",
    });
    setProgSaveError("");
    setProgFormOpen(true);
  }

  async function handleCatSave() {
    if (!catFormData.name.trim()) { setCatSaveError("請輸入類別名稱（中文）"); return; }
    if (!catFormData.nameEn.trim()) { setCatSaveError("Please enter category name (English)"); return; }
    setCatSaving(true);
    setCatSaveError("");
    try {
      const url = catEditId ? `/api/categories/${catEditId}` : "/api/categories";
      const method = catEditId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
        body: JSON.stringify(catFormData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "儲存失敗");
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCatFormOpen(false);
      setCatEditId(null);
      setCatFormData({ name: "", nameEn: "", slug: "", icon: "🎯", color: "#4CAF50" });
    } catch (err: any) {
      setCatSaveError(err.message ?? "操作失敗，請稍後再試");
    } finally {
      setCatSaving(false);
    }
  }

  async function handleCatDelete(id: number) {
    setCatDeletingId(id);
    setCatConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authedPassword}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "刪除失敗");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } finally {
      setCatDeletingId(null);
    }
  }

  const [togglingFeaturedId, setTogglingFeaturedId] = useState<number | null>(null);

  async function handleToggleFeatured(activity: any) {
    if (togglingFeaturedId === activity.id) return;
    setTogglingFeaturedId(activity.id);
    try {
      await fetch(`/api/activities/${activity.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
        body: JSON.stringify({ featured: !activity.featured }),
      });
      queryClient.invalidateQueries({ queryKey: ["activities-admin"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    } finally {
      setTogglingFeaturedId(null);
    }
  }

  async function handleProgSave() {
    if (!progFormData.title.trim()) { setProgSaveError("請輸入課程名稱（中文）"); return; }
    if (!progFormData.categoryId) { setProgSaveError("請選擇課程類別"); return; }
    if (progFormData.targetGroup.length === 0) { setProgSaveError("請選擇至少一個適合學層"); return; }
    if (!progFormData.duration.trim()) { setProgSaveError("請輸入課時"); return; }
    if (!progFormData.location.trim()) { setProgSaveError("請輸入地點"); return; }
    if (!progFormData.description.trim()) { setProgSaveError("請輸入課程簡介"); return; }

    setProgSaving(true);
    setProgSaveError("");
    try {
      const body = {
        slug: progFormData.slug.trim() || null,
        title: progFormData.title.trim(),
        titleEn: progFormData.titleEn.trim(),
        description: progFormData.description.trim(),
        descriptionEn: progFormData.descriptionEn.trim() || null,
        categoryId: Number(progFormData.categoryId),
        targetGroup: progFormData.targetGroup,
        duration: progFormData.duration.trim(),
        durationEn: progFormData.durationEn.trim() || null,
        minParticipants: Number(progFormData.minParticipants),
        maxParticipants: Number(progFormData.maxParticipants),
        location: progFormData.location.trim(),
        locationEn: progFormData.locationEn.trim() || null,
        imageUrl: progFormData.imageUrl.trim() || null,
        images: progFormData.images,
        featured: progFormData.featured,
        seoTitle: progFormData.seoTitle.trim() || null,
        seoDescription: progFormData.seoDescription.trim() || null,
        seoKeywords: progFormData.seoKeywords.trim() || null,
      };

      if (progEditActivity) {
        const res = await fetch(`/api/activities/${progEditActivity.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "更新失敗");
        }
      } else {
        const res = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authedPassword}` },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "新增失敗");
        }
      }
      queryClient.invalidateQueries({ queryKey: ["activities-admin"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setProgFormOpen(false);
      showToast("success", progEditActivity ? "課程已更新" : "課程已新增");
    } catch (err: any) {
      setProgSaveError(err.message ?? "操作失敗，請稍後再試");
      showToast("error", err.message ?? "操作失敗");
    } finally {
      setProgSaving(false);
    }
  }

  async function handleProgDelete(id: number) {
    setProgDeletingId(id);
    setProgConfirmDeleteId(null);
    try {
      await fetch(`/api/activities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authedPassword}` },
      });
      queryClient.invalidateQueries({ queryKey: ["activities-admin"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } finally {
      setProgDeletingId(null);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    setUploadingPhoto(true);
    setUploadPhotoError("");
    try {
      const { uploadURL, objectPath } = await requestUploadUrl(file);
      const putRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      if (!putRes.ok) throw new Error("Failed to upload to storage");
      setProgFormData((prev) => ({
        ...prev,
        images: [...prev.images, `/api/storage${objectPath}`],
      }));
    } catch {
      setUploadPhotoError("上傳失敗，請重試");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handleRemovePhoto(idx: number) {
    setProgFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  }

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!authedPassword) {
    return (
      <div className="min-h-screen flex bg-[#F4F1EC]">
        {/* Brand panel — hidden on mobile */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0F2A33] via-[#1A3D4A] to-[#234d5c] text-white p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#3D8B89]/25 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[26rem] h-[26rem] rounded-full bg-[#E8A020]/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#E8A020]/15 border border-[#E8A020]/30 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#E8A020]" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#FFCB6B]">Admin Console</span>
            </div>
            <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-[1.15] mt-6">JuntarHK<br/>管理後台</h1>
            <p className="text-white/70 text-base leading-relaxed max-w-md mt-5">查詢追蹤、課程管理、數據分析、SEO 與帳戶設定，一站式管理 JuntarHK 課外活動平台。</p>
          </div>
          <div className="relative grid grid-cols-2 gap-3 max-w-md">
            {[
              { icon: MessageSquare, label: "查詢記錄", desc: "追蹤學校查詢" },
              { icon: BookOpen, label: "課程管理", desc: "編輯活動目錄" },
              { icon: BarChart2, label: "數據分析", desc: "查詢趨勢圖表" },
              { icon: Globe, label: "SEO 設定", desc: "頁面標題與描述" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-sm">
                  <Icon className="w-4 h-4 text-[#E8A020] mb-2" />
                  <div className="text-sm font-bold text-white">{f.label}</div>
                  <div className="text-[11px] text-white/55">{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-[#1A3D4A] mb-6 mx-auto">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-extrabold text-[#1A3D4A]">歡迎回來</h2>
              <p className="text-sm text-gray-500 mt-1">請輸入管理員密碼登入</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">管理員密碼</label>
                <div className="relative">
                  <input
                    type={showLoginPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 focus:border-[#1A3D4A]/40 transition-shadow"
                    required
                  />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)}
                    aria-label={showLoginPw ? "隱藏密碼" : "顯示密碼"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {loginError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl px-3 py-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{loginError}
                </div>
              )}
              <button type="submit" disabled={loginLoading}
                className="w-full bg-[#1A3D4A] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1A3D4A]/90 transition-all shadow-lg shadow-[#1A3D4A]/20 hover:shadow-xl hover:shadow-[#1A3D4A]/30 disabled:opacity-60">
                {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                登入管理後台
              </button>
            </form>
            <div className="mt-8 text-center">
              <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#1A3D4A] transition-colors">
                ← 返回 JuntarHK 網站
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main panel ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F1EC]">

      {/* Enquiry delete confirmation modal */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">確認刪除查詢</h3>
                <p className="text-xs text-gray-500">此操作不可撤銷</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">刪除後此查詢記錄將永久消失，確定繼續嗎？</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={() => handleDeleteEnquiry(confirmDeleteId)}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-700 transition-colors">確認刪除</button>
            </div>
          </div>
        </div>
      )}

      {/* Programme delete confirmation modal */}
      {progConfirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">確認刪除課程</h3>
                <p className="text-xs text-gray-500">此操作不可撤銷</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">刪除後此課程將從目錄中永久消失，確定繼續嗎？</p>
            <div className="flex gap-3">
              <button onClick={() => setProgConfirmDeleteId(null)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={() => handleProgDelete(progConfirmDeleteId)}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-700 transition-colors">確認刪除</button>
            </div>
          </div>
        </div>
      )}

      {/* Programme form slide-over */}
      {progFormOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/30" onClick={() => setProgFormOpen(false)} />
          <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Form header */}
            <div className="bg-[#1A3D4A] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-bold text-base">
                  {progEditActivity ? "編輯課程" : "新增課程"}
                </h2>
                <p className="text-white/60 text-xs mt-0.5">
                  {progEditActivity ? `ID ${progEditActivity.id} — ${progEditActivity.title}` : "建立新課程"}
                </p>
              </div>
              <button onClick={() => setProgFormOpen(false)}
                className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={(e) => { e.preventDefault(); handleProgSave(); }} className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Title ZH + EN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">課程名稱（中文）<span className="text-red-500">*</span></label>
                  <input type="text" value={progFormData.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setProgFormData((p) => ({
                        ...p,
                        title: t,
                        slug: p.slug || t,
                      }));
                    }}
                    placeholder="例：戶外繩索挑戰課程"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Course Title (EN)</label>
                  <input type="text" value={progFormData.titleEn}
                    onChange={(e) => setProgFormData((p) => ({ ...p, titleEn: e.target.value }))}
                    placeholder="e.g. Outdoor Rope Challenge"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  URL 網址標識 (Slug)
                  <span className="ml-1 font-normal text-gray-400">— 用於頁面網址，建議使用中文課程名稱</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">/activities/</span>
                  <input type="text" value={progFormData.slug}
                    onChange={(e) => setProgFormData((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="例：戶外繩索挑戰課程"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
                <p className="text-xs text-gray-400 mt-1">留空則使用數字 ID，slug 必須唯一</p>
              </div>

              {/* Category + Target Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">課程類別<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={progFormData.categoryId}
                      onChange={(e) => setProgFormData((p) => ({ ...p, categoryId: e.target.value ? Number(e.target.value) : "" }))}
                      className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30"
                    >
                      <option value="">選擇類別…</option>
                      {(categories as any[]).map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">適合學層<span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(() => {
                      const ALL_GROUPS = ["kindergarten", "primary", "secondary"];
                      const allSelected = ALL_GROUPS.every((g) => progFormData.targetGroup.includes(g));
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setProgFormData((p) => ({
                              ...p,
                              targetGroup: allSelected ? [] : [...ALL_GROUPS],
                            }))}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${allSelected ? "bg-[#1A3D4A] border-[#1A3D4A] text-white" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                          >
                            {allSelected ? "✓ " : ""}全學層
                          </button>
                          {(["kindergarten", "primary", "secondary"] as const).map((g) => {
                            const labels: Record<string, string> = { kindergarten: "幼稚園", primary: "小學", secondary: "中學" };
                            const colors: Record<string, string> = { kindergarten: "bg-pink-50 border-pink-200 text-pink-700", primary: "bg-blue-50 border-blue-200 text-blue-700", secondary: "bg-purple-50 border-purple-200 text-purple-700" };
                            const activeColors: Record<string, string> = { kindergarten: "bg-pink-100 border-pink-400 text-pink-800", primary: "bg-blue-100 border-blue-400 text-blue-800", secondary: "bg-purple-100 border-purple-400 text-purple-800" };
                            const checked = progFormData.targetGroup.includes(g);
                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setProgFormData((p) => ({
                                  ...p,
                                  targetGroup: checked
                                    ? p.targetGroup.filter((x) => x !== g)
                                    : [...p.targetGroup, g],
                                }))}
                                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${checked ? activeColors[g] : colors[g]}`}
                              >
                                {checked ? "✓ " : ""}{labels[g]}
                              </button>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">可選擇多個學層，或點擊「全學層」一次選取全部</p>
                </div>
              </div>

              {/* Duration + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">課時<span className="text-red-500">*</span></label>
                  <input type="text" value={progFormData.duration}
                    onChange={(e) => setProgFormData((p) => ({ ...p, duration: e.target.value }))}
                    placeholder="例：半天（3小時）"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Duration (EN)</label>
                  <input type="text" value={progFormData.durationEn}
                    onChange={(e) => setProgFormData((p) => ({ ...p, durationEn: e.target.value }))}
                    placeholder="e.g. Half day (3 hours)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">地點<span className="text-red-500">*</span></label>
                  <input type="text" value={progFormData.location}
                    onChange={(e) => setProgFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="例：學校戶外場地"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location (EN)</label>
                  <input type="text" value={progFormData.locationEn}
                    onChange={(e) => setProgFormData((p) => ({ ...p, locationEn: e.target.value }))}
                    placeholder="e.g. School outdoor venue"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">最少人數</label>
                  <input type="number" min={1} value={progFormData.minParticipants}
                    onChange={(e) => setProgFormData((p) => ({ ...p, minParticipants: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">最多人數</label>
                  <input type="number" min={1} value={progFormData.maxParticipants}
                    onChange={(e) => setProgFormData((p) => ({ ...p, maxParticipants: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                </div>
              </div>

              {/* Description ZH */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">課程簡介（中文）<span className="text-red-500">*</span></label>
                <textarea rows={3} value={progFormData.description}
                  onChange={(e) => setProgFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="輸入中文課程介紹…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Programme Description (EN)</label>
                <textarea rows={3} value={progFormData.descriptionEn}
                  onChange={(e) => setProgFormData((p) => ({ ...p, descriptionEn: e.target.value }))}
                  placeholder="Enter English programme description…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Star className={`w-4 h-4 flex-shrink-0 ${progFormData.featured ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">精選課程</div>
                  <div className="text-xs text-gray-500">精選課程會在首頁及課程列表頂部顯示</div>
                </div>
                <button type="button"
                  onClick={() => setProgFormData((p) => ({ ...p, featured: !p.featured }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${progFormData.featured ? "bg-amber-500" : "bg-gray-200"}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${progFormData.featured ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              {/* Photo management */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">課程照片</label>

                {/* Existing photos */}
                {progFormData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {progFormData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={imgUrl}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full p-1.5 shadow">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {progFormData.images.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-200 rounded-lg mb-3 text-gray-400">
                    <ImageOff className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-xs">暫時沒有照片</p>
                  </div>
                )}

                {/* Upload button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload-input"
                  />
                  <label
                    htmlFor="photo-upload-input"
                    className={`flex items-center gap-2 justify-center w-full border border-dashed border-[#1A3D4A]/40 rounded-lg py-2.5 text-sm font-medium text-[#1A3D4A] cursor-pointer hover:bg-[#1A3D4A]/5 transition-colors ${uploadingPhoto ? "opacity-60 pointer-events-none" : ""}`}
                  >
                    {uploadingPhoto ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />上傳中…</>
                    ) : (
                      <><Upload className="w-4 h-4" />上傳照片</>
                    )}
                  </label>
                  {uploadPhotoError && <p className="text-xs text-red-500 mt-1">{uploadPhotoError}</p>}
                  <p className="text-xs text-gray-400 mt-1">支援 JPG、PNG、WebP 等圖片格式</p>
                </div>
              </div>

              {/* SEO 設定 */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> SEO 設定（選填）
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">SEO 頁面標題</label>
                    <input type="text" value={progFormData.seoTitle}
                      onChange={(e) => setProgFormData((p) => ({ ...p, seoTitle: e.target.value }))}
                      placeholder={progFormData.title ? `${progFormData.title}｜JuntarHK` : "留空則自動套用課程名稱"}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                    <p className="text-xs text-gray-400 mt-1">建議 50–60 字元（目前：{progFormData.seoTitle.length}）</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">SEO 描述</label>
                    <textarea rows={2} value={progFormData.seoDescription}
                      onChange={(e) => setProgFormData((p) => ({ ...p, seoDescription: e.target.value }))}
                      placeholder="留空則自動擷取課程簡介首 160 字"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 resize-none" />
                    <p className="text-xs text-gray-400 mt-1">建議 120–160 字元（目前：{progFormData.seoDescription.length}）</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">SEO 關鍵字</label>
                    <input type="text" value={progFormData.seoKeywords}
                      onChange={(e) => setProgFormData((p) => ({ ...p, seoKeywords: e.target.value }))}
                      placeholder="例：課外活動, 戶外繩索, 香港學校"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                    <p className="text-xs text-gray-400 mt-1">用逗號分隔</p>
                  </div>
                </div>
              </div>

              {progSaveError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg px-3 py-2.5 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />{progSaveError}
                </div>
              )}
            </form>

            {/* Form footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 flex-shrink-0 bg-white">
              <button type="button" onClick={() => setProgFormOpen(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button
                type="button"
                onClick={() => handleProgSave()}
                disabled={progSaving}
                className="flex-1 bg-[#1A3D4A] text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1A3D4A]/90 transition-colors disabled:opacity-60">
                {progSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {progEditActivity ? "儲存更改" : "新增課程"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ Toast container ============ */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm">
        {toasts.map((t) => {
          const cfg = t.type === "success"
            ? { Icon: CheckCircle, ring: "ring-emerald-200", bg: "bg-white", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", bar: "bg-emerald-500" }
            : t.type === "error"
            ? { Icon: XCircle, ring: "ring-red-200", bg: "bg-white", iconBg: "bg-red-100", iconColor: "text-red-600", bar: "bg-red-500" }
            : { Icon: Info, ring: "ring-blue-200", bg: "bg-white", iconBg: "bg-blue-100", iconColor: "text-blue-600", bar: "bg-blue-500" };
          const TIcon = cfg.Icon;
          return (
            <div key={t.id} className={`pointer-events-auto ${cfg.bg} rounded-xl shadow-2xl ring-1 ${cfg.ring} flex items-stretch overflow-hidden animate-in slide-in-from-right-4 fade-in duration-200`}>
              <div className={`w-1 ${cfg.bar}`} />
              <div className="flex items-start gap-3 p-3.5 flex-1">
                <span className={`w-7 h-7 rounded-lg ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <TIcon className={`w-4 h-4 ${cfg.iconColor}`} />
                </span>
                <p className="text-sm text-gray-700 flex-1 leading-snug pt-0.5">{t.msg}</p>
                <button onClick={() => setToasts((tt) => tt.filter((x) => x.id !== t.id))}
                  className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============ Bulk delete confirm ============ */}
      {confirmBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">批次刪除查詢</h3>
                <p className="text-xs text-gray-500">將永久刪除 {selectedEnqIds.size} 條查詢</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">此操作不可撤銷，確定繼續嗎？</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmBulkDelete(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={handleBulkDelete} disabled={bulkActing}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {bulkActing && <Loader2 className="w-4 h-4 animate-spin" />}確認刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ Sidebar (lg+) ============ */}
      {(() => {
        const NAV = [
          { key: "dashboard",  icon: LayoutDashboard, label: "概覽",     sub: "Dashboard",  badge: 0 },
          { key: "enquiries",  icon: MessageSquare,   label: "查詢記錄", sub: "Enquiries",  badge: totalPending },
          { key: "analytics",  icon: BarChart2,       label: "數據分析", sub: "Analytics",  badge: 0 },
          { key: "programmes", icon: BookOpen,        label: "課程管理", sub: "Programmes", badge: 0 },
          { key: "seo",        icon: Globe,           label: "SEO 設定", sub: "SEO",        badge: 0 },
          { key: "teeOrders",  icon: Shirt,           label: "Tee 訂單",  sub: "Tee Orders", badge: 0 },
          { key: "settings",   icon: Settings,        label: "帳戶設定", sub: "Account",    badge: 0 },
        ] as const;
        const current = NAV.find((n) => n.key === activeTab) ?? NAV[0];
        const sidebarW = sidebarCollapsed ? "lg:w-[76px]" : "lg:w-64";
        const mainPad = sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-64";
        return (
          <>
            <aside className={`hidden lg:flex fixed inset-y-0 left-0 ${sidebarW} bg-gradient-to-b from-[#0F2A33] to-[#1A3D4A] text-white flex-col z-30 shadow-xl transition-all duration-200`}>
              {/* Brand */}
              <div className={`pt-7 pb-6 border-b border-white/10 ${sidebarCollapsed ? "px-3" : "px-6"}`}>
                <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? "justify-center" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-[#E8A020]/15 border border-[#E8A020]/30 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-[#E8A020]" />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="min-w-0">
                      <div className="font-display font-extrabold text-base leading-tight">JuntarHK</div>
                      <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#FFCB6B]/90 truncate">Admin Console</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Nav */}
              <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                {!sidebarCollapsed && <p className="px-3 mb-2 text-[10px] font-bold tracking-[0.18em] uppercase text-white/40">Workspace</p>}
                {NAV.map((n) => {
                  const Icon = n.icon;
                  const active = activeTab === n.key;
                  return (
                    <button key={n.key} onClick={() => setActiveTab(n.key)}
                      title={sidebarCollapsed ? n.label : undefined}
                      className={`w-full flex items-center gap-3 ${sidebarCollapsed ? "px-2 justify-center" : "px-3"} py-2.5 rounded-xl text-sm font-medium transition-all relative group ${
                        active
                          ? "bg-white/10 text-white shadow-inner ring-1 ring-white/15"
                          : "text-white/65 hover:text-white hover:bg-white/5"
                      }`}>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 relative ${active ? "bg-[#E8A020]/20 text-[#E8A020]" : "bg-white/5 text-white/60"}`}>
                        <Icon className="w-4 h-4" />
                        {sidebarCollapsed && n.badge > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#E8A020] text-[#0F2A33] text-[9px] font-bold flex items-center justify-center ring-2 ring-[#0F2A33]">
                            {n.badge > 9 ? "9+" : n.badge}
                          </span>
                        )}
                      </span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{n.label}</span>
                          {n.badge > 0 && (
                            <span className="min-w-[20px] px-1.5 h-5 rounded-full bg-[#E8A020] text-[#0F2A33] text-[10px] font-bold flex items-center justify-center">
                              {n.badge > 99 ? "99+" : n.badge}
                            </span>
                          )}
                          {active && n.badge === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020]" />}
                        </>
                      )}
                    </button>
                  );
                })}
              </nav>
              {/* Footer */}
              <div className={`pb-5 pt-3 border-t border-white/10 space-y-1 ${sidebarCollapsed ? "px-2" : "px-3"}`}>
                <button onClick={() => setSidebarCollapsed((s) => !s)}
                  title={sidebarCollapsed ? "展開側欄 [" : "收起側欄 ["}
                  className={`w-full flex items-center gap-3 ${sidebarCollapsed ? "px-2 justify-center" : "px-3"} py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/5 transition-colors`}>
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </span>
                  {!sidebarCollapsed && <span className="flex-1 text-left">收起側欄</span>}
                </button>
                <Link href="/" title={sidebarCollapsed ? "返回網站" : undefined}
                  className={`flex items-center gap-3 ${sidebarCollapsed ? "px-2 justify-center" : "px-3"} py-2.5 rounded-xl text-sm font-medium text-white/65 hover:text-white hover:bg-white/5 transition-colors`}>
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4" />
                  </span>
                  {!sidebarCollapsed && "返回網站"}
                </Link>
                <button onClick={handleLogout} title={sidebarCollapsed ? "登出" : undefined}
                  className={`w-full flex items-center gap-3 ${sidebarCollapsed ? "px-2 justify-center" : "px-3"} py-2.5 rounded-xl text-sm font-medium text-white/65 hover:text-red-300 hover:bg-red-500/10 transition-colors`}>
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <LogOut className="w-4 h-4" />
                  </span>
                  {!sidebarCollapsed && "登出"}
                </button>
              </div>
            </aside>

            {/* ============ Mobile top header ============ */}
            <div className="lg:hidden sticky top-0 z-30 bg-gradient-to-r from-[#0F2A33] to-[#1A3D4A] text-white px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8A020]/15 border border-[#E8A020]/30 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#E8A020]" />
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">JuntarHK</div>
                  <div className="text-[9px] font-bold tracking-widest uppercase text-[#FFCB6B]/90">Admin</div>
                </div>
                {totalPending > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 h-5 rounded-full bg-[#E8A020] text-[#0F2A33] text-[10px] font-bold">
                    <Bell className="w-2.5 h-2.5" />{totalPending}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Link href="/" className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="返回網站">
                  <Globe className="w-4 h-4" />
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="登出">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ============ Mobile horizontal tabs ============ */}
            <div className="lg:hidden bg-white border-b border-gray-100 px-3 overflow-x-auto sticky top-[3.25rem] z-20 shadow-sm">
              <div className="flex gap-1 py-2 w-max">
                {NAV.map((n) => {
                  const Icon = n.icon;
                  const active = activeTab === n.key;
                  return (
                    <button key={n.key} onClick={() => setActiveTab(n.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap relative ${
                        active ? "bg-[#1A3D4A] text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}>
                      <Icon className="w-3.5 h-3.5" />{n.label}
                      {n.badge > 0 && (
                        <span className={`min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center ${active ? "bg-[#E8A020] text-[#0F2A33]" : "bg-[#E8A020] text-[#0F2A33]"}`}>
                          {n.badge > 9 ? "9+" : n.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============ Main column ============ */}
            <div className={`${mainPad} min-h-screen flex flex-col transition-all duration-200`}>
              {/* Topbar (desktop) */}
              <header className="hidden lg:flex sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-gray-200/70 px-8 h-16 items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#1A3D4A]/8 flex items-center justify-center">
                    <current.icon className="w-4 h-4 text-[#1A3D4A]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">{current.sub}</div>
                    <h1 className="font-bold text-[#1A3D4A] text-base leading-tight">{current.label}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {totalPending > 0 && (
                    <button onClick={() => setActiveTab("enquiries")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E8A020]/10 text-[#b87318] text-xs font-semibold border border-[#E8A020]/30 hover:bg-[#E8A020]/15 transition-colors">
                      <Bell className="w-3.5 h-3.5" />
                      {totalPending} 條待處理
                    </button>
                  )}
                  <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    已登入
                  </span>
                  <span className="text-xs text-gray-400 hidden md:block">
                    {new Date().toLocaleDateString("zh-HK", { year: "numeric", month: "short", day: "numeric", weekday: "short" })}
                  </span>
                  <span className="hidden 2xl:inline-flex items-center gap-1 text-[10px] text-gray-300 font-mono px-2 py-1 bg-gray-50 rounded border border-gray-100">
                    1–6 切換 · [ 摺疊
                  </span>
                </div>
              </header>

              <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── DASHBOARD TAB ─────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <>
            {/* Greeting */}
            <div className="bg-gradient-to-r from-[#1A3D4A] to-[#3D8B89] rounded-2xl p-6 lg:p-7 mb-6 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#E8A020]/15 blur-2xl" />
              <div className="absolute right-10 top-4 opacity-15">
                <Sparkles className="w-12 h-12" />
              </div>
              <div className="relative">
                <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#FFCB6B] mb-2">
                  {new Date().toLocaleDateString("zh-HK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
                <h2 className="text-2xl lg:text-3xl font-display font-extrabold mb-1">歡迎回來</h2>
                <p className="text-white/75 text-sm">
                  {totalPending > 0
                    ? `今日有 ${totalPending} 條查詢等緊處理。`
                    : "所有查詢已處理完畢，做得好。"}
                </p>
                {totalPending > 0 && (
                  <button onClick={() => setActiveTab("enquiries")}
                    className="mt-4 inline-flex items-center gap-2 bg-white text-[#1A3D4A] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/90 transition-colors">
                    立即查看 <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "總查詢數", sub: "Total enquiries", value: totalEnquiriesCount, Icon: MessageSquare, accent: "bg-[#1A3D4A]/10 text-[#1A3D4A]", ring: "" },
                { label: "待處理", sub: "Pending", value: totalPending, Icon: Bell, accent: "bg-amber-100 text-amber-700", ring: totalPending > 0 ? "ring-1 ring-amber-200" : "" },
                { label: "本月查詢", sub: "This month", value: thisMonthCount, Icon: ActivityIcon, accent: "bg-emerald-100 text-emerald-700", ring: "", delta: monthDelta },
                { label: "課程數量", sub: `${featuredProgrammesCount} 個精選`, value: totalProgrammesCount, Icon: BookOpen, accent: "bg-blue-100 text-blue-700", ring: "" },
              ].map((c, i) => {
                const Icon = c.Icon;
                const positive = (c.delta ?? 0) >= 0;
                return (
                  <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${c.ring}`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className={`w-10 h-10 rounded-xl ${c.accent} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      {typeof c.delta === "number" && (
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                          {positive ? "▲" : "▼"} {Math.abs(c.delta)}%
                        </span>
                      )}
                    </div>
                    <div className="text-3xl font-black text-[#1A3D4A] leading-none">{c.value}</div>
                    <div className="text-sm font-semibold text-gray-700 mt-2">{c.label}</div>
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mt-0.5">{c.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent enquiries + Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div>
                    <h3 className="font-bold text-[#1A3D4A] text-base flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-[#3D8B89]" />最近查詢
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Recent enquiries · 顯示最近 5 條</p>
                  </div>
                  <button onClick={() => setActiveTab("enquiries")}
                    className="text-xs font-semibold text-[#3D8B89] hover:text-[#1A3D4A] flex items-center gap-1 transition-colors">
                    查看全部 <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isLoading ? (
                  <div className="py-16 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1A3D4A]" />
                  </div>
                ) : recentEnquiries.length === 0 ? (
                  <div className="py-14 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                      <Inbox className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">暫時未有查詢</p>
                    <p className="text-xs text-gray-400 mt-1">當客戶提交聯絡表格，會喺呢度顯示</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {recentEnquiries.map((enq: any) => (
                      <li key={enq.id}>
                        <button onClick={() => setActiveTab("enquiries")}
                          className="w-full text-left px-5 py-3.5 hover:bg-gray-50/70 transition-colors flex items-center gap-3">
                          <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            enq.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            <School className="w-4 h-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#1A3D4A] text-sm truncate">{enq.schoolName}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                                enq.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {enq.status === "pending" ? "待處理" : "已處理"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-0.5">
                              {enq.contactName} · {enq.message?.slice(0, 60)}{enq.message?.length > 60 ? "…" : ""}
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-400 flex-shrink-0 hidden sm:block">
                            {new Date(enq.createdAt).toLocaleDateString("zh-HK", { month: "short", day: "numeric" })}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Quick actions */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h3 className="font-bold text-[#1A3D4A] text-base flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#E8A020]" />快速操作
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "處理查詢", sub: `${totalPending} 條待處理`, Icon: MessageSquare, onClick: () => setActiveTab("enquiries"), color: "text-amber-700 bg-amber-50 hover:bg-amber-100" },
                      { label: "新增課程", sub: "Programmes", Icon: Plus, onClick: () => { setActiveTab("programmes"); setTimeout(() => openProgCreateForm(), 50); }, color: "text-[#1A3D4A] bg-[#1A3D4A]/10 hover:bg-[#1A3D4A]/15" },
                      { label: "查看數據", sub: "Analytics", Icon: BarChart2, onClick: () => setActiveTab("analytics"), color: "text-blue-700 bg-blue-50 hover:bg-blue-100" },
                      { label: "SEO 設定", sub: "搜尋引擎優化", Icon: Globe, onClick: () => setActiveTab("seo"), color: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" },
                    ].map((a, i) => {
                      const Icon = a.Icon;
                      return (
                        <button key={i} onClick={a.onClick}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${a.color}`}>
                          <span className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="flex-1 text-left">
                            <span className="block text-sm font-semibold leading-tight">{a.label}</span>
                            <span className="block text-[11px] opacity-70">{a.sub}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Website page quick links */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h3 className="font-bold text-[#1A3D4A] text-base flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-[#3D8B89]" />網站頁面
                  </h3>
                  <div className="space-y-1.5">
                    {[
                      { label: "影像及校園媒體", sub: "/photography", href: "/photography" },
                      { label: "AI 教育及創作",  sub: "/ai-education", href: "/ai-education" },
                      { label: "課程目錄",        sub: "/activities",   href: "/activities" },
                    ].map((pg) => (
                      <a key={pg.href} href={pg.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group">
                        <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-[#3D8B89]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#3D8B89] transition-colors" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold leading-tight">{pg.label}</span>
                          <span className="block text-[11px] text-gray-400 font-mono">{pg.sub}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1A3D4A]/5 to-[#3D8B89]/5 rounded-2xl p-5 border border-[#3D8B89]/10">
                  <div className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-xl bg-[#1A3D4A]/10 flex items-center justify-center flex-shrink-0">
                      <Info className="w-4 h-4 text-[#1A3D4A]" />
                    </span>
                    <div>
                      <h4 className="font-bold text-[#1A3D4A] text-sm">鍵盤快捷鍵</h4>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        按 <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[10px]">1</kbd>–<kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[10px]">6</kbd> 切換頁面，<kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[10px]">[</kbd> 收/展側欄。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── ENQUIRIES TAB ─────────────────────────────────────────────── */}
        {activeTab === "enquiries" && (
          <>
            {/* Stats (reflect year/month filter) */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { value: dateTotal, label: "總查詢數", Icon: MessageSquare, color: "text-[#1A3D4A]", bg: "bg-[#1A3D4A]/10",
                  sub: (filterYear !== "all" || filterMonth !== "all")
                    ? `${filterYear !== "all" ? filterYear : ""}${filterMonth !== "all" ? ` ${MONTH_LABELS[Number(filterMonth)-1]}` : ""}`
                    : "全部時段" },
                { value: datePending, label: "待處理", Icon: Bell, color: "text-amber-600", bg: "bg-amber-100", sub: "Pending" },
                { value: dateTotal - datePending, label: "已處理", Icon: CheckCheck, color: "text-emerald-600", bg: "bg-emerald-100", sub: "Completed" },
              ].map((s, i) => {
                const Icon = s.Icon;
                return (
                  <div key={i} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <span className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <div className={`text-3xl font-black ${s.color} leading-none`}>{s.value}</div>
                      <div className="text-sm text-gray-700 font-semibold mt-1.5">{s.label}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{s.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bulk action bar */}
            {selectedEnqIds.size > 0 && (
              <div className="bg-[#1A3D4A] text-white rounded-xl px-4 py-3 mb-4 flex items-center gap-3 flex-wrap shadow-md">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#E8A020]" />
                  已選擇 {selectedEnqIds.size} 條
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={handleBulkMarkProcessed} disabled={bulkActing}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    {bulkActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                    全部標為已處理
                  </button>
                  <button onClick={() => setConfirmBulkDelete(true)} disabled={bulkActing}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />批次刪除
                  </button>
                  <button onClick={() => setSelectedEnqIds(new Set())}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    <X className="w-3.5 h-3.5" />清除
                  </button>
                </div>
              </div>
            )}

            {/* Filter bar */}
            <div className="bg-white rounded-xl shadow-sm px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Filter className="w-3.5 h-3.5" />篩選
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { value: "all", label: "全部" },
                  { value: "pending", label: "待處理" },
                  { value: "processed", label: "已處理" },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => setFilterStatus(opt.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterStatus === opt.value ? "bg-[#1A3D4A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="w-px h-4 bg-gray-200" />

              <FilterSelect value={filterSchoolType} onChange={setFilterSchoolType}>
                <option value="all">所有學校類別</option>
                {usedSchoolTypes.map((type: any) => (
                  <option key={type} value={type}>{SCHOOL_TYPE_LABELS[type] ?? type}</option>
                ))}
              </FilterSelect>

              <div className="w-px h-4 bg-gray-200" />

              <FilterSelect value={filterYear} onChange={(v) => { setFilterYear(v); setFilterMonth("all"); }}>
                <option value="all">所有年份</option>
                {availableYears.map((y) => (
                  <option key={y} value={String(y)}>{y} 年</option>
                ))}
              </FilterSelect>

              <FilterSelect value={filterMonth} onChange={setFilterMonth}>
                <option value="all">所有月份</option>
                {MONTH_LABELS.map((label, i) => (
                  <option key={i + 1} value={String(i + 1)}>{label}</option>
                ))}
              </FilterSelect>

              <div className="ml-auto flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                {[
                  { value: "desc", label: "最新先" },
                  { value: "asc",  label: "最舊先" },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => setSortOrder(opt.value as "desc" | "asc")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      sortOrder === opt.value ? "bg-[#1A3D4A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-gray-400">顯示 {filteredEnquiries.length} / {enquiries?.length ?? 0} 筆</span>

              {filteredEnquiries.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const allIds = filteredEnquiries.map((e: any) => e.id);
                    const allSelected = allIds.every((id: number) => selectedEnqIds.has(id));
                    setSelectedEnqIds(allSelected ? new Set() : new Set(allIds));
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1A3D4A] hover:bg-[#1A3D4A]/10 px-2 py-1 rounded-md transition-colors"
                >
                  {filteredEnquiries.every((e: any) => selectedEnqIds.has(e.id))
                    ? <><CheckCheck className="w-3.5 h-3.5" />取消全選</>
                    : <><CheckCircle className="w-3.5 h-3.5" />全選</>}
                </button>
              )}

              <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => setEnqViewMode("split")}
                  title="分屏檢視"
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${enqViewMode === "split" ? "bg-white text-[#1A3D4A] shadow-sm" : "text-gray-500 hover:text-[#1A3D4A]"}`}
                >
                  <LayoutDashboard className="w-3 h-3" />分屏
                </button>
                <button
                  type="button"
                  onClick={() => setEnqViewMode("list")}
                  title="長卡片檢視"
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${enqViewMode === "list" ? "bg-white text-[#1A3D4A] shadow-sm" : "text-gray-500 hover:text-[#1A3D4A]"}`}
                >
                  <Inbox className="w-3 h-3" />長卡
                </button>
              </div>
            </div>

            {/* Enquiry rendering */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#1A3D4A]" />
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>{(enquiries?.length ?? 0) === 0 ? "暫時未有查詢" : "沒有符合篩選條件的查詢"}</p>
              </div>
            ) : enqViewMode === "split" ? (
              /* ── SPLIT VIEW ── */
              <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-start">
                {/* Left: compact list */}
                <aside className="bg-white rounded-xl shadow-sm overflow-hidden lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                    <span className="text-xs font-bold text-[#1A3D4A]">收件匣</span>
                    <span className="text-[10px] text-gray-400">{filteredEnquiries.length} 條</span>
                  </div>
                  <ul className="overflow-y-auto divide-y divide-gray-50 flex-1">
                    {filteredEnquiries.map((enq: any) => {
                      const isActive = selectedEnqDetailId === enq.id;
                      const isChecked = selectedEnqIds.has(enq.id);
                      const isPending = enq.status === "pending";
                      return (
                        <li key={enq.id} className={`relative ${isActive ? "bg-[#1A3D4A]/5" : "hover:bg-gray-50/70"} transition-colors`}>
                          {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A3D4A]" />}
                          <button
                            type="button"
                            onClick={() => setSelectedEnqDetailId(enq.id)}
                            className="w-full text-left px-4 py-3 flex items-start gap-2.5"
                          >
                            <span
                              role="checkbox"
                              aria-checked={isChecked}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEnqIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(enq.id)) next.delete(enq.id); else next.add(enq.id);
                                  return next;
                                });
                              }}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                isChecked ? "bg-[#1A3D4A] border-[#1A3D4A] text-white" : "border-gray-300 hover:border-[#1A3D4A] bg-white"
                              }`}
                            >
                              {isChecked && <CheckCheck className="w-2.5 h-2.5" />}
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${isPending ? "bg-amber-400" : "bg-emerald-400"}`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm truncate ${isPending ? "text-[#1A3D4A]" : "text-gray-700"}`}>
                                  {enq.schoolName}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 truncate mt-0.5">
                                {enq.contactName} · {(enq.message ?? "").replace(/\s+/g, " ").slice(0, 40)}
                                {(enq.message ?? "").length > 40 ? "…" : ""}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${isPending ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                  {isPending ? "待處理" : "已處理"}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(enq.createdAt).toLocaleDateString("zh-HK", { month: "short", day: "numeric" })}
                                </span>
                                {enq.notes && <NotebookPen className="w-2.5 h-2.5 text-amber-500" />}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </aside>

                {/* Right: detail panel */}
                {(() => {
                  const enq = selectedEnqDetail ?? filteredEnquiries[0];
                  if (!enq) {
                    return (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
                        <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p>請從左側選擇查詢</p>
                      </div>
                    );
                  }
                  const isPending = enq.status === "pending";
                  const whatsappTo = (enq.contactPhone ?? "").replace(/[^\d]/g, "");
                  return (
                    <article className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${isPending ? "border-l-yellow-400" : "border-l-green-400"}`}>
                      {/* Header */}
                      <div className="px-6 py-5 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#1A3D4A]/10 flex items-center justify-center flex-shrink-0">
                              <School className="w-5 h-5 text-[#1A3D4A]" />
                            </div>
                            <div>
                              <h2 className="font-display font-extrabold text-[#1A3D4A] text-lg leading-tight">{enq.schoolName}</h2>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span>{SCHOOL_TYPE_LABELS[enq.schoolType] ?? enq.schoolType}</span>
                                <span className="text-gray-300">·</span>
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(enq.createdAt).toLocaleString("zh-HK", {
                                    year: "numeric", month: "short", day: "numeric",
                                    hour: "2-digit", minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${STATUS_CONFIG[enq.status]?.color ?? "bg-gray-100 text-gray-600"}`}>
                            {STATUS_CONFIG[enq.status]?.label ?? enq.status}
                          </span>
                        </div>
                      </div>

                      {/* Contact strip */}
                      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                            <School className="w-3.5 h-3.5 text-gray-400" />
                          </span>
                          <span className="truncate font-medium">{enq.contactName}</span>
                        </div>
                        {enq.contactEmail && (
                          <a href={`mailto:${enq.contactEmail}`} className="flex items-center gap-2 text-sm text-[#1A3D4A] hover:underline">
                            <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                            <span className="truncate">{enq.contactEmail}</span>
                          </a>
                        )}
                        {enq.contactPhone && (
                          <a href={`tel:${enq.contactPhone}`} className="flex items-center gap-2 text-sm text-[#1A3D4A] hover:underline">
                            <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                            <span className="truncate">{enq.contactPhone}</span>
                          </a>
                        )}
                      </div>

                      {/* Quick contact buttons */}
                      <div className="px-6 pt-4 flex flex-wrap gap-2">
                        {enq.contactEmail && (
                          <a href={`mailto:${enq.contactEmail}`}
                            className="flex items-center gap-1.5 bg-[#1A3D4A]/10 hover:bg-[#1A3D4A]/15 text-[#1A3D4A] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                            <Mail className="w-3.5 h-3.5" />回覆 Email
                          </a>
                        )}
                        {enq.contactPhone && (
                          <>
                            <a href={`tel:${enq.contactPhone}`}
                              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                              <Phone className="w-3.5 h-3.5" />致電
                            </a>
                            {whatsappTo && (
                              <a href={`https://wa.me/${whatsappTo.startsWith("852") ? whatsappTo : "852" + whatsappTo}`}
                                target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1B6E3E] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                                <MessageSquare className="w-3.5 h-3.5" />WhatsApp
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      {/* Activity tags */}
                      {(enq.activityInterest || enq.activityCategory || enq.plannedDate || enq.plannedParticipants) && (
                        <div className="px-6 pt-4 flex flex-wrap gap-2">
                          {enq.activityInterest && (
                            <span className="text-xs bg-[#E8A020]/15 text-[#b87318] px-2.5 py-1 rounded-full font-medium">
                              活動興趣：{enq.activityInterest}
                            </span>
                          )}
                          {enq.activityCategory && (
                            <span className="text-xs bg-[#1A3D4A]/10 text-[#1A3D4A] px-2.5 py-1 rounded-full font-medium">
                              活動類別：{enq.activityCategory}
                            </span>
                          )}
                          {enq.plannedDate && (
                            <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                              預期日期：{enq.plannedDate}
                            </span>
                          )}
                          {enq.plannedParticipants && (
                            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                              預計人數：{enq.plannedParticipants} 人
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message */}
                      <div className="px-6 py-4">
                        <div className="text-[11px] font-bold tracking-wider uppercase text-gray-400 mb-2">查詢訊息</div>
                        <div className="bg-gray-50 rounded-lg px-4 py-3.5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {enq.message}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="px-6 pb-4">
                        <div className="text-[11px] font-bold tracking-wider uppercase text-gray-400 mb-2 flex items-center gap-1.5">
                          <NotebookPen className="w-3 h-3" />內部備忘
                        </div>
                        {editingNotesId === enq.id ? (
                          <div className="space-y-2">
                            <textarea autoFocus value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)}
                              placeholder="輸入備忘內容…" rows={3}
                              className="w-full border border-[#1A3D4A]/30 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 bg-white" />
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleSaveNotes(enq.id)} disabled={savingNotesId === enq.id}
                                className="flex items-center gap-1.5 bg-[#1A3D4A] hover:bg-[#1A3D4A]/90 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                                {savingNotesId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}儲存
                              </button>
                              <button onClick={() => setEditingNotesId(null)}
                                className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                                <X className="w-3.5 h-3.5" />取消
                              </button>
                            </div>
                          </div>
                        ) : enq.notes ? (
                          <div className="group flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-amber-100 transition-colors"
                            onClick={() => { setEditingNotesId(enq.id); setNotesDraft(enq.notes ?? ""); }}>
                            <NotebookPen className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-800 leading-relaxed flex-grow whitespace-pre-wrap">{enq.notes}</p>
                            <span className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">編輯</span>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingNotesId(enq.id); setNotesDraft(""); }}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1A3D4A] transition-colors border border-dashed border-gray-200 hover:border-[#1A3D4A]/40 rounded-lg px-3 py-2 w-full">
                            <NotebookPen className="w-3.5 h-3.5" />新增內部備忘…
                          </button>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="px-6 py-4 bg-gray-50/40 border-t border-gray-100 flex items-center gap-2">
                        {isPending ? (
                          <button onClick={() => handleMarkProcessed(enq.id)} disabled={updatingId === enq.id}
                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
                            {updatingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                            標記為已處理
                          </button>
                        ) : (
                          <button onClick={() => handleRevertPending(enq.id)} disabled={updatingId === enq.id}
                            className="flex items-center gap-1.5 border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-60 text-yellow-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
                            {updatingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                            回復待處理
                          </button>
                        )}
                        <button onClick={() => setConfirmDeleteId(enq.id)} disabled={deletingId === enq.id}
                          className="flex items-center gap-1.5 border border-red-200 hover:bg-red-50 disabled:opacity-60 text-red-600 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ml-auto">
                          {deletingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          刪除
                        </button>
                      </div>
                    </article>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enq: any) => {
                  const isSelected = selectedEnqIds.has(enq.id);
                  return (
                  <div key={enq.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 transition-all ${
                      enq.status === "pending" ? "border-l-yellow-400" : "border-l-green-400"
                    } ${isSelected ? "ring-2 ring-[#1A3D4A]/30" : ""}`}>

                    <div className="flex items-start justify-between p-5 border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEnqIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(enq.id)) next.delete(enq.id); else next.add(enq.id);
                              return next;
                            });
                          }}
                          aria-label={isSelected ? "取消選擇" : "選擇查詢"}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                            isSelected ? "bg-[#1A3D4A] border-[#1A3D4A] text-white" : "border-gray-300 hover:border-[#1A3D4A] bg-white"
                          }`}
                        >
                          {isSelected && <CheckCheck className="w-3 h-3" />}
                        </button>
                        <div className="w-9 h-9 rounded-full bg-[#1A3D4A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <School className="w-4 h-4 text-[#1A3D4A]" />
                        </div>
                        <div>
                          <div className="font-bold text-[#1A3D4A]">{enq.schoolName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{SCHOOL_TYPE_LABELS[enq.schoolType] ?? enq.schoolType}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CONFIG[enq.status]?.color ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_CONFIG[enq.status]?.label ?? enq.status}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(enq.createdAt).toLocaleDateString("zh-HK", {
                            year: "numeric", month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-4 flex flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-5 flex-shrink-0 text-gray-400">👤</div>
                        {enq.contactName}
                      </div>
                      {enq.contactEmail && (
                        <a href={`mailto:${enq.contactEmail}`} className="flex items-center gap-2 text-sm text-[#1A3D4A] hover:underline">
                          <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />{enq.contactEmail}
                        </a>
                      )}
                      {enq.contactPhone && (
                        <a href={`tel:${enq.contactPhone}`} className="flex items-center gap-2 text-sm text-[#1A3D4A] hover:underline">
                          <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />{enq.contactPhone}
                        </a>
                      )}
                    </div>

                    {(enq.activityInterest || enq.activityCategory || enq.plannedDate || enq.plannedParticipants) && (
                      <div className="px-5 pb-3 flex flex-wrap gap-2">
                        {enq.activityInterest && (
                          <span className="text-xs bg-[#E8A020]/15 text-[#b87318] px-2.5 py-1 rounded-full font-medium">
                            活動興趣：{enq.activityInterest}
                          </span>
                        )}
                        {enq.activityCategory && (
                          <span className="text-xs bg-[#1A3D4A]/10 text-[#1A3D4A] px-2.5 py-1 rounded-full font-medium">
                            活動類別：{enq.activityCategory}
                          </span>
                        )}
                        {enq.plannedDate && (
                          <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                            📅 {enq.plannedDate}
                          </span>
                        )}
                        {enq.plannedParticipants && (
                          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            👥 {enq.plannedParticipants} 人
                          </span>
                        )}
                      </div>
                    )}

                    <div className="px-5 pb-4">
                      <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {enq.message}
                      </div>
                    </div>

                    <div className="px-5 pb-4">
                      {editingNotesId === enq.id ? (
                        <div className="space-y-2">
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1A3D4A]">
                            <NotebookPen className="w-3.5 h-3.5" />內部備忘
                          </label>
                          <textarea autoFocus value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)}
                            placeholder="輸入備忘內容…" rows={3}
                            className="w-full border border-[#1A3D4A]/30 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 bg-white" />
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleSaveNotes(enq.id)} disabled={savingNotesId === enq.id}
                              className="flex items-center gap-1.5 bg-[#1A3D4A] hover:bg-[#1A3D4A]/90 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                              {savingNotesId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}儲存
                            </button>
                            <button onClick={() => setEditingNotesId(null)}
                              className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                              <X className="w-3.5 h-3.5" />取消
                            </button>
                          </div>
                        </div>
                      ) : enq.notes ? (
                        <div className="group flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-amber-100 transition-colors"
                          onClick={() => { setEditingNotesId(enq.id); setNotesDraft(enq.notes ?? ""); }}>
                          <NotebookPen className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-800 leading-relaxed flex-grow whitespace-pre-wrap">{enq.notes}</p>
                          <span className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">編輯</span>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingNotesId(enq.id); setNotesDraft(""); }}
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1A3D4A] transition-colors">
                          <NotebookPen className="w-3.5 h-3.5" />新增內部備忘…
                        </button>
                      )}
                    </div>

                    <div className="px-5 pb-4 flex items-center gap-2">
                      {enq.status === "pending" ? (
                        <button onClick={() => handleMarkProcessed(enq.id)} disabled={updatingId === enq.id}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
                          {updatingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                          標記為已處理
                        </button>
                      ) : (
                        <button onClick={() => handleRevertPending(enq.id)} disabled={updatingId === enq.id}
                          className="flex items-center gap-1.5 border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-60 text-yellow-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
                          {updatingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                          回復待處理
                        </button>
                      )}
                      <button onClick={() => setConfirmDeleteId(enq.id)} disabled={deletingId === enq.id}
                        className="flex items-center gap-1.5 border border-red-200 hover:bg-red-50 disabled:opacity-60 text-red-600 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ml-auto">
                        {deletingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        刪除
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── PROGRAMMES TAB ────────────────────────────────────────────── */}
        {activeTab === "programmes" && (
          <div>
            {/* View toggle + Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setProgView("courses")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${progView === "courses" ? "bg-white text-[#1A3D4A] shadow-sm" : "text-gray-500 hover:text-[#1A3D4A]"}`}>
                  <BookOpen className="w-3.5 h-3.5" />課程列表
                </button>
                <button
                  type="button"
                  onClick={() => setProgView("categories")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${progView === "categories" ? "bg-white text-[#1A3D4A] shadow-sm" : "text-gray-500 hover:text-[#1A3D4A]"}`}>
                  <Tag className="w-3.5 h-3.5" />課程類別
                </button>
              </div>

              {progView === "courses" ? (
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <div className="relative max-w-sm flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="搜尋課程名稱或類別…"
                      value={progSearch}
                      onChange={(e) => setProgSearch(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30"
                    />
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{filteredActivities.length} / {(activities as any[]).length} 個課程</span>
                  <button
                    onClick={openProgCreateForm}
                    className="flex items-center gap-2 bg-[#1A3D4A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1A3D4A]/90 transition-colors flex-shrink-0">
                    <Plus className="w-4 h-4" />新增課程
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setCatEditId(null); setCatFormData({ name: "", nameEn: "", slug: "", icon: "🎯", color: "#4CAF50" }); setCatSaveError(""); setCatFormOpen(true); }}
                  className="flex items-center gap-2 bg-[#1A3D4A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1A3D4A]/90 transition-colors flex-shrink-0">
                  <Plus className="w-4 h-4" />新增類別
                </button>
              )}
            </div>

            {/* ── COURSES VIEW ── */}
            {progView === "courses" && (activitiesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#1A3D4A]" />
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center text-gray-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>{(activities as any[]).length === 0 ? "暫無課程，請點擊「新增課程」" : "沒有符合搜尋條件的課程"}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 font-medium border-b border-gray-100">
                        {[
                          { col: "title", label: "課程名稱", align: "left", cls: "px-5 py-3" },
                          { col: "category", label: "類別", align: "left", cls: "px-4 py-3" },
                          { col: "targetGroup", label: "學層", align: "left", cls: "px-4 py-3" },
                          { col: "featured", label: "精選", align: "center", cls: "px-4 py-3" },
                        ].map(({ col, label, align, cls }) => (
                          <th key={col} className={`text-${align} ${cls}`}>
                            <button
                              type="button"
                              onClick={() => toggleSort(col)}
                              className="inline-flex items-center gap-1 hover:text-[#1A3D4A] transition-colors"
                            >
                              {label}
                              <ArrowUpDown className={`w-3 h-3 ${progSort.col === col ? "text-[#1A3D4A]" : "opacity-40"}`} />
                            </button>
                          </th>
                        ))}
                        <th className="text-center px-4 py-3">照片</th>
                        <th className="text-right px-5 py-3">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedActivities.map((activity: any, idx: number) => {
                        const catColorClass = CATEGORY_BADGE_COLORS[((activity.categoryId ?? 1) - 1) % CATEGORY_BADGE_COLORS.length];
                        const groups: string[] = Array.isArray(activity.targetGroup) ? activity.targetGroup : (activity.targetGroup ? [activity.targetGroup] : []);
                        const allLevels = ["kindergarten","primary","secondary"];
                        const isAllGroups = allLevels.every((g) => groups.includes(g));
                        return (
                          <tr key={activity.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-medium text-[#1A3D4A] leading-tight">{activity.title}</div>
                              {activity.titleEn && (
                                <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{activity.titleEn}</div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${catColorClass}`}>
                                {activity.categoryName ?? "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {isAllGroups ? (
                                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1A3D4A]/10 text-[#1A3D4A]">全學層</span>
                                ) : groups.length === 0 ? (
                                  <span className="text-gray-300">—</span>
                                ) : (
                                  groups.map((g) => (
                                    <span key={g} className={`text-xs font-medium px-2.5 py-1 rounded-full ${TARGET_GROUP_COLORS[g] ?? "bg-gray-100 text-gray-600"}`}>
                                      {TARGET_GROUP_LABELS[g] ?? g}
                                    </span>
                                  ))
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                title={activity.featured ? "取消精選" : "設為精選"}
                                onClick={() => handleToggleFeatured(activity)}
                                disabled={togglingFeaturedId === activity.id}
                                className="mx-auto flex items-center justify-center w-8 h-8 rounded-full hover:bg-amber-50 transition-colors disabled:opacity-50"
                              >
                                <Star className={`w-4 h-4 transition-colors ${activity.featured ? "text-amber-500 fill-amber-500" : "text-gray-300 hover:text-amber-400"}`} />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-medium ${(activity.images?.length ?? 0) > 0 ? "text-[#1A3D4A]" : "text-gray-300"}`}>
                                {(activity.images?.length ?? 0) > 0 ? `${activity.images.length} 張` : "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => openProgEditForm(activity)}
                                  className="flex items-center gap-1 text-xs font-medium text-[#1A3D4A] bg-[#1A3D4A]/8 hover:bg-[#1A3D4A]/15 px-2.5 py-1.5 rounded-lg transition-colors">
                                  <Pencil className="w-3.5 h-3.5" />編輯
                                </button>
                                <button
                                  onClick={() => setProgConfirmDeleteId(activity.id)}
                                  disabled={progDeletingId === activity.id}
                                  className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60">
                                  {progDeletingId === activity.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}刪除
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* ── CATEGORIES VIEW ── */}
            {progView === "categories" && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 font-medium border-b border-gray-100">
                        <th className="text-left px-5 py-3">圖示</th>
                        <th className="text-left px-4 py-3">類別名稱（中文）</th>
                        <th className="text-left px-4 py-3">Category (EN)</th>
                        <th className="text-center px-4 py-3">課程數量</th>
                        <th className="text-right px-5 py-3">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(categories as any[]).map((cat: any) => (
                        <tr key={cat.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-3 text-2xl leading-none">{cat.icon ?? "🎯"}</td>
                          <td className="px-4 py-3 font-medium text-[#1A3D4A]">{cat.name}</td>
                          <td className="px-4 py-3 text-gray-500">{cat.nameEn}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.activityCount > 0 ? "bg-[#1A3D4A]/10 text-[#1A3D4A]" : "bg-gray-100 text-gray-400"}`}>
                              {cat.activityCount} 個課程
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => { setCatEditId(cat.id); setCatFormData({ name: cat.name, nameEn: cat.nameEn, slug: cat.slug ?? "", icon: cat.icon ?? "🎯", color: cat.color ?? "#4CAF50" }); setCatSaveError(""); setCatFormOpen(true); }}
                                className="flex items-center gap-1 text-xs font-medium text-[#1A3D4A] bg-[#1A3D4A]/10 hover:bg-[#1A3D4A]/20 px-2.5 py-1.5 rounded-lg transition-colors">
                                <Pencil className="w-3.5 h-3.5" />編輯
                              </button>
                              {catConfirmDeleteId === cat.id ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-red-600">確認刪除？</span>
                                  <button onClick={() => handleCatDelete(cat.id)} disabled={catDeletingId === cat.id}
                                    className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg transition-colors disabled:opacity-60">
                                    {catDeletingId === cat.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "確認"}
                                  </button>
                                  <button onClick={() => setCatConfirmDeleteId(null)}
                                    className="text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors">
                                    取消
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setCatConfirmDeleteId(cat.id)}
                                  disabled={cat.activityCount > 0}
                                  title={cat.activityCount > 0 ? "此類別有課程，不可刪除" : "刪除此類別"}
                                  className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                  <Trash2 className="w-3.5 h-3.5" />刪除
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(categories as any[]).length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                    <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>暫無類別，請點擊「新增類別」</p>
                  </div>
                )}
              </div>
            )}

            {/* Category form modal */}
            {catFormOpen && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setCatFormOpen(false); }}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h3 className="font-bold text-[#1A3D4A] text-base">{catEditId ? "編輯課程類別" : "新增課程類別"}</h3>
                    <button onClick={() => setCatFormOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleCatSave(); }} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">類別名稱（中文）<span className="text-red-500">*</span></label>
                        <input type="text" value={catFormData.name}
                          onChange={(e) => setCatFormData((p) => ({ ...p, name: e.target.value }))}
                          placeholder="例：AI 學習"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category (EN)<span className="text-red-500">*</span></label>
                        <input type="text" value={catFormData.nameEn}
                          onChange={(e) => setCatFormData((p) => ({ ...p, nameEn: e.target.value }))}
                          placeholder="e.g. AI Learning"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">URL 路徑（英文 Slug）</label>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1A3D4A]/30">
                        <span className="px-3 py-2 text-xs text-gray-400 bg-gray-50 border-r border-gray-200 whitespace-nowrap">/activities?category=</span>
                        <input type="text" value={catFormData.slug}
                          onChange={(e) => setCatFormData((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/--+/g, "-") }))}
                          placeholder="e.g. adventure-training"
                          className="flex-1 px-3 py-2 text-sm focus:outline-none bg-white font-mono" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">留空則自動從英文名稱生成。只允許小寫英文字母、數字及連字符。</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">圖示（Emoji）</label>
                        <input type="text" value={catFormData.icon}
                          onChange={(e) => setCatFormData((p) => ({ ...p, icon: e.target.value }))}
                          placeholder="🎯"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">顏色</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={catFormData.color}
                            onChange={(e) => setCatFormData((p) => ({ ...p, color: e.target.value }))}
                            className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5" />
                          <span className="text-xs text-gray-500 font-mono">{catFormData.color}</span>
                        </div>
                      </div>
                    </div>
                    {catSaveError && (
                      <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg px-3 py-2.5 text-sm">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />{catSaveError}
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-2">
                      <button type="button" onClick={() => setCatFormOpen(false)}
                        className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                        取消
                      </button>
                      <button type="submit" disabled={catSaving}
                        className="flex-1 bg-[#1A3D4A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1A3D4A]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                        {catSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {catEditId ? "儲存更改" : "新增類別"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ─────────────────────────────────────────────── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#1A3D4A] text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />查詢數據分析
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">按月份統計查詢量與處理狀況</p>
              </div>
              <FilterSelect value={chartYear} onChange={setChartYear}>
                {availableYears.length === 0
                  ? <option value={String(new Date().getFullYear())}>{new Date().getFullYear()} 年</option>
                  : availableYears.map((y) => (
                    <option key={y} value={String(y)}>{y} 年</option>
                  ))
                }
              </FilterSelect>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-black text-[#1A3D4A]">{chartYearTotal}</div>
                <div className="text-sm text-gray-500 mt-1">{chartYear} 年總查詢</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-black text-[#E8A020]">{chartPeakMonth?.name ?? "—"}</div>
                <div className="text-sm text-gray-500 mt-1">查詢最多月份（{chartPeakMonth?.total ?? 0} 筆）</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-black text-[#1A3D4A]">
                  {chartYearTotal > 0 ? Math.round(chartYearTotal / 12 * 10) / 10 : 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">月均查詢數</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-[#1A3D4A] mb-6">{chartYear} 年 — 每月查詢量</h3>
              {chartYearTotal === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <BarChart2 className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">{chartYear} 年暫無查詢數據</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                      formatter={(val: any, name: string) => [val + " 筆", name]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
                    <Bar dataKey="已完成" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="待處理" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {chartYearTotal > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h3 className="font-bold text-[#1A3D4A] text-sm">月份明細</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 font-medium">
                        <th className="text-left px-6 py-3">月份</th>
                        <th className="text-center px-4 py-3">總計</th>
                        <th className="text-center px-4 py-3">待處理</th>
                        <th className="text-center px-4 py-3">已完成</th>
                        <th className="px-6 py-3">佔比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row, i) => (
                        <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-3 font-medium text-[#1A3D4A]">{chartYear} 年 {row.name}</td>
                          <td className="text-center px-4 py-3 font-bold">{row.total}</td>
                          <td className="text-center px-4 py-3 text-yellow-600">{row.待處理}</td>
                          <td className="text-center px-4 py-3 text-green-600">{row.已完成}</td>
                          <td className="px-6 py-3">
                            {row.total > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-24">
                                  <div
                                    className="bg-[#1A3D4A] h-1.5 rounded-full"
                                    style={{ width: `${Math.round((row.total / Math.max(...chartData.map(d => d.total))) * 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-400">
                                  {chartYearTotal > 0 ? Math.round(row.total / chartYearTotal * 100) : 0}%
                                </span>
                              </div>
                            ) : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TEE ORDERS TAB ─────────────────────────────────────────────── */}
        {activeTab === "teeOrders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-extrabold text-gray-900">團隊 Tee 訂單</h2>
                <p className="text-sm text-gray-500 mt-0.5">已透過 Stripe 付款的訂製 Tee 訂單</p>
              </div>
            </div>

            {teeOrdersLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />載入中⋯⋯
              </div>
            ) : teeOrdersError ? (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />無法載入訂單，請重新登入後再試。
              </div>
            ) : !Array.isArray(teeOrders) || teeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
                <Shirt className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">暫時未有 Tee 訂單</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(teeOrders as any[]).map((o: any) => (
                  <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-[#1A3D4A]/10 text-[#1A3D4A] flex items-center justify-center">
                          <Shirt className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="font-bold text-gray-900">#{o.id} · {o.teamName}</div>
                          <div className="text-xs text-gray-400">
                            {o.paidAt ? new Date(o.paidAt).toLocaleString("zh-HK") : new Date(o.createdAt).toLocaleString("zh-HK")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          o.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {o.status === "paid" ? "已付款" : "待付款"}
                        </span>
                        <span className="font-display font-extrabold text-[#1A3D4A]">
                          HK${(o.totalAmount / 100).toLocaleString("en-HK")}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-gray-400 text-xs block">顏色</span><span className="font-semibold">{o.color}</span></div>
                      <div><span className="text-gray-400 text-xs block">尺碼</span><span className="font-semibold">{o.size}</span></div>
                      <div><span className="text-gray-400 text-xs block">數量</span><span className="font-semibold">{o.quantity}</span></div>
                      <div><span className="text-gray-400 text-xs block">單價</span><span className="font-semibold">HK${(o.unitAmount / 100).toLocaleString("en-HK")}</span></div>
                    </div>
                    {(o.printText || o.designNotes || o.contactName || o.contactEmail || o.contactPhone) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-sm">
                        {o.printText && <div><span className="text-gray-400 text-xs mr-2">印字</span>{o.printText}</div>}
                        {o.designNotes && <div><span className="text-gray-400 text-xs mr-2">設計備註</span><span className="whitespace-pre-wrap">{o.designNotes}</span></div>}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
                          {o.contactName && <span>{o.contactName}</span>}
                          {o.contactEmail && <a href={`mailto:${o.contactEmail}`} className="text-[#1A3D4A] underline">{o.contactEmail}</a>}
                          {o.contactPhone && <span>{o.contactPhone}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SEO TAB ────────────────────────────────────────────────────── */}
        {activeTab === "seo" && (
          <div className="max-w-2xl space-y-6">
            {seoSuccess && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />SEO 設定已成功儲存！
              </div>
            )}
            {seoError && <p className="text-red-500 text-sm">{seoError}</p>}

            <form onSubmit={handleSaveSeo} className="space-y-6">
              {/* Basic Meta */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#1A3D4A]/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#1A3D4A]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1A3D4A]">基本 Meta 設定</h2>
                    <p className="text-xs text-gray-400">Basic meta tags for search engines</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">網站標題（中文）</label>
                      <input type="text" value={seoForm.seo_title_zh}
                        onChange={(e) => setSeoForm((p) => ({ ...p, seo_title_zh: e.target.value }))}
                        placeholder="JuntarHK｜香港學校課外活動統籌"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">網站標題（English）</label>
                      <input type="text" value={seoForm.seo_title_en}
                        onChange={(e) => setSeoForm((p) => ({ ...p, seo_title_en: e.target.value }))}
                        placeholder="JuntarHK | Hong Kong School Activities"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">網站描述（中文）</label>
                      <textarea rows={3} value={seoForm.seo_description_zh}
                        onChange={(e) => setSeoForm((p) => ({ ...p, seo_description_zh: e.target.value }))}
                        placeholder="JuntarHK 為香港幼稚園、小學及中學提供專業戶外課外活動統籌服務..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 resize-none" />
                      <p className="text-xs text-gray-400 mt-1">建議 120–160 個字元（目前：{seoForm.seo_description_zh.length}）</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">網站描述（English）</label>
                      <textarea rows={3} value={seoForm.seo_description_en}
                        onChange={(e) => setSeoForm((p) => ({ ...p, seo_description_en: e.target.value }))}
                        placeholder="JuntarHK offers professional extracurricular activity services for HK schools..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 resize-none" />
                      <p className="text-xs text-gray-400 mt-1">Recommended 120–160 chars (current: {seoForm.seo_description_en.length})</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">關鍵字 Keywords</label>
                    <input type="text" value={seoForm.seo_keywords}
                      onChange={(e) => setSeoForm((p) => ({ ...p, seo_keywords: e.target.value }))}
                      placeholder="課外活動,香港學校活動,outdoor activities,school programmes"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                    <p className="text-xs text-gray-400 mt-1">用逗號分隔 / Separate with commas</p>
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1A3D4A]">社交媒體分享 (Open Graph)</h2>
                    <p className="text-xs text-gray-400">Controls how the site looks when shared on WhatsApp, Facebook, etc.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">OG 標題</label>
                    <input type="text" value={seoForm.seo_og_title}
                      onChange={(e) => setSeoForm((p) => ({ ...p, seo_og_title: e.target.value }))}
                      placeholder="JuntarHK｜香港學校課外活動統籌"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">OG 描述</label>
                    <textarea rows={2} value={seoForm.seo_og_description}
                      onChange={(e) => setSeoForm((p) => ({ ...p, seo_og_description: e.target.value }))}
                      placeholder="為學校提供專業戶外課外活動統籌服務"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">OG 圖片 URL</label>
                    <input type="url" value={seoForm.seo_og_image}
                      onChange={(e) => setSeoForm((p) => ({ ...p, seo_og_image: e.target.value }))}
                      placeholder="https://example.com/og-image.jpg (建議 1200×630px)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                    <p className="text-xs text-gray-400 mt-1">建議尺寸：1200×630px，JPG 或 PNG</p>
                    {seoForm.seo_og_image && (
                      <img src={seoForm.seo_og_image} alt="OG preview" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        className="mt-2 rounded-lg border border-gray-200 max-h-32 object-cover" />
                    )}
                  </div>
                </div>
              </div>

              {/* Per-Page SEO */}
              {(() => {
                const pages = [
                  { key: "home",         labelZh: "首頁",        labelEn: "Home",                placeholderTitleZh: "JuntarHK｜專業中小學課外活動訂製",             placeholderTitleEn: "JuntarHK | School ECA Programme Specialist" },
                  { key: "activities",   labelZh: "活動目錄",    labelEn: "Activities",          placeholderTitleZh: "中小學 ECA 課程目錄｜JuntarHK",                 placeholderTitleEn: "School ECA Programmes | JuntarHK" },
                  { key: "photography",  labelZh: "影像及校園媒體", labelEn: "Photography",        placeholderTitleZh: "香港學校攝影及影片製作課程｜JuntarHK",          placeholderTitleEn: "Photography & Video Courses for HK Schools | JuntarHK" },
                  { key: "ai_education", labelZh: "AI 教育及創作", labelEn: "AI Education",       placeholderTitleZh: "香港學校AI教育及創作課程｜JuntarHK",            placeholderTitleEn: "AI Education & Creation Courses for HK Schools | JuntarHK" },
                  { key: "about",        labelZh: "關於我們",    labelEn: "About",               placeholderTitleZh: "關於JuntarHK｜ECA外判專家",                     placeholderTitleEn: "About JuntarHK | School ECA Specialist" },
                  { key: "partners",     labelZh: "合作學校",    labelEn: "Partners",            placeholderTitleZh: "合作學校及機構｜逾190所信賴",                    placeholderTitleEn: "Partner Schools | JuntarHK" },
                  { key: "contact",      labelZh: "聯絡我們",    labelEn: "Contact",             placeholderTitleZh: "聯絡JuntarHK｜ECA課程查詢",                     placeholderTitleEn: "Contact JuntarHK | ECA Enquiry" },
                ] as const;
                const p = seoPageTab;
                const titleZhKey   = `seo_page_${p}_title_zh`   as keyof typeof seoForm;
                const titleEnKey   = `seo_page_${p}_title_en`   as keyof typeof seoForm;
                const descZhKey    = `seo_page_${p}_description_zh` as keyof typeof seoForm;
                const descEnKey    = `seo_page_${p}_description_en` as keyof typeof seoForm;
                const kwKey        = `seo_page_${p}_keywords`    as keyof typeof seoForm;
                const cur          = pages.find(x => x.key === p)!;
                return (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="font-bold text-[#1A3D4A]">各頁面 SEO 設定</h2>
                        <p className="text-xs text-gray-400">Per-page title, description &amp; keywords — overrides global defaults</p>
                      </div>
                    </div>
                    {/* Page tabs */}
                    <div className="flex gap-1 flex-wrap mb-5 border-b border-gray-100 pb-3">
                      {pages.map(pg => (
                        <button key={pg.key} type="button"
                          onClick={() => setSeoPageTab(pg.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${seoPageTab === pg.key ? "bg-[#1A3D4A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                          {pg.labelZh}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{cur.labelZh} 標題（中文）</label>
                          <input type="text" value={seoForm[titleZhKey]}
                            onChange={e => setSeoForm(prev => ({ ...prev, [titleZhKey]: e.target.value }))}
                            placeholder={cur.placeholderTitleZh}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                          <p className="text-xs text-gray-400 mt-1">建議 50–60 字元（目前：{String(seoForm[titleZhKey]).length}）</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{cur.labelEn} Title (English)</label>
                          <input type="text" value={seoForm[titleEnKey]}
                            onChange={e => setSeoForm(prev => ({ ...prev, [titleEnKey]: e.target.value }))}
                            placeholder={cur.placeholderTitleEn}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                          <p className="text-xs text-gray-400 mt-1">Recommended 50–60 chars (current: {String(seoForm[titleEnKey]).length})</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{cur.labelZh} 描述（中文）</label>
                          <textarea rows={3} value={seoForm[descZhKey]}
                            onChange={e => setSeoForm(prev => ({ ...prev, [descZhKey]: e.target.value }))}
                            placeholder="（留空則沿用全站預設描述）"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 resize-none" />
                          <p className="text-xs text-gray-400 mt-1">建議 120–160 字元（目前：{String(seoForm[descZhKey]).length}）</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{cur.labelEn} Description (English)</label>
                          <textarea rows={3} value={seoForm[descEnKey]}
                            onChange={e => setSeoForm(prev => ({ ...prev, [descEnKey]: e.target.value }))}
                            placeholder="(Leave blank to use global default)"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30 resize-none" />
                          <p className="text-xs text-gray-400 mt-1">Recommended 120–160 chars (current: {String(seoForm[descEnKey]).length})</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">{cur.labelZh} 關鍵字 Keywords</label>
                        <input type="text" value={seoForm[kwKey]}
                          onChange={e => setSeoForm(prev => ({ ...prev, [kwKey]: e.target.value }))}
                          placeholder="（留空則沿用全站關鍵字 / Leave blank to use global keywords）"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                        <p className="text-xs text-gray-400 mt-1">用逗號分隔 / Separate with commas</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Google Search Console */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Search className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1A3D4A]">Google Search Console</h2>
                    <p className="text-xs text-gray-400">Site verification for Google Search Console</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Google 驗證碼</label>
                  <input type="text" value={seoForm.seo_google_verification}
                    onChange={(e) => setSeoForm((p) => ({ ...p, seo_google_verification: e.target.value }))}
                    placeholder="google-site-verification content value"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" />
                  <p className="text-xs text-gray-400 mt-1">從 Google Search Console 的 HTML tag 驗證方法取得</p>
                </div>
              </div>

              {/* Trust Stats Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1A3D4A]">信任數字 — Trust Stats</h2>
                    <p className="text-xs text-gray-400">全站顯示的四個統計數字（首頁及課程目錄）</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "stat_schools_served",      label: "合作學校及機構", placeholder: "多所", hint: "例如：多所 / 190+" },
                    { key: "stat_activity_programmes", label: "活動及課程數目",  placeholder: "400+", hint: "例如：400+ / 50+" },
                    { key: "stat_experience_years",    label: "年攝影及教育經驗", placeholder: "10+", hint: "例如：10+ / 15+" },
                    { key: "stat_campsite_sqft",       label: "營地面積 (sq.ft.)", placeholder: "80,000", hint: "例如：80,000" },
                  ].map(({ key, label, placeholder, hint }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={(seoForm as any)[key]}
                        onChange={(e) => setSeoForm((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30"
                      />
                      <p className="text-xs text-gray-400 mt-1">{hint}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">留空即使用預設值（business-facts.ts 的常數）</p>
              </div>

              {/* IndexNow Ping Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1A3D4A]">IndexNow — 立即通知搜尋引擎</h2>
                    <p className="text-xs text-gray-400">Instantly push your 5 pages to Bing, Yandex and partner search engines</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  每次更新網站後，按此按鈕可立即告訴搜尋引擎你的頁面有更新，無需等待自動爬取。
                </p>
                <div className="flex flex-col gap-3">
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500 font-mono break-all">
                    提交頁面：/ · /activities · /about · /partners · /contact
                  </div>
                  {indexnowResult && (
                    <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${indexnowResult.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {indexnowResult.ok
                        ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      {indexnowResult.message}
                    </div>
                  )}
                  <button type="button"
                    onClick={handlePingIndexNow}
                    disabled={indexnowPinging}
                    className="flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 w-fit">
                    {indexnowPinging ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                    {indexnowPinging ? "正在通知..." : "立即 Ping 搜尋引擎"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={seoSaving}
                className="flex items-center gap-2 bg-[#1A3D4A] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#1A3D4A]/90 transition-colors disabled:opacity-60">
                {seoSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                儲存 SEO 設定
              </button>
            </form>
          </div>
        )}

        {/* ── SETTINGS TAB ──────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="max-w-md space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1A3D4A]/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#1A3D4A]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1A3D4A]">更改管理員密碼</h2>
                  <p className="text-xs text-gray-400">Change Admin Password</p>
                </div>
              </div>

              {pwSuccess && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />密碼已成功更改！
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">當前密碼</label>
                  <div className="relative">
                    <input type={showCurrentPw ? "text" : "password"} value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)} placeholder="輸入當前密碼"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" required />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">新密碼</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} value={newPw}
                      onChange={(e) => setNewPw(e.target.value)} placeholder="輸入新密碼（最少4個字元）"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" required />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">確認新密碼</label>
                  <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="再次輸入新密碼"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" required />
                </div>
                {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
                <button type="submit" disabled={pwLoading}
                  className="w-full bg-[#1A3D4A] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1A3D4A]/90 transition-colors disabled:opacity-60">
                  {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}更改密碼
                </button>
              </form>
            </div>

            {/* Notification Settings Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1A3D4A]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#1A3D4A]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1A3D4A]">查詢通知設定</h2>
                  <p className="text-xs text-gray-400">Enquiry Notification Settings</p>
                </div>
              </div>

              {notifLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-[#1A3D4A]" />
                </div>
              ) : (
                <form onSubmit={handleSaveNotificationSettings} className="space-y-5">
                  {notifSuccess && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />設定已成功儲存！
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">電郵通知</p>
                      <p className="text-xs text-gray-400 mt-0.5">收到新查詢時發送電郵通知</p>
                    </div>
                    <button type="button" onClick={() => { setNotifEmailEnabled(!notifEmailEnabled); setNotifSuccess(false); }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifEmailEnabled ? "bg-[#1A3D4A]" : "bg-gray-200"}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifEmailEnabled ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>

                  {notifEmailEnabled && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">通知電郵地址</label>
                      <input type="email" value={notifRecipient}
                        onChange={(e) => { setNotifRecipient(e.target.value); setNotifSuccess(false); }}
                        placeholder="info@juntarhk.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3D4A]/30" required />
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">自動回覆</p>
                      <p className="text-xs text-gray-400 mt-0.5">向查詢者發送確認收到的電郵</p>
                    </div>
                    <button type="button" onClick={() => { setNotifAutoReply(!notifAutoReply); setNotifSuccess(false); }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifAutoReply ? "bg-[#1A3D4A]" : "bg-gray-200"}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifAutoReply ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>

                  {notifError && <p className="text-red-500 text-xs">{notifError}</p>}
                  <button type="submit" disabled={notifSaving}
                    className="w-full bg-[#1A3D4A] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1A3D4A]/90 transition-colors disabled:opacity-60">
                    {notifSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}儲存設定
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
              </main>
            </div>
          </>
        );
      })()}
    </div>
  );
}
