import { redirect } from 'next/navigation';

// The draw runs only from the booth iPad (admin). Old customer links land there.
export default function DrawPage() {
  redirect('/draw/admin');
}
