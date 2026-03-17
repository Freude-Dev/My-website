"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import logo from '../../public/icons/logo-desktop.png';
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
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { logoutAction } from './login/actions';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'year' || name === 'display_order' ? Number(value) : value,
    }));
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
    ];

    if (!allowed.includes(file.type)) {
      toast.error('Only .doc, .docx, .xls, .xlsx, .pdf files are allowed');
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('project-documents')
      .upload(fileName, file);

    if (error) {
      toast.error('Upload failed: ' + error.message);
    } else {
      const { data: urlData } = supabase.storage
        .from('project-documents')
        .getPublicUrl(data.path);
      setForm((prev) => ({
        ...prev,
        document_url: urlData.publicUrl,
        document_name: file.name,
      }));
      toast.success('Document uploaded! ✅');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setLoading(true);

    const { error } = await supabase.from('projects').insert([{
      name: form.name,
      description: form.description,
      image_url: form.image_url,
      year: form.year,
      display_order: form.display_order,
      is_visible: true,
      category: selectedCategory,
      framer_url: selectedCategory === 'Web Design' ? form.framer_url : null,
      document_url: selectedCategory !== 'Web Design' ? form.document_url : null,
      document_name: selectedCategory !== 'Web Design' ? form.document_name : null,
    }]);

    if (error) {
      toast.error('Failed to add project: ' + error.message);
    } else {
      toast.success('Project added successfully! 🎉');
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  const catConfig = selectedCategory
    ? CATEGORIES.find((c) => c.value === selectedCategory)!
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl my-4 overflow-hidden">

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-orange-600/15 blur-[60px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${catConfig ? catConfig.bg : 'bg-orange-600/20'}`}>
              {catConfig
                ? <catConfig.icon size={20} className={catConfig.color} />
                : <FolderKanban size={20} className="text-orange-400" />
              }
            </div>
            <div>
              <h2 className="font-bold text-lg">
                {step === 1 ? 'Add New Project' : `New ${selectedCategory} Project`}
              </h2>
              <p className="text-zinc-500 text-xs">
                {step === 1 ? 'Select a service category to begin' : 'Fill in the project details below'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-3 border-b border-zinc-800 bg-zinc-950/40 gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                {s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? 'text-zinc-200' : 'text-zinc-600'}`}>
                {s === 1 ? 'Select Category' : 'Project Details'}
              </span>
              {s < 2 && <ChevronRight size={12} className="text-zinc-600" />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Category selection ── */}
        {step === 1 && (
          <div className="relative p-6 space-y-3">
            <p className="text-zinc-400 text-sm mb-2">
              Choose the type of service this project belongs to. The form will adapt accordingly.
            </p>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleSelectCategory(cat.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group hover:scale-[1.01] ${cat.bg} ${cat.border}`}
              >
                <div className={`p-3 rounded-xl bg-black/20 ${cat.color}`}>
                  <cat.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-base ${cat.color}`}>{cat.label}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">{cat.description}</p>
                </div>
                <ChevronRight size={16} className={`${cat.color} opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1`} />
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 2: Project details form ── */}
        {step === 2 && selectedCategory && catConfig && (
          <form onSubmit={handleSubmit} className="relative p-6 space-y-4">

            {/* Back */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Back to categories
            </button>

            {/* Category badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${catConfig.bg} ${catConfig.color} ${catConfig.border}`}>
              <catConfig.icon size={12} />
              {catConfig.label} Project
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">
                Project Name <span className="text-orange-400">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={
                  selectedCategory === 'Web Design'
                    ? 'e.g. FreudeDev Landing Page'
                    : selectedCategory === 'Network Administration'
                    ? 'e.g. MTN Cameroon LAN Setup'
                    : 'e.g. Server Migration – Orange'
                }
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">
                Description <span className="text-orange-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder={
                  selectedCategory === 'Web Design'
                    ? 'Brief overview of the website design and goals...'
                    : selectedCategory === 'Network Administration'
                    ? 'Network topology, equipment used, scope of work...'
                    : 'IT issue resolved, systems affected, solution applied...'
                }
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none placeholder:text-zinc-600"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                <ImageIcon size={13} />
                {selectedCategory === 'Web Design' ? 'Website Screenshot URL' : 'Project Image URL'}
              </label>
              <div className="relative">
                <Upload size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/screenshot.jpg"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
              {form.image_url && (
                <div className="mt-1 rounded-xl overflow-hidden border border-zinc-800 h-28">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            {/* Web Design → Framer URL */}
            {selectedCategory === 'Web Design' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <Globe size={13} className="text-orange-400" />
                  Framer Project URL <span className="text-orange-400">*</span>
                </label>
                <input
                  name="framer_url"
                  value={form.framer_url}
                  onChange={handleChange}
                  required
                  placeholder="https://yourproject.framer.website"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600"
                />
                {form.framer_url && (
                  <a href={form.framer_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                    <ExternalLink size={11} /> Preview URL
                  </a>
                )}
                <p className="text-zinc-600 text-xs">Paste the published Framer URL — it will be linked on your portfolio.</p>
              </div>
            )}

            {/* Network Admin / IT → Document upload */}
            {selectedCategory !== 'Web Design' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <FileText size={13} className="text-blue-400" />
                  {selectedCategory === 'Network Administration' ? 'Network Report / Diagram' : 'IT Report / Documentation'}
                  <span className="text-zinc-500 text-xs font-normal ml-1">.doc .docx .xls .xlsx .pdf</span>
                </label>

                {form.document_url ? (
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-700 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-blue-400 shrink-0" />
                      <span className="text-sm truncate text-zinc-300">{form.document_name}</span>
                    </div>
                    <button type="button" onClick={() => setForm((p) => ({ ...p, document_url: '', document_name: '' }))} className="text-zinc-500 hover:text-red-400 transition-colors ml-2 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-6 bg-zinc-950 border border-dashed border-zinc-700 hover:border-orange-500/50 rounded-xl cursor-pointer transition-all group">
                    {uploading
                      ? <Loader2 size={20} className="animate-spin text-orange-400" />
                      : <Upload size={20} className="text-zinc-500 group-hover:text-orange-400 transition-colors" />
                    }
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {uploading ? 'Uploading...' : 'Click to upload document'}
                    </span>
                    <input type="file" accept=".doc,.docx,.xls,.xlsx,.pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                )}
                <p className="text-zinc-600 text-xs">
                  {selectedCategory === 'Network Administration'
                    ? 'Upload network diagrams, configuration reports, or topology documents.'
                    : 'Upload maintenance reports, IT audit documents, or technical specs.'}
                </p>
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
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-sm font-medium">
                Cancel
              </button>
              <button type="submit" disabled={loading || uploading}
                className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-600/20"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  : <><Plus size={16} /> Add Project</>
                }
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
  const hideNavbar = pathname === '/admin/login';
  const isProjectsPage = pathname === '/admin/projects';

  const [showAddProject, setShowAddProject] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Users },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Mail },
    { label: 'Newsletter', href: '/admin/newsletter', icon: Send },
  ];

  const handleLogout = async () => {
    try {
      await logoutAction();
      toast.success('Logged out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (hideNavbar) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200">
        {children}
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-200">

        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2 p-[10%]">
              <Image src={logo} alt="logo" className="w-35 h-20" />
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

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
            <h1 className="font-semibold text-lg">
              {menuItems.find((i) => i.href === pathname)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
              {isProjectsPage && (
                <button
                  onClick={() => setShowAddProject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
                >
                  <Plus size={16} />
                  Add Project
                </button>
              )}
              
            </div>
          </header>

          <div className="p-8">
            {children}
          </div>
        </main>
      </div>

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
