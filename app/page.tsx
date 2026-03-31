"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { login } from "@/lib/auth";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";   // Make sure lucide-react is installed

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [authTab, setAuthTab] = useState<"email" | "mobile">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleSocialLogin = async (provider: string) => {
    setIsSubmitting(true);
    setError("");
    try {
      if (provider === "google") {
        await login();
      } else {
        toast.info(`${provider} login coming soon`);
        return;
      }
      toast.success("Signed in successfully");
    } catch (err: any) {
      const msg = err.message || `${provider} sign-in failed`;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.error(msg);
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast.success(mode === "signup" ? "Account created" : "Signed in");
    } catch (err: any) {
      const msg = err.message || "Authentication failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMobileAuth = () => {
    toast.info("Mobile number + OTP sign-in coming soon");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[370px]">
        <Card className="border border-slate-200 shadow-xl rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-8">
            {/* Logo + Headline */}
            <div className="text-center mb-9">
              <div className="mx-auto mb-5 flex justify-center">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-emerald-600"
                >
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6.5" />
                  <path
                    d="M20 32 L28 40 L44 24"
                    stroke="currentColor"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
                Win your day
              </h1>
              <p className="text-sm text-slate-600">
                {mode === "signup"
                  ? "Create your account to start winning"
                  : "Sign in to continue your streak"}
              </p>
            </div>

            {/* Email / Mobile Tabs */}
            <div className="flex border-b border-slate-200 mb-8">
              <button
                onClick={() => setAuthTab("email")}
                className={`flex-1 pb-3 text-sm font-medium transition-all cursor-pointer ${
                  authTab === "email"
                    ? "border-b-2 border-emerald-600 text-emerald-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setAuthTab("mobile")}
                className={`flex-1 pb-3 text-sm font-medium transition-all cursor-pointer ${
                  authTab === "mobile"
                    ? "border-b-2 border-emerald-600 text-emerald-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Mobile Number
              </button>
            </div>

            {/* Main Form - Slightly More Spacious */}
            {authTab === "email" ? (
              <form onSubmit={handleEmailAuth} className="space-y-6">
                <div>
                  <Label className="text-xs font-medium text-slate-600">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="mt-1.5 h-11 text-sm rounded-2xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="relative">
                  <Label className="text-xs font-medium text-slate-600">Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mt-1.5 h-11 text-sm rounded-2xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[34px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {mode === "signup" && (
                  <div className="relative">
                    <Label className="text-xs font-medium text-slate-600">Confirm Password</Label>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="mt-1.5 h-11 text-sm rounded-2xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-[34px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-red-600 text-xs bg-red-50 p-3 rounded-2xl text-center font-medium">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-sm shadow-sm transition-all active:scale-[0.985] cursor-pointer"
                >
                  {isSubmitting
                    ? "Processing..."
                    : mode === "signup"
                    ? "Create account"
                    : "Sign in"}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="text-xs font-medium text-slate-600">Mobile Number</Label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="mt-1.5 h-11 text-sm rounded-2xl border-slate-200 focus:border-emerald-500"
                  />
                </div>

                <Button
                  onClick={handleMobileAuth}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-sm transition-all active:scale-[0.985] cursor-pointer"
                >
                  Send OTP
                </Button>
              </div>
            )}

            {/* Toggle Link */}
            <div className="text-center mt-8 text-sm text-slate-500">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signin");
                      setError("");
                    }}
                    className="text-emerald-600 font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setError("");
                    }}
                    className="text-emerald-600 font-semibold hover:underline cursor-pointer"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>

            {/* Other Login Methods */}
            <div className="mt-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-400 font-medium">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <Button
                  onClick={() => handleSocialLogin("google")}
                  disabled={isSubmitting}
                  variant="outline"
                  title="Continue with Google"   // Tooltip
                  className="h-10 border border-slate-300 hover:bg-slate-50 rounded-2xl flex items-center justify-center hover:border-slate-400 transition-all cursor-pointer"
                >
                  <img
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google"
                    className="w-4 h-4"
                  />
                </Button>

                <Button
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isSubmitting}
                  variant="outline"
                  title="Continue with Facebook"
                  className="h-10 border border-slate-300 hover:bg-slate-50 rounded-2xl flex items-center justify-center text-[#1877F2] text-xl font-bold hover:border-slate-400 transition-all cursor-pointer"
                >
                  f
                </Button>

                <Button
                  onClick={() => handleSocialLogin("github")}
                  disabled={isSubmitting}
                  variant="outline"
                  title="Continue with GitHub"
                  className="h-10 border border-slate-300 hover:bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 text-base font-medium hover:border-slate-400 transition-all cursor-pointer"
                >
                  GitHub
                </Button>

                <Button
                  onClick={() => handleSocialLogin("microsoft")}
                  disabled={isSubmitting}
                  variant="outline"
                  title="Continue with Microsoft"
                  className="h-10 border border-slate-300 hover:bg-slate-50 rounded-2xl flex items-center justify-center text-[#00A4EF] font-bold text-xl hover:border-slate-400 transition-all cursor-pointer"
                >
                  M
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
