"use client";

import React, { useEffect, useState } from 'react';
import {
  Trash2,
  FolderKanban,
  ExternalLink,
  FileText,
  Globe,
  Network,
  Monitor,
  Eye,
  X,
  Upload,
  Loader2,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';


type Category = 'Web Design' | 'Network Administration' | 'IT';

interface Project {
  id: string;
  name: string;
  description: string;
  image_url: string;
  year: number;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  category: Category;
  framer_url?: string;
  document_url?: string;
  document_name?: string;
}

const CATEGORIES: { value: Category; label: string; color: string; bg: string; icon: React.ElementType }[] = [
  { value: 'Web Design', label: 'Web Design', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', icon: Globe },
  { value: 'Network Administration', label: 'Network Admin', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', icon: Network },
  { value: 'IT', label: 'IT', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', icon: Monitor },
];

function getCategoryConfig(cat: Category) {
  return CATEGORIES.find((c) => c.value === cat) || CATEGORIES[0];
}

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  existing?: Project | null;
}

function ProjectModal({ onClose, onSuccess, existing }: ModalProps) {
  const isEdit = !!existing;

  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    image_url: existing?.image_url || '',
    year: existing?.year || new Date().getFullYear(),
    display_order: existing?.display_order || 0,
    is_visible: existing?.is_visible ?? true,
    category: (existing?.category || 'Web Design') as Category,
    framer_url: existing?.framer_url || '',
    document_url: existing?.document_url || '',
    document_name: existing?.document_name || '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'year' || name === 'display_order'
          ? Number(value)
          : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const officeMimes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
    ];
    const isOffice = officeMimes.includes(file.type);
    const isNetworkUnl =
      form.category === 'Network Administration' &&
      file.name.toLowerCase().endsWith('.unl');

    // Allow PDF files for Network Administration category
    const isPdf = file.type === 'application/pdf' && file.name.toLowerCase().endsWith('.pdf');

    if (!isOffice && !isNetworkUnl && !isPdf) {
      toast.error(
        form.category === 'Network Administration'
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
      toast.success('Document uploaded!');
    }
    setUploading(false);
  };

  // Upload image to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only .jpg, .jpeg, .png, .gif, .webp files are allowed');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageUploading(true);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file);

    if (error) {
      toast.error('Image upload failed: ' + error.message);
    } else {
      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(data.path);

      setForm((prev) => ({
        ...prev,
        image_url: urlData.publicUrl,
      }));
      toast.success('Image uploaded!');
    }
    setImageUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      image_url: form.image_url,
      year: form.year,
      display_order: form.display_order,
      is_visible: form.is_visible,
      category: form.category,
      framer_url: form.category === 'Web Design' ? form.framer_url : null,
      document_url: form.category !== 'Web Design' ? form.document_url : null,
      document_name: form.category !== 'Web Design' ? form.document_name : null,
    };

    const { error } = isEdit
      ? await supabase.from('projects').update(payload).eq('id', existing!.id)
      : await supabase.from('projects').insert([{ ...payload }]);

    if (error) {
      toast.error('Failed: ' + error.message);
    } else {
      toast.success(isEdit ? 'Project updated! ✏️' : 'Project added! 🎉');
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  const catConfig = getCategoryConfig(form.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl my-4">
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-xl">
              <FolderKanban size={20} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
              <p className="text-zinc-500 text-xs">Fill in the project details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative p-6 space-y-4">

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Category <span className="text-orange-400">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, category: cat.value }))}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    form.category === cat.value
                      ? `${cat.bg} ${cat.color} border-current`
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Project Name <span className="text-orange-400">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. FreudeDev Website Redesign"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Description <span className="text-orange-400">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Brief description of the project..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
              <ImageIcon size={13} /> Thumbnail Image
            </label>
            
            <div className="space-y-2">
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="Or enter image URL directly..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-2">
              <label className="flex flex-col items-center justify-center gap-2 p-4 bg-zinc-950 border border-dashed border-zinc-700 hover:border-orange-500/50 rounded-xl cursor-pointer transition-all group">
                {imageUploading ? (
                  <Loader2 size={20} className="animate-spin text-orange-400" />
                ) : (
                  <Upload size={20} className="text-zinc-500 group-hover:text-orange-400 transition-colors" />
                )}
                <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors text-center">
                  {imageUploading ? 'Uploading image...' : 'Click to upload image\n.jpg, .jpeg, .png, .gif, .webp (max 5MB)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                />
              </label>
            </div>

            {form.image_url && (
              <div className="space-y-2">
                <div className="rounded-xl overflow-hidden border border-zinc-800 h-32">
                  <img 
                    src={form.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      toast.error('Failed to load image preview');
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, image_url: '' }))}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          {form.category === 'Web Design' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                <Globe size={13} className="text-orange-400" /> Framer Project URL <span className="text-orange-400">*</span>
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
                <a
                  href={form.framer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline mt-1"
                >
                  <ExternalLink size={11} /> Preview URL
                </a>
              )}
            </div>
          )}

          {form.category !== 'Web Design' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                <FileText size={13} className="text-blue-400" /> Project Document
                <span className="text-zinc-500 text-xs font-normal">
                  {form.category === 'Network Administration'
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
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, document_url: '', document_name: '' }))}
                    className="text-zinc-500 hover:text-red-400 transition-colors ml-2 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 bg-zinc-950 border border-dashed border-zinc-700 hover:border-orange-500/50 rounded-xl cursor-pointer transition-all group">
                  {uploading ? (
                    <Loader2 size={20} className="animate-spin text-orange-400" />
                  ) : (
                    <Upload size={20} className="text-zinc-500 group-hover:text-orange-400 transition-colors" />
                  )}
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {uploading ? 'Uploading...' : 'Click to upload document'}
                  </span>
                  <input
                    type="file"
                    accept={
                      form.category === 'Network Administration'
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

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Year <span className="text-orange-400">*</span></label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                min={2000}
                max={2100}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-3 py-3 text-sm outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Order</label>
              <input
                name="display_order"
                type="number"
                value={form.display_order}
                onChange={handleChange}
                min={0}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-3 py-3 text-sm outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Visible</label>
              <div className="h-[46px] flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_visible"
                    checked={form.is_visible}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.is_visible ? 'bg-orange-600' : 'bg-zinc-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-4 w-4 shadow transition-transform ${form.is_visible ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || imageUploading}
              className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-600/20"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                isEdit ? '✏️ Update Project' : '🎉 Add Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [filterCat, setFilterCat] = useState<Category | 'All'>('All');

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false })
      .order('display_order');

    if (error) {
      toast.error('Failed to load projects');
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const t = toast.loading('Deleting...');
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete', { id: t });
    } else {
      toast.success('Deleted', { id: t });
      fetchProjects();
    }
  };

  const handleToggleVisible = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_visible: !project.is_visible })
      .eq('id', project.id);
    if (!error) fetchProjects();
  };

  const filtered = filterCat === 'All' ? projects : projects.filter((p) => p.category === filterCat);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="animate-spin text-orange-500" />
        <p className="text-zinc-500 text-sm">Loading projects...</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Project Portfolio</h2>
            <p className="text-zinc-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''} across {CATEGORIES.length} categories
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['All', ...CATEGORIES.map((c) => c.value)] as const).map((cat) => {
            const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length;
            const config = cat !== 'All' ? getCategoryConfig(cat as Category) : null;
            return (
              <button
                key={cat}
                onClick={() => setFilterCat(cat as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  filterCat === cat
                    ? config
                      ? `${config.bg} ${config.color} border-current`
                      : 'bg-zinc-200 text-zinc-900 border-zinc-200'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {config && <config.icon size={12} />}
                {cat}
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl text-center py-16 text-zinc-500">
              <FolderKanban size={32} className="mx-auto mb-3 opacity-30" />
              <p>No projects found</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 text-orange-500 hover:underline text-sm"
              >
                Add your first project →
              </button>
            </div>
          ) : (
            filtered.map((project) => {
              const config = getCategoryConfig(project.category);
              return (
                <div
                  key={project.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
                >
                  {/* Top row: image + name + actions */}
                  <div className="flex items-start gap-3">
                    <div className="size-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={16} className="text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{project.name}</p>
                      <p className="text-zinc-500 text-xs truncate mt-0.5">{project.description}</p>
                    </div>
                    {/* Action buttons always visible on mobile */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => { setEditProject(project); setShowModal(true); }}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
                        title="Edit"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom row: category + year + link + toggle */}
                  <div className="flex items-center gap-2 flex-wrap border-t border-zinc-800 pt-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.color}`}>
                      <config.icon size={10} />
                      {config.label}
                    </span>
                    <span className="text-zinc-400 font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-800">
                      {project.year}
                    </span>
                    {project.category === 'Web Design' && project.framer_url ? (
                      <a
                        href={project.framer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20"
                      >
                        <Globe size={10} /> View Site <ExternalLink size={9} />
                      </a>
                    ) : project.document_url ? (
                      <a
                        href={project.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20 max-w-[140px]"
                      >
                        <FileText size={10} className="shrink-0" />
                        <span className="truncate">{project.document_name || 'Document'}</span>
                      </a>
                    ) : null}
                    {/* Visibility toggle */}
                    <button
                      onClick={() => handleToggleVisible(project)}
                      className="relative inline-flex items-center cursor-pointer ml-auto"
                      title={project.is_visible ? 'Click to hide' : 'Click to show'}
                    >
                      <div className={`w-9 h-5 rounded-full transition-colors ${project.is_visible ? 'bg-orange-600' : 'bg-zinc-700'}`}>
                        <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-4 w-4 shadow transition-transform ${project.is_visible ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })
          )}
          {filtered.length > 0 && (
            <p className="text-zinc-600 text-xs text-center pt-1">
              Showing {filtered.length} of {projects.length} projects
            </p>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50">
                  <th className="text-left px-5 py-4 text-zinc-400 font-semibold text-xs uppercase tracking-wider">Project</th>
                  <th className="text-left px-5 py-4 text-zinc-400 font-semibold text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-4 text-zinc-400 font-semibold text-xs uppercase tracking-wider">Year</th>
                  <th className="text-left px-5 py-4 text-zinc-400 font-semibold text-xs uppercase tracking-wider">Link / Doc</th>
                  <th className="text-left px-5 py-4 text-zinc-400 font-semibold text-xs uppercase tracking-wider">Visible</th>
                  <th className="text-right px-5 py-4 text-zinc-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-zinc-500">
                      <FolderKanban size={32} className="mx-auto mb-3 opacity-30" />
                      <p>No projects found</p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-3 text-orange-500 hover:underline text-sm"
                      >
                        Add your first project →
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((project) => {
                    const config = getCategoryConfig(project.category);
                    return (
                      <tr key={project.id} className="hover:bg-zinc-800/40 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                              {project.image_url ? (
                                <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={16} className="text-zinc-600" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate max-w-[180px]">{project.name}</p>
                              <p className="text-zinc-500 text-xs truncate max-w-[180px] mt-0.5">{project.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.bg} ${config.color}`}>
                            <config.icon size={11} />
                            {config.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-zinc-300 font-mono font-bold">{project.year}</span>
                        </td>
                        <td className="px-5 py-4">
                          {project.category === 'Web Design' && project.framer_url ? (
                            <a href={project.framer_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20 hover:bg-orange-400/20 transition-all">
                              <Globe size={11} /> View Site <ExternalLink size={10} />
                            </a>
                          ) : project.document_url ? (
                            <a href={project.document_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20 hover:bg-blue-400/20 transition-all max-w-[160px]">
                              <FileText size={11} className="shrink-0" />
                              <span className="truncate">{project.document_name || 'Document'}</span>
                            </a>
                          ) : (
                            <span className="text-zinc-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggleVisible(project)}
                            className="relative inline-flex items-center cursor-pointer"
                            title={project.is_visible ? 'Click to hide' : 'Click to show'}>
                            <div className={`w-9 h-5 rounded-full transition-colors ${project.is_visible ? 'bg-orange-600' : 'bg-zinc-700'}`}>
                              <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-4 w-4 shadow transition-transform ${project.is_visible ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditProject(project); setShowModal(true); }}
                              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all" title="Edit">
                              <Eye size={15} />
                            </button>
                            <button onClick={() => handleDelete(project.id)}
                              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/30 flex items-center justify-between">
              <p className="text-zinc-500 text-xs">Showing {filtered.length} of {projects.length} projects</p>
              <p className="text-zinc-600 text-xs">Hover a row to see actions</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProjectModal
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSuccess={fetchProjects}
          existing={editProject}
        />
      )}
    </>
  );
}