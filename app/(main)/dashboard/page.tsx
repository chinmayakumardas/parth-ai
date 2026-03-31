"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logout } from "@/lib/auth";

import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1>Dashboard</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}