// Server component
import { adminFetch } from './login/actions';
import AdminDashboardClient from './AdminDashboardClient';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

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
  ] = await Promise.all([
    supabase.from('services').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('newsletter').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('waitlist').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <>

      <AdminDashboardClient
        stats={{
          projects: projectsCount || 0,
          testimonials: testimonialsCount || 0,
          inquiries: inquiriesCount || 0,
        }}
        recentInquiries={recentInquiries || []}
        recentNewsletter={recentNewsletter || []}
        recentWaitlist={recentWaitlist || []}
      />
    </>
  )
}