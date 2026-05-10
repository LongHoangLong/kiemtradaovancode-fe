"use client";

import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Code2, User, Settings, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header({ onLogoClick }: { onLogoClick: () => void }) {
  const { t } = useLanguage();
  // Lấy thêm isAdmin từ AuthContext để phân quyền hiển thị
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 bg-transparent border-none p-0 cursor-pointer text-left hover:opacity-80 transition-opacity"
        >
          <Code2 className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {t.appName}
          </h1>
        </button>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground uppercase mt-1 font-semibold">
                      {isAdmin ? "Quản trị viên" : "Người dùng"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* MỤC DÀNH RIÊNG CHO ADMIN
                {isAdmin && (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin" className="flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4 text-red-500" />
                      <span>Trang Quản Trị</span>
                    </Link>
                  </DropdownMenuItem>
                )} */}

                {/* MỤC ĐỔI MẬT KHẨU (DÙNG CHUNG) */}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/change-password" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Đổi mật khẩu</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* MỤC ĐĂNG XUẤT */}
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">{t.login}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t.register}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}