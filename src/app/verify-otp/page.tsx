"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText || "Xác thực thất bại");
      toast({ title: "Thành công!", description: "Xác thực email thành công. Vui lòng chờ admin duyệt tài khoản." });
      router.push("/login");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi xác thực", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header onLogoClick={() => router.push("/")} />
      <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Xác thực Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Nhập email đã đăng ký" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Mã OTP</label>
                <Input value={otp} onChange={e => setOtp(e.target.value)} required placeholder="Nhập mã OTP" />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xác thực..." : "Xác thực"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
