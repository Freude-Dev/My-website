"use client";
import React from 'react';
import Link from 'next/link';
import logo from '../../public/icons/logo-desktop.png';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FolderKanban, 
  Mail, 
  Send, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { logoutAction } from './login/actions';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideNavbar = pathname === '/admin/login';

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Users },
    { label: 'Services', href: '/admin/services', icon: Briefcase },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
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

  // Clean full-screen layout for login page — no sidebar, no header
  if (hideNavbar) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200">
        {children}
      </div>
    );
  }

  // Full admin layout with sidebar and header
  return (
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
            <div className="size-8 rounded-full bg-orange-600 flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}