"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, Clock } from "lucide-react"; // Thêm icon Clock
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Dùng Alert để báo chờ duyệt

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null); // State thông báo chờ duyệt

  const { login, token, user } = useAuth();
  const { t } = useLanguage();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem("token") : null;
    if (token || storedToken) {
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      router.replace(storedUser.role === 'admin' ? "/admin" : "/");
    } else {
      setIsCheckingAuth(false);
    }
  }, [token, router]);

  const formSchema = useMemo(() => z.object({
    username: z.string().min(1, { message: t.usernameRequired }),
    password: z.string().min(1, { message: t.passwordRequired }),
  }), [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPendingMessage(null); // Reset thông báo cũ
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        // Nếu là lỗi 403 (Chưa duyệt)
        if (response.status === 403) {
          setPendingMessage(data.error || "Tài khoản của bạn đang chờ quản trị viên phê duyệt.");
          return;
        }
        throw new Error(data.error || "Sai thông tin đăng nhập");
      }

      login(data.username, data.role || 'user', data.token);
      toast({ title: t.toastSuccess, description: t.loginSuccess });
      router.push(data.role === 'admin' ? '/admin' : '/');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Lỗi đăng nhập",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingAuth) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header onLogoClick={() => router.push('/')} />
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t.login}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* HIỂN THỊ THÔNG BÁO CHỜ DUYỆT NẾU CÓ */}
            {pendingMessage && (
              <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <Clock className="h-4 w-4 text-amber-600" />
                <AlertTitle>Thông báo</AlertTitle>
                <AlertDescription>{pendingMessage}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.username}</FormLabel>
                      <FormControl><Input placeholder={t.yourUsername} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.password}</FormLabel>
                      <FormControl><Input type="password" placeholder={t.passwordPlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng nhập...</> : t.login}
                </Button>
              </form>
            </Form>
            <p className="text-center text-sm text-muted-foreground">
              {t.dontHaveAccount}{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">{t.register}</Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}