'use client';

import React, { useState, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/portfolio-data';
import {
  StoredProject,
  addStoredProject,
  updateStoredProject,
  deleteStoredProject,
  useProjects,
} from '@/lib/projects-store';
import {
  useCv,
  saveCvDocument,
  deleteCvDocument,
  MAX_CV_FILE_SIZE,
} from '@/lib/cv-store';
import { CircuitBackground } from '@/components/CircuitBackground';
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Globe,
  Search,
  Mail,
  KeyRound,
  X,
  ExternalLink,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

const AUTH_STORAGE_KEY = 'ce_admin_logged_in';
const AUTH_EVENT = 'ce_admin_auth_event';
const DEFAULT_ADMIN_EMAIL = 'admin@mansoor.ce';
const DEFAULT_ADMIN_PASS = 'admin123';

function getAuthSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

function getServerAuthSnapshot(): boolean {
  return false;
}

function subscribeAuth(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

const MAX_PROJECT_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB raw upload limit

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('READ_FAILED'));
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 900;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try JPEG compression so any uploaded image fits safely inside Firestore 1 MiB document limits
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 900000 && quality > 0.35) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        if (dataUrl.length > 1000000) {
          reject(new Error('IMAGE_TOO_LARGE'));
          return;
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('INVALID_IMAGE'));
      img.src = result;
    };
    reader.onerror = () => reject(new Error('READ_FAILED'));
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const isSessionAuth = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
  const [localAuth, setLocalAuth] = useState(false);
  const isAuthenticated = isSessionAuth || localAuth;

  // Sign In Form States
  const [emailInput, setEmailInput] = useState(DEFAULT_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState(DEFAULT_ADMIN_PASS);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Projects State from centralized useProjects hook (useSyncExternalStore)
  const projects = useProjects();
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<StoredProject | null>(null);
  const [previewProject, setPreviewProject] = useState<StoredProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<StoredProject | null>(null);

  // Form Fields
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescAr, setFormDescAr] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const projectImageInputRef = useRef<HTMLInputElement | null>(null);
  const [projectImageName, setProjectImageName] = useState('');
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const [projectImageDragActive, setProjectImageDragActive] = useState(false);

  // CV Document Upload State
  const cvDoc = useCv();
  const cvFileInputRef = useRef<HTMLInputElement | null>(null);
  const [cvDragActive, setCvDragActive] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvSuccess, setCvSuccess] = useState<string | null>(null);
  const [isPreviewingCv, setIsPreviewingCv] = useState(false);

  // Sync document dir and lang
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Simple validation (accepts default or any properly formatted admin credentials)
    if (!emailInput || !passwordInput) {
      setAuthError(locale === 'en' ? 'Please enter both email and password.' : 'يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    if (passwordInput.length < 4) {
      setAuthError(locale === 'en' ? 'Password must be at least 4 characters.' : 'كلمة المرور يجب أن لا تقل عن 4 خانات.');
      return;
    }

    // Success login
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    window.dispatchEvent(new Event(AUTH_EVENT));
    setLocalAuth(true);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
    setLocalAuth(false);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormTitleEn('');
    setFormTitleAr('');
    setFormImage('');
    setProjectImageName('');
    setFormDescEn('');
    setFormDescAr('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: StoredProject) => {
    setEditingProject(project);
    setFormTitleEn(project.title.en);
    setFormTitleAr(project.title.ar);
    setFormImage(project.image);
    setProjectImageName('');
    setFormDescEn(project.description.en);
    setFormDescAr(project.description.ar);
    setFormError(null);
    setIsModalOpen(true);
  };

  const processProjectImageFile = async (file: File | undefined | null) => {
    if (!file) return;
    setFormError(null);

    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const lowerName = file.name.toLowerCase();
    const isImageType =
      file.type.startsWith('image/') ||
      allowedExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isImageType) {
      setFormError(
        locale === 'en'
          ? 'Unsupported image format. Please upload a PNG, JPG, WEBP, or GIF image.'
          : 'صيغة الصورة غير مدعومة. يرجى رفع صورة بصيغة PNG أو JPG أو WEBP أو GIF.'
      );
      return;
    }

    if (file.size > MAX_PROJECT_IMAGE_BYTES) {
      setFormError(
        locale === 'en'
          ? 'Image file is too large. Please upload an image under 5 MB.'
          : 'حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 5 ميجابايت.'
      );
      return;
    }

    setProjectImageUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setFormImage(dataUrl);
      setProjectImageName(file.name);
    } catch {
      setFormError(
        locale === 'en'
          ? 'Could not process the selected image. Please try another image.'
          : 'تعذر معالجة الصورة المختارة. يرجى تجربة صورة أخرى.'
      );
    } finally {
      setProjectImageUploading(false);
      if (projectImageInputRef.current) {
        projectImageInputRef.current.value = '';
      }
    }
  };

  const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void processProjectImageFile(file);
  };

  const handleProjectImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectImageDragActive(false);
    const file = e.dataTransfer.files?.[0];
    void processProjectImageFile(file);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitleEn.trim()) {
      setFormError(locale === 'en' ? 'English title is required.' : 'العنوان بالإنجليزية مطلوب.');
      return;
    }

    if (!formImage.trim()) {
      setFormError(locale === 'en' ? 'Please upload a project image.' : 'يرجى رفع صورة للمشروع.');
      return;
    }

    const payload = {
      title: {
        en: formTitleEn.trim(),
        ar: formTitleAr.trim() || formTitleEn.trim(),
      },
      image: formImage.trim(),
      description: {
        en: formDescEn.trim(),
        ar: formDescAr.trim() || formDescEn.trim(),
      },
    };

    if (editingProject) {
      await updateStoredProject(editingProject.id, payload);
    } else {
      await addStoredProject(payload);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deletingProject) {
      await deleteStoredProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  // Filtered and paginated projects (newest 10 rows + load more)
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.en.toLowerCase().includes(q) ||
        p.title.ar.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q) ||
        p.description.ar.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const processCvFile = async (file: File | undefined | null) => {
    if (!file) return;
    setCvError(null);
    setCvSuccess(null);
    setCvUploading(true);
    try {
      await saveCvDocument(file);
      setCvSuccess(
        locale === 'en'
          ? `"${file.name}" uploaded successfully.`
          : `تم رفع الملف "${file.name}" بنجاح.`
      );
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      if (code === 'INVALID_TYPE') {
        setCvError(
          locale === 'en'
            ? 'Unsupported file type. Please upload a .pdf, .doc, or .docx document.'
            : 'نوع الملف غير مدعوم. يرجى رفع ملف بصيغة PDF أو DOC أو DOCX.'
        );
      } else if (code === 'FILE_TOO_LARGE') {
        setCvError(
          locale === 'en'
            ? `File is too large. Maximum size is ${Math.round(MAX_CV_FILE_SIZE / 1024)} KB.`
            : `حجم الملف كبير جداً. الحد الأقصى هو ${Math.round(MAX_CV_FILE_SIZE / 1024)} كيلوبايت.`
        );
      } else {
        setCvError(
          locale === 'en'
            ? 'Could not upload the CV file. Please try again.'
            : 'تعذر رفع السيرة الذاتية. يرجى المحاولة مرة أخرى.'
        );
      }
    } finally {
      setCvUploading(false);
      if (cvFileInputRef.current) {
        cvFileInputRef.current.value = '';
      }
    }
  };

  const handleCvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void processCvFile(file);
  };

  const handleCvDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCvDragActive(false);
    const file = e.dataTransfer.files?.[0];
    void processCvFile(file);
  };

  const handleRemoveCv = async () => {
    setCvError(null);
    setCvSuccess(null);
    await deleteCvDocument();
    setCvSuccess(
      locale === 'en' ? 'CV document removed.' : 'تم حذف السيرة الذاتية.'
    );
  };

  // Render Login Form if unauthenticated
  if (!isAuthenticated) {
    return (
      <div
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className="relative min-h-screen bg-[#0A0E14] text-[#F1F5F9] flex flex-col justify-between selection:bg-[#4CE0D2]/25 selection:text-white"
      >
        <CircuitBackground />

        {/* Top Minimal Bar */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#4CE0D2] transition-colors"
          >
            {locale === 'ar' ? (
              <>
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة إلى الموقع</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Portfolio</span>
              </>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setLocale((prev) => (prev === 'en' ? 'ar' : 'en'))}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 bg-slate-900/60 border border-[#4CE0D2]/25 rounded hover:border-[#4CE0D2] transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#4CE0D2]" />
            <span>{locale === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </header>

        {/* Centered Sign In Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-[#0E1520]/85 backdrop-blur-xl border border-[#4CE0D2]/20 rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
            {/* Header Lock Icon & Titles */}
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900/80 border border-[#4CE0D2]/30 shadow-[0_0_20px_rgba(76,224,210,0.2)]">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  {locale === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المسؤول'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {locale === 'en'
                    ? 'Firebase Firestore & Portfolio Management'
                    : 'إدارة مشاريع ملف الأعمال وقاعدة البيانات'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-3 text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg">
                {authError}
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  {locale === 'en' ? 'Admin Email' : 'البريد الإلكتروني'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="admin@mansoor.ce"
                    className="w-full ps-10 pe-3 py-2.5 text-sm bg-slate-900/70 border border-[#4CE0D2]/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4CE0D2] focus:ring-1 focus:ring-[#4CE0D2] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-300">
                    {locale === 'en' ? 'Password' : 'كلمة المرور'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-[#4CE0D2] transition-colors cursor-pointer"
                  >
                    {showPassword
                      ? locale === 'en' ? 'Hide' : 'إخفاء'
                      : locale === 'en' ? 'Show' : 'إظهار'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full ps-10 pe-3 py-2.5 text-sm bg-slate-900/70 border border-[#4CE0D2]/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4CE0D2] focus:ring-1 focus:ring-[#4CE0D2] transition-colors"
                  />
                </div>
              </div>

              {/* Sign In CTA Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-lg bg-[#4CE0D2] text-[#0A0E14] font-medium text-sm hover:bg-[#3ec4b7] transition-all shadow-[0_0_20px_rgba(76,224,210,0.2)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE0D2]"
              >
                {locale === 'en' ? 'Sign In to Dashboard' : 'الدخول إلى لوحة التحكم'}
              </button>

              {/* Quick Preset Fill Helper */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput(DEFAULT_ADMIN_EMAIL);
                    setPasswordInput(DEFAULT_ADMIN_PASS);
                  }}
                  className="text-[11px] text-slate-400 hover:text-[#4CE0D2] transition-colors cursor-pointer"
                >
                  {locale === 'en'
                    ? 'Default credentials: admin@mansoor.ce / admin123'
                    : 'بيانات الدخول الافتراضية: admin@mansoor.ce / admin123'}
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Quiet Footer */}
        <footer className="relative z-10 w-full py-4 text-center text-[11px] text-slate-600">
          Fahed Al-Mansoor Portfolio System
        </footer>
      </div>
    );
  }

  // Render Admin Dashboard when authenticated
  return (
    <div
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="relative min-h-screen bg-[#0A0E14] text-[#F1F5F9] selection:bg-[#4CE0D2]/25 selection:text-white"
    >
      <CircuitBackground />

      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#4CE0D2]/15 bg-[#0A0E14]/85 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand & Area Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              title={locale === 'en' ? 'Back to Portfolio' : 'العودة للموقع'}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900/80 border border-[#4CE0D2]/30">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={22}
                  height={22}
                  className="w-5 h-5 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-sm font-semibold text-white tracking-tight group-hover:text-[#4CE0D2] transition-colors">
                  {locale === 'en' ? 'Dashboard' : 'لوحة التحكم'}
                </span>
              </div>
            </Link>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3">
            {/* View Live Portfolio */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 border border-[#4CE0D2]/20 rounded-md hover:border-[#4CE0D2] transition-all"
            >
              <span>{locale === 'en' ? 'View Live Site' : 'عرض الموقع'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#4CE0D2]" />
            </Link>

            {/* Admin session indicator */}
            <span className="hidden lg:inline-block text-xs text-slate-400 font-mono truncate max-w-[150px]">
              {DEFAULT_ADMIN_EMAIL}
            </span>

            {/* Locale Toggle */}
            <button
              type="button"
              onClick={() => setLocale((prev) => (prev === 'en' ? 'ar' : 'en'))}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900/60 border border-[#4CE0D2]/20 rounded-md hover:border-[#4CE0D2] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#4CE0D2]" />
              <span className="hidden sm:inline">{locale === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 hover:text-white bg-red-950/30 border border-red-500/20 hover:border-red-500/40 rounded-md transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{locale === 'en' ? 'Sign Out' : 'تسجيل الخروج'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12 space-y-8">
        {/* Top Header Row with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {locale === 'en' ? 'Portfolio Projects' : 'مشاريع ملف الأعمال'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4CE0D2] text-[#0A0E14] font-medium text-xs sm:text-sm hover:bg-[#3ec4b7] transition-all shadow-[0_0_20px_rgba(76,224,210,0.25)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'en' ? 'Add New Project' : 'إضافة مشروع جديد'}</span>
            </button>
          </div>
        </div>

        {/* CV Document Upload Section */}
        <section className="bg-[#0E1520]/70 backdrop-blur-lg border border-[#4CE0D2]/20 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900/80 border border-[#4CE0D2]/25 text-[#4CE0D2] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  {locale === 'en' ? 'CV Document' : 'ملف السيرة الذاتية (CV)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {locale === 'en'
                    ? 'Upload a PDF or Word document (.pdf, .doc, .docx · max 700 KB) to display on your portfolio.'
                    : 'ارفع ملف PDF أو Word (بحد أقصى 700 كيلوبايت) لعرضه للتحميل في الموقع.'}
                </p>
              </div>
            </div>

            <input
              ref={cvFileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleCvInputChange}
              className="hidden"
            />
          </div>

          {cvError && (
            <div className="p-3 text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg">
              {cvError}
            </div>
          )}

          {cvSuccess && (
            <div className="flex items-center gap-2 p-3 text-xs text-[#4CE0D2] bg-[#4CE0D2]/10 border border-[#4CE0D2]/30 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{cvSuccess}</span>
            </div>
          )}

          {cvDoc ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-[#4CE0D2]/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#4CE0D2]/10 border border-[#4CE0D2]/30 flex items-center justify-center text-[#4CE0D2] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{cvDoc.fileName}</p>
                  <p suppressHydrationWarning className="text-xs text-slate-400 font-mono">
                    {formatFileSize(cvDoc.fileSize)} ·{' '}
                    {new Date(cvDoc.updatedAt).toLocaleDateString(
                      locale === 'ar' ? 'ar-KW' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {cvDoc.mimeType === 'application/pdf' && (
                  <button
                    type="button"
                    onClick={() => setIsPreviewingCv(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-[#4CE0D2]/20 hover:border-[#4CE0D2] transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#4CE0D2]" />
                    <span>{locale === 'en' ? 'Preview' : 'معاينة'}</span>
                  </button>
                )}

                <a
                  href={cvDoc.dataUrl}
                  download={cvDoc.fileName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-[#4CE0D2]/20 hover:border-[#4CE0D2] transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#4CE0D2]" />
                  <span>{locale === 'en' ? 'Download' : 'تحميل'}</span>
                </a>

                <button
                  type="button"
                  disabled={cvUploading}
                  onClick={() => cvFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0A0E14] bg-[#4CE0D2] hover:bg-[#3ec4b7] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{locale === 'en' ? 'Replace' : 'استبدال'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveCv}
                  title={locale === 'en' ? 'Remove CV' : 'حذف السيرة الذاتية'}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-200 bg-red-950/20 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setCvDragActive(true);
              }}
              onDragLeave={() => setCvDragActive(false)}
              onDrop={handleCvDrop}
              onClick={() => cvFileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  cvFileInputRef.current?.click();
                }
              }}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-dashed transition-all cursor-pointer ${
                cvDragActive
                  ? 'border-[#4CE0D2] bg-[#4CE0D2]/10'
                  : 'border-[#4CE0D2]/25 bg-slate-900/40 hover:border-[#4CE0D2]/60 hover:bg-slate-900/60'
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-[#4CE0D2]/25 text-[#4CE0D2]">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-white text-center">
                {cvUploading
                  ? locale === 'en'
                    ? 'Uploading document...'
                    : 'جاري رفع الملف...'
                  : locale === 'en'
                    ? 'Click to upload or drag & drop your CV here'
                    : 'اضغط للرفع أو اسحب ملف السيرة الذاتية هنا'}
              </p>
              <p className="text-[11px] text-slate-400">
                {locale === 'en'
                  ? 'Supported formats: PDF, DOC, DOCX (up to 700 KB)'
                  : 'الصيغ المدعومة: PDF، DOC، DOCX (بحد أقصى 700 كيلوبايت)'}
              </p>
            </div>
          )}
        </section>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-lg border border-[#4CE0D2]/15 p-3 rounded-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute inset-y-0 start-3 my-auto text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(10);
              }}
              placeholder={
                locale === 'en'
                  ? 'Search by title or keyword...'
                  : 'البحث بالعنوان أو الكلمة المفتاحية...'
              }
              className="w-full ps-9 pe-4 py-2 text-xs sm:text-sm bg-slate-900/60 border border-[#4CE0D2]/15 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4CE0D2]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 px-2 shrink-0">
            <span>
              {locale === 'en'
                ? `Showing ${Math.min(displayedProjects.length, filteredProjects.length)} of ${filteredProjects.length}`
                : `عرض ${Math.min(displayedProjects.length, filteredProjects.length)} من أصل ${filteredProjects.length}`}
            </span>
          </div>
        </div>

        {/* Projects Table Card */}
        <div className="bg-[#0E1520]/70 backdrop-blur-lg border border-[#4CE0D2]/20 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#4CE0D2]/15 bg-slate-900/60 text-slate-300 font-medium text-xs">
                  <th className="py-3.5 px-4 sm:px-6 text-start">
                    {locale === 'en' ? 'Project' : 'المشروع'}
                  </th>
                  <th className="py-3.5 px-4 text-start hidden md:table-cell">
                    {locale === 'en' ? 'Description' : 'الوصف'}
                  </th>
                  <th className="py-3.5 px-4 text-start hidden lg:table-cell">
                    {locale === 'en' ? 'Date' : 'التاريخ'}
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 text-end">
                    {locale === 'en' ? 'Actions' : 'إجراءات'}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#4CE0D2]/10">
                {displayedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      {locale === 'en' ? 'No projects match your criteria.' : 'لا توجد مشاريع تطابق البحث.'}
                    </td>
                  </tr>
                ) : (
                  displayedProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Project Thumbnail & Title */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-9 sm:w-16 sm:h-11 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-[#4CE0D2]/15">
                            <Image
                              src={project.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <p className="font-medium text-white truncate group-hover:text-[#4CE0D2] transition-colors">
                              {project.title[locale]}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Description Preview */}
                      <td className="py-3.5 px-4 text-slate-400 max-w-md hidden md:table-cell">
                        <p className="line-clamp-2 text-xs leading-relaxed">
                          {project.description[locale]}
                        </p>
                      </td>

                      {/* Date */}
                      <td
                        suppressHydrationWarning
                        className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-xs font-mono tabular-nums hidden lg:table-cell"
                      >
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-end whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Inspect */}
                          <button
                            type="button"
                            onClick={() => setPreviewProject(project)}
                            title={locale === 'en' ? 'Preview' : 'معاينة'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-transparent hover:border-[#4CE0D2]/30 transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-[#4CE0D2]" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditModal(project)}
                            title={locale === 'en' ? 'Edit' : 'تعديل'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-transparent hover:border-[#4CE0D2]/30 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4 text-slate-200" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingProject(project)}
                            title={locale === 'en' ? 'Delete' : 'حذف'}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-200 bg-red-950/20 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Load More Button for Pagination */}
          {hasMore && (
            <div className="p-4 sm:p-6 text-center border-t border-[#4CE0D2]/15 bg-slate-900/40">
              <button
                type="button"
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-slate-900/80 border border-[#4CE0D2]/30 hover:border-[#4CE0D2] hover:bg-[#4CE0D2]/10 transition-all cursor-pointer shadow-sm"
              >
                <span>
                  {locale === 'en'
                    ? `Load More (${filteredProjects.length - visibleCount} remaining)`
                    : `عرض المزيد (${filteredProjects.length - visibleCount} متبقٍ)`}
                </span>
              </button>
            </div>
          )}

          {!hasMore && filteredProjects.length > 10 && (
            <div className="py-4 text-center text-xs text-slate-500 border-t border-[#4CE0D2]/10">
              {locale === 'en' ? 'All projects loaded.' : 'تم عرض جميع المشاريع.'}
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-[#0A0E14]/85 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-2xl bg-[#0E1520]/95 border border-[#4CE0D2]/30 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.85)] z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#4CE0D2]/15 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  {editingProject
                    ? locale === 'en' ? 'Edit Project' : 'تعديل المشروع'
                    : locale === 'en' ? 'Add New Project' : 'إضافة مشروع جديد'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {locale === 'en'
                    ? 'Enter project details and upload an image'
                    : 'أدخل تفاصيل المشروع وارفع صورة المشروع'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900/60 border border-[#4CE0D2]/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3 text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg">
                  {formError}
                </div>
              )}

              {/* Title EN & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {locale === 'en' ? 'Title (English) *' : 'العنوان (بالإنجليزية) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Smart RFID Gate Controller"
                    className="w-full px-3 py-2 text-sm bg-slate-900/70 border border-[#4CE0D2]/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4CE0D2]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {locale === 'en' ? 'Title (Arabic)' : 'العنوان (بالعربية)'}
                  </label>
                  <input
                    type="text"
                    value={formTitleAr}
                    onChange={(e) => setFormTitleAr(e.target.value)}
                    placeholder="مثال: وحدة تحكم ذكية بالبوابة عبر RFID"
                    className="w-full px-3 py-2 text-sm bg-slate-900/70 border border-[#4CE0D2]/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4CE0D2]"
                  />
                </div>
              </div>

              {/* Project Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  {locale === 'en' ? 'Project Image *' : 'صورة المشروع *'}
                </label>

                <input
                  ref={projectImageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
                  onChange={handleProjectImageChange}
                  className="hidden"
                />

                {formImage ? (
                  <div className="rounded-xl overflow-hidden border border-[#4CE0D2]/25 bg-slate-900/60">
                    <div className="relative w-full aspect-[16/9] bg-slate-950">
                      <Image
                        src={formImage}
                        alt={formTitleEn || 'Project preview'}
                        fill
                        sizes="(max-width: 640px) 100vw, 600px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#4CE0D2]/15">
                      <span className="text-xs text-slate-300 truncate max-w-[260px]">
                        {projectImageName ||
                          (locale === 'en' ? 'Selected project image' : 'صورة المشروع الحالية')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={projectImageUploading}
                          onClick={() => projectImageInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0A0E14] bg-[#4CE0D2] hover:bg-[#3ec4b7] transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{locale === 'en' ? 'Change Image' : 'تغيير الصورة'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormImage('');
                            setProjectImageName('');
                          }}
                          title={locale === 'en' ? 'Remove image' : 'إزالة الصورة'}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-200 bg-red-950/20 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setProjectImageDragActive(true);
                    }}
                    onDragLeave={() => setProjectImageDragActive(false)}
                    onDrop={handleProjectImageDrop}
                    onClick={() => projectImageInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        projectImageInputRef.current?.click();
                      }
                    }}
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-dashed transition-all cursor-pointer ${
                      projectImageDragActive
                        ? 'border-[#4CE0D2] bg-[#4CE0D2]/10'
                        : 'border-[#4CE0D2]/25 bg-slate-900/50 hover:border-[#4CE0D2]/60 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-[#4CE0D2]/25 text-[#4CE0D2]">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-white text-center">
                      {projectImageUploading
                        ? locale === 'en'
                          ? 'Processing image...'
                          : 'جاري معالجة الصورة...'
                        : locale === 'en'
                          ? 'Click to upload or drag & drop project image'
                          : 'اضغط لرفع صورة المشروع أو اسحبها هنا'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {locale === 'en'
                        ? 'Supported formats: PNG, JPG, WEBP, GIF (max 5 MB)'
                        : 'الصيغ المدعومة: PNG، JPG، WEBP، GIF (بحد أقصى 5 ميجابايت)'}
                    </p>
                  </div>
                )}
              </div>

              {/* Description EN & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {locale === 'en' ? 'Description (English, 1-2 sentences)' : 'الوصف (بالإنجليزية)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    placeholder="Brief 1-2 sentences explaining what you built..."
                    className="w-full px-3 py-2 text-sm bg-slate-900/70 border border-[#4CE0D2]/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4CE0D2]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    {locale === 'en' ? 'Description (Arabic)' : 'الوصف (بالعربية)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formDescAr}
                    onChange={(e) => setFormDescAr(e.target.value)}
                    placeholder="جملة أو جملتان توضحان ما تم بناؤه..."
                    className="w-full px-3 py-2 text-sm bg-slate-900/70 border border-[#4CE0D2]/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#4CE0D2]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#4CE0D2]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {locale === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-medium text-[#0A0E14] bg-[#4CE0D2] hover:bg-[#3ec4b7] rounded-lg transition-all shadow-[0_0_15px_rgba(76,224,210,0.2)] cursor-pointer"
                >
                  {editingProject
                    ? locale === 'en' ? 'Save Changes' : 'حفظ التعديلات'
                    : locale === 'en' ? 'Create Project' : 'إنشاء المشروع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#0A0E14]/85 backdrop-blur-md"
            onClick={() => setPreviewProject(null)}
          />
          <div className="relative w-full max-w-lg bg-[#0E1520] border border-[#4CE0D2]/30 rounded-2xl overflow-hidden shadow-2xl z-10">
            <div className="relative w-full aspect-[16/10] bg-slate-950">
              <Image
                src={previewProject.image}
                alt=""
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="absolute top-3 end-3 p-1.5 rounded-full bg-black/60 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-semibold text-white">{previewProject.title[locale]}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {previewProject.description[locale]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#0A0E14]/85 backdrop-blur-md"
            onClick={() => setDeletingProject(null)}
          />
          <div className="relative w-full max-w-md bg-[#0E1520] border border-red-500/30 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {locale === 'en' ? 'Delete Project?' : 'حذف المشروع؟'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {locale === 'en'
                ? `Are you sure you want to delete "${deletingProject.title.en}"? This action cannot be undone.`
                : `هل أنت متأكد من رغبتك في حذف "${deletingProject.title.ar}"؟ لا يمكن التراجع عن هذا الإجراء.`}
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer"
              >
                {locale === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
              >
                {locale === 'en' ? 'Delete' : 'تأكيد الحذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CV PDF PREVIEW MODAL */}
      {isPreviewingCv && cvDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#0A0E14]/85 backdrop-blur-md"
            onClick={() => setIsPreviewingCv(false)}
          />
          <div className="relative w-full max-w-4xl h-[85vh] bg-[#0E1520] border border-[#4CE0D2]/30 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <div className="px-5 py-3.5 border-b border-[#4CE0D2]/15 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[#4CE0D2] shrink-0" />
                <span className="text-sm font-medium text-white truncate">{cvDoc.fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewingCv(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900/60 border border-[#4CE0D2]/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <iframe
              src={cvDoc.dataUrl}
              title={cvDoc.fileName}
              className="w-full flex-1 bg-slate-950"
            />
          </div>
        </div>
      )}
    </div>
  );
}
