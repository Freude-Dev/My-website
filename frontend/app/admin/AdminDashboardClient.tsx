"use client";

import React, { useState, useMemo } from 'react';
import {
  Users,
  FolderKanban,
  Mail,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  DollarSign,
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
  LineChart,
  Line,
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

interface Project {
  id: string;
  name: string;
  category: string;
  total_price: number;
  created_at: string;
}

interface Props {
  stats: Stats;
  recentInquiries: Inquiry[];
  recentNewsletter: Subscriber[];
  recentWaitlist: WaitlistEntry[];
  allProjects: Project[];
}

type RevenueFilter = 'daily' | 'weekly' | 'monthly';

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
    const key = new Date(item.created_at).toLocaleDateString('en-US', { weekday: 'short' });
    if (key in days) days[key]++;
  });
  return Object.entries(days).map(([day, count]) => ({ day, count }));
}

// Build revenue time series based on filter
function buildRevenueData(projects: Project[], filter: RevenueFilter) {
  const now = new Date();

  if (filter === 'daily') {
    // Last 7 days
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      days[key] = 0;
    }
    projects.forEach((p) => {
      const d = new Date(p.created_at);
      const daysDiff = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (daysDiff <= 6) {
        const key = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        if (key in days) days[key] += p.total_price || 0;
      }
    });
    return Object.entries(days).map(([label, revenue]) => ({ label, revenue }));
  }

  if (filter === 'weekly') {
    // Last 8 weeks
    const weeks: Record<string, number> = {};
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = `W${getWeekNumber(d)}`;
      weeks[key] = 0;
    }
    projects.forEach((p) => {
      const d = new Date(p.created_at);
      const weeksDiff = Math.floor((now.getTime() - d.getTime()) / (7 * 86400000));
      if (weeksDiff <= 7) {
        const key = `W${getWeekNumber(d)}`;
        if (key in weeks) weeks[key] += p.total_price || 0;
      }
    });
    return Object.entries(weeks).map(([label, revenue]) => ({ label, revenue }));
  }

  // monthly — last 6 months
  const months: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    months[key] = 0;
  }
  projects.forEach((p) => {
    const d = new Date(p.created_at);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (key in months) months[key] += p.total_price || 0;
  });
  return Object.entries(months).map(([label, revenue]) => ({ label, revenue }));
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-xs text-zinc-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name === 'revenue' || p.dataKey === 'revenue'
              ? `${Number(p.value).toLocaleString()} FCFA`
              : `${p.value} ${p.name}`
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboardClient({
  stats,
  recentInquiries,
  recentNewsletter,
  recentWaitlist,
  allProjects,
}: Props) {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'newsletter' | 'waitlist'>('inquiries');
  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>('monthly');

  const totalRevenue = allProjects.reduce((sum, p) => sum + (p.total_price || 0), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const monthlyRevenue = allProjects
    .filter((p) => new Date(p.created_at) >= startOfMonth)
    .reduce((sum, p) => sum + (p.total_price || 0), 0);

  const weeklyRevenue = allProjects
    .filter((p) => new Date(p.created_at) >= startOfWeek)
    .reduce((sum, p) => sum + (p.total_price || 0), 0);

  const dailyRevenue = allProjects
    .filter((p) => new Date(p.created_at) >= startOfDay)
    .reduce((sum, p) => sum + (p.total_price || 0), 0);

  // ── Chart data ──
  const revenueData = useMemo(
    () => buildRevenueData(allProjects, revenueFilter),
    [allProjects, revenueFilter]
  );

  const categoryData = useMemo(() => {
    const counts: Record<string, { count: number; revenue: number }> = {
      'Web Design':            { count: 0, revenue: 0 },
      'Network Administration':{ count: 0, revenue: 0 },
      'IT':                    { count: 0, revenue: 0 },
    };
    allProjects.forEach((p) => {
      if (counts[p.category]) {
        counts[p.category].count++;
        counts[p.category].revenue += p.total_price || 0;
      }
    });
    return [
      { name: 'Web Design',   ...counts['Web Design'],            color: '#f97316' },
      { name: 'Network Admin',...counts['Network Administration'], color: '#3b82f6' },
      { name: 'IT',           ...counts['IT'],                    color: '#a855f7' },
    ];
  }, [allProjects]);

  const inquiryTrend   = groupByDay(recentInquiries);
  const newsletterTrend = groupByDay(recentNewsletter);
  const waitlistTrend  = groupByDay(recentWaitlist);
  const combinedTrend  = inquiryTrend.map((d, i) => ({
    day: d.day,
    Inquiries: d.count,
    Newsletter: newsletterTrend[i]?.count || 0,
    Waitlist: waitlistTrend[i]?.count || 0,
  }));

  const cards = [
    { label: 'Projects Done',  value: stats.projects,     icon: FolderKanban, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'hover:border-orange-400/40', href: '/admin/projects' },
    { label: 'Testimonials',   value: stats.testimonials, icon: Users,        color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-400/40', href: '/admin/testimonials' },
    { label: 'New Inquiries',  value: stats.inquiries,    icon: Mail,         color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'hover:border-green-400/40',  href: '/admin/inquiries' },
  ];

  const tabData = { inquiries: recentInquiries, newsletter: recentNewsletter, waitlist: recentWaitlist };

  return (
    <div className="space-y-8">

      

      {/* ── REVENUE SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',   value: totalRevenue,   accent: '#f97316' },
          { label: 'This Month',      value: monthlyRevenue, accent: '#3b82f6' },
          { label: 'This Week',       value: weeklyRevenue,  accent: '#a855f7' },
          { label: 'Today',           value: dailyRevenue,   accent: '#4ade80' },
        ].map((item, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg" style={{ background: item.accent + '18' }}>
                <DollarSign size={16} style={{ color: item.accent }} />
              </div>
              <span className="text-zinc-500 text-xs font-medium">{item.label}</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-white">
              {item.value.toLocaleString()}
              <span className="text-xs font-mono ml-1" style={{ color: item.accent }}>FCFA</span>
            </p>
          </div>
        ))}
      </div>

      {/* ── REVENUE CHART + CATEGORY DONUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue over time */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg">Revenue Over Time</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Total earnings from completed projects</p>
            </div>
            {/* Filter buttons */}
            <div className="flex gap-1 bg-zinc-800 p-1 rounded-xl">
              {(['daily', 'weekly', 'monthly'] as RevenueFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setRevenueFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    revenueFilter === f
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {allProjects.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-zinc-600 text-sm">
              No project revenue data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ fill: '#f97316', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Projects by category donut */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="font-bold text-lg">By Category</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Projects & revenue breakdown</p>
          </div>

          {allProjects.length === 0 ? (
            <div className="flex items-center justify-center h-36 text-zinc-600 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 shadow-xl">
                          <p className="text-xs font-bold" style={{ color: d.color }}>{d.name}</p>
                          <p className="text-xs text-zinc-300">{d.count} project{d.count !== 1 ? 's' : ''}</p>
                          <p className="text-xs text-zinc-400">{d.revenue.toLocaleString()} FCFA</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          <div className="space-y-2.5 mt-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-zinc-400">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.count}p</span>
                  <span className="text-[10px] text-zinc-600 ml-2">{item.revenue.toLocaleString()} F</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACTIVITY CHART ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg">Activity Overview</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Last 7 days across all channels</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-full">
              <TrendingUp size={12} /> This week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
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
              <Area type="monotone" dataKey="Inquiries"  stroke="#4ade80" strokeWidth={2} fill="url(#gradInquiries)"  dot={false} />
              <Area type="monotone" dataKey="Newsletter" stroke="#60a5fa" strokeWidth={2} fill="url(#gradNewsletter)" dot={false} />
              <Area type="monotone" dataKey="Waitlist"   stroke="#a78bfa" strokeWidth={2} fill="url(#gradWaitlist)"   dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 justify-center">
            {[{ label: 'Inquiries', color: '#4ade80' }, { label: 'Newsletter', color: '#60a5fa' }, { label: 'Waitlist', color: '#a78bfa' }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-zinc-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submissions bar chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="font-bold text-lg">Submissions</h2>
            <p className="text-zinc-500 text-xs mt-0.5">By day this week</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={combinedTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={6} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Inquiries"  fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Newsletter" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Waitlist"   fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recent Activity Tabs ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Recent Activity</h2>
          <Link href={`/admin/${activeTab}`} className="text-xs text-orange-500 hover:underline flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          {(['inquiries', 'newsletter', 'waitlist'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}>
              {tab} ({tabData[tab].length})
            </button>
          ))}
        </div>

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
                    <Clock size={10} />{timeAgo(item.created_at)}
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
                    <Clock size={10} />{timeAgo(item.created_at)}
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
                    <Clock size={10} />{timeAgo(item.created_at)}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link href={card.href} key={i}>
            <div className={`bg-zinc-900 border border-zinc-800 ${card.border} p-6 rounded-2xl transition-all cursor-pointer group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <card.icon size={22} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  <Activity size={10} /> Live
                </div>
              </div>
              <h3 className="text-zinc-400 text-sm font-medium">{card.label}</h3>
              <p className={`text-3xl font-bold mt-1 transition-colors ${card.color}`}>{card.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}