// Remove "use client" — make it a server component
import { adminFetch } from './login/actions';
import AdminOverviewClient from './AdminOverviewClient';

interface AdminOverviewClientProps {
  stats: any;
}

export default async function AdminOverview() {
  const result = await adminFetch('/stats');
  const stats = result.success ? result.data : null;

  return <AdminOverviewClient stats={stats} />;
}