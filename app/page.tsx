"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { login } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"signup" | "signin">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/dashboard");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back 🚀");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created 🎉");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      await login();
      toast.success("Signed in with Google 🚀");
    } catch {
      toast.error("Google login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 relative bg-muted">
       <img
          src="/placeholder.svg"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative p-12 flex flex-col justify-end">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            Parth AI
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm">
            Your personal AI system to stay focused, disciplined and win every day.
          </p>
        </div>
      </div>
 
      {/* RIGHT PANEL */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-7">

          {/* SWITCH */}
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-lg text-sm transition ${
                mode === "signin"
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm transition ${
                mode === "signup"
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* HEADER */}
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Login to continue your journey"
                : "Start building your life system"}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleAuth} className="space-y-4">

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              required
            />

            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 transition rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* GOOGLE */}
          <Button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting}
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-3 rounded-xl"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <img
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </Button>

        </div>
      </div>
    </div>
  );
}