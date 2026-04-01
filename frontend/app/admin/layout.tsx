"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import logo from '../../public/icons/logo-desktop.png';
import logoSlide from '../../public/icons/logo-slide.png';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Mail,
  Send,
  LogOut,
  ChevronRight,
  Plus,
  X,
  Upload,
  Loader2,
  Globe,
  Network,
  Monitor,
  FileText,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { logoutAction } from './login/actions';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Client-side fetch helper — uses a server action to attach the httpOnly token
// admin-access / admin-refresh cookies are httpOnly — use /api/admin-proxy to call the API.
// We call a dedicated Next.js API route that reads the cookie server-side and proxies the request.
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch('/api/admin-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint,
      method: (options.method as string) || 'GET',
      body: options.body ? JSON.parse(options.body as string) : undefined,
    }),
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ─── Category config ──────────────────────────────────────────────────────────

type Category = 'Web Design' | 'Network Administration' | 'IT';

const CATEGORIES: {
  value: Category;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    value: 'Web Design',
    label: 'Web Design',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/50',
    icon: Globe,
    description: 'Framer website projects',
  },
  {
    value: 'Network Administration',
    label: 'Network Admin',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/50',
    icon: Network,
    description: 'Network setup & config',
  },
  {
    value: 'IT',
    label: 'IT',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/50',
    icon: Monitor,
    description: 'IT maintenance & support',
  },
];


// ─── Add Project Modal ────────────────────────────────────────────────────────

function AddProjectModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    year: new Date().getFullYear(),
    display_order: 0,
    framer_url: '',
    document_url: '',
    document_name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'display_order' ? Number(value) : value,
    }));
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  // FIX: Upload image to Supabase Storage bucket 'project-images'
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedImages = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedImages.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP or GIF images are allowed');
      return;
    }
    setUploadingImage(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('project-images').upload(fileName, file);
    if (error) {
      toast.error('Image upload failed: ' + error.message);
    } else {
      const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(data.path);
      setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      toast.success('Image uploaded! ✅');
    }
    setUploadingImage(false);
  };

  // Upload document (Network Admin / IT)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedCategory) return;

    const officeMimes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
    ];
    const isOffice = officeMimes.includes(file.type);
    const isNetworkUnl =
      selectedCategory === 'Network Administration' &&
      file.name.toLowerCase().endsWith('.unl');

    if (!isOffice && !isNetworkUnl) {
      toast.error(
        selectedCategory === 'Network Administration'
          ? 'Only .doc, .docx, .xls, .xlsx, .pdf, or .unl files are allowed'
          : 'Only .doc, .docx, .xls, .xlsx, .pdf files are allowed'
      );
      return;
    }
    if (isNetworkUnl && file.size > 15 * 1024 * 1024) {
      toast.error('.unl file must be under 15MB');
      return;
    }
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('project-documents').upload(fileName, file);
    if (error) {
      toast.error('Upload failed: ' + error.message);
    } else {
      const { data: urlData } = supabase.storage.from('project-documents').getPublicUrl(data.path);
      setForm((prev) => ({ ...prev, document_url: urlData.publicUrl, document_name: file.name }));
      toast.success('Document uploaded! ✅');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setLoading(true);

    // FIX: explicit payload with console.error for debugging
    const payload = {
      name: form.name,
      description: form.description,
      image_url: form.image_url || null,
      year: form.year,
      display_order: form.display_order,
      is_visible: true,
      category: selectedCategory,
      framer_url: selectedCategory === 'Web Design' ? form.framer_url : null,
      document_url: selectedCategory !== 'Web Design' ? form.document_url : null,
      document_name: selectedCategory !== 'Web Design' ? form.document_name : null,
    };

    try {
      await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success('Project added successfully! 🎉');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Insert error:', err);
      toast.error(`Failed to add project: ${err.message}`);
    }
    setLoading(false);
  };

  const catConfig = selectedCategory ? CATEGORIES.find((c) => c.value === selectedCategory)! : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl my-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-orange-600/15 blur-[60px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${catConfig ? catConfig.bg : 'bg-orange-600/20'}`}>
              {catConfig ? <catConfig.icon size={20} className={catConfig.color} /> : <FolderKanban size={20} className="text-orange-400" />}
            </div>
            <div>
              <h2 className="font-bold text-lg">{step === 1 ? 'Add Project' : `New ${catConfig?.label} Project`}</h2>
              <p className="text-zinc-500 text-xs">{step === 1 ? 'Choose a category to continue' : 'Fill in the project details'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1"><X size={20} /></button>
        </div>

        {step === 1 ? (
          <div className="p-6 space-y-3">
            {CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => handleSelectCategory(cat.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border ${cat.border} ${cat.bg} hover:opacity-90 transition-all text-left`}>
                <div className="p-2.5 rounded-xl bg-zinc-900"><cat.icon size={20} className={cat.color} /></div>
                <div>
                  <div className={`font-semibold ${cat.color}`}>{cat.label}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{cat.description}</div>
                </div>
                <ChevronRight size={16} className="text-zinc-600 ml-auto" />
              </button>
            ))}
          </div>
        ) : (
          /* Step 2 — Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Project Name <span className="text-orange-400">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="My Awesome Project"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600" />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Brief description of the project..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600 resize-none" />
            </div>

            {/* Image upload — context-aware label per category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                {selectedCategory === 'Web Design'
                  ? <><Globe size={13} className="text-orange-400" /> Website Screenshot</>
                  : selectedCategory === 'Network Administration'
                  ? <><Network size={13} className="text-blue-400" /> Network Architecture Diagram</>
                  : <><Monitor size={13} className="text-purple-400" /> Project Thumbnail</>
                }
                <span className="text-zinc-500 text-xs font-normal ml-1">JPG, PNG, WEBP</span>
              </label>

              {form.image_url ? (
                <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-36">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm((p) => ({ ...p, image_url: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-lg text-zinc-300 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center gap-2 p-6 bg-zinc-950 border border-dashed rounded-xl cursor-pointer transition-all group ${
                  selectedCategory === 'Web Design' ? 'border-orange-500/30 hover:border-orange-500/60'
                  : selectedCategory === 'Network Administration' ? 'border-blue-500/30 hover:border-blue-500/60'
                  : 'border-zinc-700 hover:border-zinc-500'
                }`}>
                  {uploadingImage
                    ? <Loader2 size={20} className="animate-spin text-orange-400" />
                    : <Upload size={20} className={`transition-colors ${
                        selectedCategory === 'Web Design' ? 'text-orange-400/50 group-hover:text-orange-400'
                        : selectedCategory === 'Network Administration' ? 'text-blue-400/50 group-hover:text-blue-400'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                      }`} />
                  }
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors text-center">
                    {uploadingImage ? 'Uploading...'
                      : selectedCategory === 'Web Design' ? 'Upload website screenshot'
                      : selectedCategory === 'Network Administration' ? 'Upload network architecture diagram'
                      : 'Upload project thumbnail'
                    }
                  </span>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              )}
            </div>

            {/* Web Design → Framer URL */}
            {selectedCategory === 'Web Design' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <Globe size={13} className="text-orange-400" /> Framer URL <span className="text-orange-400">*</span>
                </label>
                <input name="framer_url" type="url" value={form.framer_url} onChange={handleChange} required
                  placeholder="https://yourproject.framer.website"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600" />
                {form.framer_url && (
                  <a href={form.framer_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                    <ExternalLink size={11} /> Preview URL
                  </a>
                )}
              </div>
            )}

            {/* Network Admin / IT → Document upload */}
            {selectedCategory !== 'Web Design' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <FileText size={13} className="text-blue-400" />
                  {selectedCategory === 'Network Administration' ? 'Network Report / Config File' : 'IT Report / Documentation'}
                  <span className="text-zinc-500 text-xs font-normal ml-1">
                    {selectedCategory === 'Network Administration'
                      ? '.doc .docx .xls .xlsx .pdf .unl'
                      : '.doc .docx .xls .xlsx .pdf'}
                  </span>
                </label>
                {form.document_url ? (
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-blue-400 shrink-0" />
                      <span className="text-sm truncate text-zinc-300">{form.document_name}</span>
                    </div>
                    <button type="button" onClick={() => setForm((p) => ({ ...p, document_url: '', document_name: '' }))}
                      className="text-zinc-500 hover:text-red-400 transition-colors ml-2 shrink-0"><X size={14} /></button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-6 bg-zinc-950 border border-dashed border-blue-500/30 hover:border-blue-500/60 rounded-xl cursor-pointer transition-all group">
                    {uploading ? <Loader2 size={20} className="animate-spin text-blue-400" /> : <Upload size={20} className="text-blue-400/50 group-hover:text-blue-400 transition-colors" />}
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {uploading ? 'Uploading...' : 'Click to upload document'}
                    </span>
                    <input
                      type="file"
                      accept={
                        selectedCategory === 'Network Administration'
                          ? '.doc,.docx,.xls,.xlsx,.pdf,.unl'
                          : '.doc,.docx,.xls,.xlsx,.pdf'
                      }
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Year + Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Year <span className="text-orange-400">*</span></label>
                <input name="year" type="number" value={form.year} onChange={handleChange} required min={2000} max={2100}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Display Order</label>
                <input name="display_order" type="number" value={form.display_order} onChange={handleChange} min={0}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-sm font-medium">
                Back
              </button>
              <button type="submit" disabled={loading || uploading || uploadingImage}
                className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-600/20">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Plus size={16} /> Add Project</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideNavbar    = pathname === '/admin/login';
  const isProjectsPage = pathname === '/admin/projects';

  const [showAddProject, setShowAddProject] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard',    href: '/admin',               icon: LayoutDashboard },
    { label: 'Projects',     href: '/admin/projects',      icon: FolderKanban    },
    { label: 'Testimonials', href: '/admin/testimonials',  icon: Users           },
    { label: 'Inquiries',    href: '/admin/inquiries',     icon: Mail            },
    { label: 'Newsletter',   href: '/admin/newsletter',    icon: Send            },
  ];

  // Bottom tab bar shows only 4 most important items + "More" trigger
  const bottomItems = menuItems.slice(0, 4);

  const handleLogout = async () => {
    try {
      await logoutAction();
      toast.success('Logged out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  if (hideNavbar) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-200">{children}</div>;
  }

  return (
    <>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-200">

      
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2 p-[10%]">
              <Image src={logo} alt="logo" className="w-35 h-20" loading="eager" />
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                      : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-left"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 flex flex-col min-w-0">

          {/* Top header */}
          <header className="h-16 border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            {/* Mobile: logo as drawer trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:ring-2 hover:ring-orange-500/50 transition-all"
            >
              <Image src={logoSlide} alt="menu" width={40} height={40} className="rounded-full" />
            </button>

            <h1 className="font-semibold text-lg">
              {menuItems.find((i) => i.href === pathname)?.label || 'Dashboard'}
            </h1>

            <div className="flex items-center gap-3">
              {isProjectsPage && (
                <button
                  onClick={() => setShowAddProject(true)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/20"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Project</span>
                </button>
              )}
            </div>
          </header>

          {/* Page content — add bottom padding on mobile for tab bar */}
          <div className="p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* ── MOBILE DRAWER (slide in from left) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <Link href="/" onClick={() => setDrawerOpen(false)}>
                <Image src={logo} alt="logo" className="h-12 w-auto" />
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                        : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={16} />}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-zinc-800">
              <button
                onClick={() => { setDrawerOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-left"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isActive ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-orange-500/15' : ''
                }`}>
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}

          {/* "More" button → opens drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-zinc-500 hover:text-zinc-300 transition-all min-w-[60px]"
          >
            <div className="p-1.5 rounded-lg">
              <Menu size={20} />
            </div>
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onSuccess={() => {
            // Only refresh if we're on the projects page, otherwise do nothing
            if (pathname === '/admin/projects') {
              // Use a more targeted refresh that won't redirect
              window.location.reload();
            }
          }}
        />
      )}
    </>
  );
}