// Server component
import { adminFetch } from './login/actions';
import AdminDashboardClient from './AdminDashboardClient';
import { supabase } from '../../lib/supabase';

export default async function AdminOverview() {
  const result = await adminFetch('/stats');
  const stats = result.success ? result.data : null;

  const [
    { count: servicesCount },
    { count: projectsCount },
    { count: testimonialsCount },
    { count: inquiriesCount },
    { data: recentInquiries },
    { data: recentNewsletter },
    { data: recentWaitlist },
    // FIX: fetch projects with revenue data for charts
    { data: allProjects },
  ] = await Promise.all([
    supabase.from('services').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('newsletter').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('waitlist').select('*').order('created_at', { ascending: false }).limit(5),
    // Fetch all projects with revenue fields for charts
    supabase.from('projects').select('id, name, category, total_price, created_at').order('created_at', { ascending: true }),
  ])

  return (
    <AdminDashboardClient
      stats={{
        projects: projectsCount || 0,
        testimonials: testimonialsCount || 0,
        inquiries: inquiriesCount || 0,
      }}
      recentInquiries={recentInquiries || []}
      recentNewsletter={recentNewsletter || []}
      recentWaitlist={recentWaitlist || []}
      allProjects={allProjects || []}
    />
  )
}