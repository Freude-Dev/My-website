"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Briefcase, 
  FolderKanban, 
  Mail, 
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { adminFetch } from './login/actions';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const result = await adminFetch('/stats');
      if (result.success) {
        setStats(result.data);
      }
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

  const cards = [
    { label: 'Total Services', value: stats?.services || 0, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Projects Done', value: stats?.projects || 0, icon: FolderKanban, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Testimonials', value: stats?.testimonials || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'New Inquiries', value: stats?.inquiries || 0, icon: Mail, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                +12%
              </div>
            </div>
            <h3 className="text-zinc-400 text-sm font-medium">{card.label}</h3>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl">Recent Performance</h2>
            <button className="text-sm text-orange-500 hover:underline flex items-center gap-1">
              View Report <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="h-64 flex items-end gap-4 px-4">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-orange-600/20 border-t-2 border-orange-600 rounded-t-lg transition-all duration-500 hover:bg-orange-600/40" 
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-left flex items-center justify-between group transition-all">
              <span className="font-medium">Add New Project</span>
              <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-left flex items-center justify-between group transition-all">
              <span className="font-medium">Update Service Prices</span>
              <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-left flex items-center justify-between group transition-all">
              <span className="font-medium">Manage Subscribers</span>
              <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}