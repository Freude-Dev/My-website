"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Plus, FolderKanban, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetch } from '../login/actions';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear().toString(),
    category: 'Web Design',
    image: '',
    description: ''
  });

  const fetchProjects = async () => {
    const result = await adminFetch('/projects/all');
    if (result.success) {
      setProjects(result.data);
    } else {
      toast.error('Failed to load projects');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving project...');
    
    try {
      const res = await adminFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        toast.success('Project added successfully!', { id: loadingToast });
        setShowAddModal(false);
        setFormData({ name: '', year: '2025', category: 'Web Design', image: '', description: '' });
        fetchProjects();
      } else {
        toast.error('Failed to save project', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const loadingToast = toast.loading('Deleting project...');
    
    try {
      const res = await adminFetch(`/projects/${id}`, { method: 'DELETE' });
      if (res.success) {
        toast.success('Project deleted', { id: loadingToast });
        fetchProjects();
      } else {
        toast.error('Failed to delete project', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Portfolio</h2>
          <p className="text-zinc-400 text-sm">Manage the projects displayed on your portfolio page.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn bg-orange-600 hover:bg-orange-700 text-white border-none"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-orange-500/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2">
                <div className="badge badge-orange-600 font-bold">{project.year}</div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{project.category}</span>
                <button onClick={() => handleDelete(project._id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="font-bold text-lg mb-1">{project.name}</h3>
              <p className="text-zinc-400 text-sm line-clamp-2">{project.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Add New Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label text-xs font-bold text-zinc-500 uppercase">Project Name</label>
                <input 
                  type="text" 
                  required
                  className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Year</label>
                  <input 
                    type="text" 
                    required
                    className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-bold text-zinc-500 uppercase">Category</label>
                  <select 
                    className="select bg-zinc-800 border-zinc-700 focus:border-orange-500"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Web Design</option>
                    <option>IT Maintenance</option>
                    <option>Networking</option>
                    <option>Branding</option>
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold text-zinc-500 uppercase">Image URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="input bg-zinc-800 border-zinc-700 focus:border-orange-500"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold text-zinc-500 uppercase">Description</label>
                <textarea 
                  required
                  className="textarea bg-zinc-800 border-zinc-700 focus:border-orange-500 h-24"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn bg-orange-600 hover:bg-orange-700 text-white border-none flex-1">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}