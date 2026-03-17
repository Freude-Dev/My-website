"use client";

import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  FolderKanban,
  Mail,
  Send,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stats {
  projects: number;
  testimonials: number;
  inquiries: number;
}

interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Props {
  stats: Stats;
  recentInquiries: Inquiry[];
  recentNewsletter: Subscriber[];
  recentWaitlist: WaitlistEntry[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

// Group entries by day for the last 7 days
function groupByDay(items: { created_at: string }[]) {
  const days: Record<string, number> = {};
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    days[key] = 0;
  }

  items.forEach((item) => {
    const d = new Date(item.created_at);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (key in days) days[key]++;
  });

  return Object.entries(days).map(([day, count]) => ({ day, count }));
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-xs text-zinc-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.value} {p.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


export default function AdminDashboardClient({
  stats,
  recentInquiries,
  recentNewsletter,
  recentWaitlist,
}: Props) {

  const [activeTab, setActiveTab] = useState<'inquiries' | 'newsletter' | 'waitlist'>('inquiries');

  // Chart data
  const inquiryTrend = groupByDay(recentInquiries);
  const newsletterTrend = groupByDay(recentNewsletter);
  const waitlistTrend = groupByDay(recentWaitlist);

  const combinedTrend = inquiryTrend.map((d, i) => ({
    day: d.day,
    Inquiries: d.count,
    Newsletter: newsletterTrend[i]?.count || 0,
    Waitlist: waitlistTrend[i]?.count || 0,
  }));

  const pieData = [
    { name: 'Projects', value: stats.projects || 1, color: '#f97316' },
    { name: 'Testimonials', value: stats.testimonials || 1, color: '#a78bfa' },
    { name: 'Inquiries', value: stats.inquiries || 1, color: '#4ade80' },
  ];

  const cards = [
    { label: 'Projects Done', value: stats.projects, icon: FolderKanban, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'hover:border-orange-400/40', href: '/admin/projects' },
    { label: 'Testimonials', value: stats.testimonials, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-400/40', href: '/admin/testimonials' },
    { label: 'New Inquiries', value: stats.inquiries, icon: Mail, color: 'text-green-400', bg: 'bg-green-400/10', border: 'hover:border-green-400/40', href: '/admin/inquiries' },
  ];

  const tabData = {
    inquiries: recentInquiries,
    newsletter: recentNewsletter,
    waitlist: recentWaitlist,
  };

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link href={card.href} key={i}>
            <div className={`bg-zinc-900 border border-zinc-800 ${card.border} p-6 rounded-2xl transition-all cursor-pointer group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <card.icon size={22} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  <Activity size={10} />
                  Live
                </div>
              </div>
              <h3 className="text-zinc-400 text-sm font-medium">{card.label}</h3>
              <p className={`text-3xl font-bold mt-1 transition-colors ${card.color}`}>
                {card.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart — Activity over 7 days */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg">Activity Overview</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Last 7 days across all channels</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-full">
              <TrendingUp size={12} />
              This week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={combinedTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradInquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNewsletter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradWaitlist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Inquiries" stroke="#4ade80" strokeWidth={2} fill="url(#gradInquiries)" dot={false} />
              <Area type="monotone" dataKey="Newsletter" stroke="#60a5fa" strokeWidth={2} fill="url(#gradNewsletter)" dot={false} />
              <Area type="monotone" dataKey="Waitlist" stroke="#a78bfa" strokeWidth={2} fill="url(#gradWaitlist)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 justify-center">
            {[
              { label: 'Inquiries', color: '#4ade80' },
              { label: 'Newsletter', color: '#60a5fa' },
              { label: 'Waitlist', color: '#a78bfa' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-zinc-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart — Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="font-bold text-lg">Distribution</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Content breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-zinc-400">{item.name}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-lg">Submissions by Day</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Grouped bar chart for the last 7 days</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={combinedTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={8} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Inquiries" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Newsletter" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Waitlist" fill="#a78bfa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Recent Activity Tabs ─────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Recent Activity</h2>
          <Link
            href={`/admin/${activeTab}`}
            className="text-xs text-orange-500 hover:underline flex items-center gap-1"
          >
            View all <ChevronRight size={12} />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['inquiries', 'newsletter', 'waitlist'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab} ({tabData[tab].length})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-3">
          {activeTab === 'inquiries' && (
            recentInquiries.length === 0
              ? <p className="text-zinc-500 text-sm text-center py-8">No inquiries yet</p>
              : recentInquiries.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-all">
                  <div className="size-9 rounded-full bg-green-400/20 flex items-center justify-center shrink-0 text-green-400 text-sm font-bold">
                    {item.first_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.first_name} {item.last_name}</p>
                    <p className="text-xs text-zinc-500">{item.email}</p>
                    <p className="text-xs text-zinc-600 mt-1 line-clamp-1">{item.message}</p>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-600 text-xs shrink-0">
                    <Clock size={10} />
                    {timeAgo(item.created_at)}
                  </div>
                </div>
              ))
          )}

          {activeTab === 'newsletter' && (
            recentNewsletter.length === 0
              ? <p className="text-zinc-500 text-sm text-center py-8">No subscribers yet</p>
              : recentNewsletter.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-blue-400/20 flex items-center justify-center shrink-0 text-blue-400 text-sm font-bold">
                      {item.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.email}</p>
                      <p className="text-xs text-zinc-500">Newsletter subscriber</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-600 text-xs">
                    <Clock size={10} />
                    {timeAgo(item.created_at)}
                  </div>
                </div>
              ))
          )}

          {activeTab === 'waitlist' && (
            recentWaitlist.length === 0
              ? <p className="text-zinc-500 text-sm text-center py-8">No waitlist entries yet</p>
              : recentWaitlist.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-purple-400/20 flex items-center justify-center shrink-0 text-purple-400 text-sm font-bold">
                      {item.name?.[0]?.toUpperCase() || item.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.name || 'Anonymous'}</p>
                      <p className="text-xs text-zinc-500">{item.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-600 text-xs">
                    <Clock size={10} />
                    {timeAgo(item.created_at)}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

    </div>
  );
}
