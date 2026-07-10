import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Luxury Console | Admin Dashboard',
  description: 'Control panel for your portfolio content and communication logs.',
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.isAdmin) {
    redirect('/admin/login');
  }

  return <DashboardClient />;
}
