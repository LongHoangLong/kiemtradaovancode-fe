"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, KeyRound } from "lucide-react";

export default function ChangePasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { token, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
        newPassword: z.string().min(6, "Mật khẩu mới phải từ 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            toast({ title: "Thành công", description: "Đã đổi mật khẩu. Vui lòng đăng nhập lại." });

            // Đổi mật khẩu xong nên bắt đăng nhập lại cho an toàn
            setTimeout(() => logout(), 2000);

        } catch (error: any) {
            toast({ variant: "destructive", title: "Lỗi", description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header onLogoClick={() => router.push('/')} />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <KeyRound className="h-6 w-6 text-primary" /> Đổi mật khẩu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="oldPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="newPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu mới</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Cập nhật mật khẩu"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}