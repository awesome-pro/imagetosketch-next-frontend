import Link from "next/link";

export default function Home() {
  return (
    <main>
      This is the home page
      <Link href="/auth/sign-in">Sign In</Link>
      <Link href="/auth/sign-up">Sign Up</Link>
      <Link href="/dashboard">Dashboard</Link>
    </main>
  );
}
