import { redirect } from 'next/navigation';

export default function AdminCascaron() {
  // Si alguien intenta entrar a /admin por error, lo mandamos al /hub que es el real
  redirect('/hub');
}