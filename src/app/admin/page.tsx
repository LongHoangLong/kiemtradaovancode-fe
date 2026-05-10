"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Users, FileCode, Activity, Loader2, Trash2, History,
    ArrowLeft, Eye, CheckCircle, Clock, KeyRound, RefreshCw,
    UserCircle, Mail, Shield, Fingerprint, Calendar
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { AnalysisReport } from '@/components/analysis-report';
import { AnalysisResult, PlagiarismResult } from '@/types/plagiarism';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
    const { user, isAdmin, token } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [stats, setStats] = useState({ TotalUsers: 0, TotalSessions: 0, TotalComparisons: 0 });
    const [usersList, setUsersList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [userHistory, setUserHistory] = useState<any[]>([]);
    const [viewingResult, setViewingResult] = useState<AnalysisResult | null>(null);

    const [viewingUserDetail, setViewingUserDetail] = useState<any | null>(null);

    const fetchAdminData = async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const [statsRes, usersRes] = await Promise.all([
                fetch('/api/admin/stats', { headers }),
                fetch('/api/admin/users', { headers })
            ]);
            if (statsRes.ok && usersRes.ok) {
                setStats(await statsRes.json());
                setUsersList(await usersRes.json());
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu admin:", error);
            toast({ variant: "destructive", title: "Lỗi", description: "Không thể tải dữ liệu." });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        if (!isAdmin) { router.push('/'); return; }
        fetchAdminData();
    }, [user, isAdmin, token, router]);

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/approve?id=${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast({ title: "Thành công", description: "Đã duyệt tài khoản." });
                fetchAdminData(true);
            }
        } catch (e) { toast({ variant: "destructive", title: "Lỗi", description: "Không thể duyệt." }); }
    };

    const handleResetPassword = async (id: string, username: string) => {
        if (!confirm(`Đặt lại mật khẩu của "${username}" về "123456"?`)) return;
        try {
            const res = await fetch(`/api/admin/users/reset?id=${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) toast({ title: "Thành công", description: "Mật khẩu mới là 123456." });
        } catch (e) { toast({ variant: "destructive", title: "Lỗi", description: "Không thể reset." }); }
    };

    const handleDeleteUser = async (id: string, username: string) => {
        if (!window.confirm(`Xóa tài khoản "${username}"?`)) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchAdminData(true);
        } catch (e) { console.error(e); }
    };

    const handleLoadUserHistory = async (u: any) => {
        setSelectedUser(u);
        setViewingResult(null);
        try {
            const res = await fetch(`/api/admin/history?id=${u.Id || u.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setUserHistory(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleViewSessionDetail = async (historyItem: any) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/analysis/session/${historyItem.Id || historyItem.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const sessionData: PlagiarismResult[] = await res.json();
            const sortedResults = sessionData.sort((a, b) => (b.Similarity || 0) - (a.Similarity || 0));
            const fileNames = [...new Set(sessionData.flatMap(p => [p.FileA, p.FileB]))];
            const fileIndexMap = new Map(fileNames.map((name, i) => [name, i]));
            const matrix: number[][] = Array(fileNames.length).fill(0).map(() => Array(fileNames.length).fill(0));
            sessionData.forEach(pair => {
                const i = fileIndexMap.get(pair.FileA);
                const j = fileIndexMap.get(pair.FileB);
                if (i !== undefined && j !== undefined) {
                    matrix[i][j] = matrix[j][i] = pair.Similarity || 0;
                }
            });
            setViewingResult({
                Id: historyItem.Id || historyItem.id,
                Timestamp: historyItem.UploadDate || historyItem.uploadDate,
                FileName: historyItem.ZipFileName || historyItem.zipFileName,
                TotalSubmissions: historyItem.TotalSubmissions || historyItem.totalSubmissions,
                SuspiciousPairs: historyItem.SuspiciousPairsCount || historyItem.suspiciousPairsCount,
                TotalComparisons: sessionData.length,
                DetailedList: sortedResults,
                Matrix: { FileNames: fileNames, SimilarityMatrix: matrix },
                Threshold: historyItem.Threshold || 75,
            });
        } catch (e) { toast({ variant: "destructive", title: "Lỗi", description: "Không tải được chi tiết." }); }
        finally { setIsLoading(false); }
    };

    if (!isAdmin || isLoading) return <div className="flex flex-col min-h-screen"><Header onLogoClick={() => router.push('/')} /><main className="flex-1 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></main></div>;

    if (viewingResult) return <div className="flex flex-col min-h-screen"><Header onLogoClick={() => router.push('/')} /><main className="container mx-auto py-8 px-4"><AnalysisReport result={viewingResult} onReset={() => setViewingResult(null)} threshold={viewingResult.Threshold} backLabel="Quay lại danh sách lịch sử" /></main></div>;

    if (selectedUser) return (
        <div className="flex flex-col min-h-screen"><Header onLogoClick={() => router.push('/')} /><main className="container mx-auto py-10 px-4 space-y-6">
            <div className="flex items-center gap-4 mb-6"><Button variant="outline" size="icon" onClick={() => setSelectedUser(null)}><ArrowLeft className="h-4 w-4" /></Button><div><h2 className="text-2xl font-bold">Lịch sử của {selectedUser.Username || selectedUser.username}</h2><p className="text-muted-foreground">{selectedUser.Email || selectedUser.email}</p></div></div>
            <Card><Table><TableHeader><TableRow><TableHead>Tên tệp</TableHead><TableHead>Ngày tải lên</TableHead><TableHead>Số tệp</TableHead><TableHead>Cặp đáng ngờ</TableHead><TableHead className="text-right">Hành động</TableHead></TableRow></TableHeader>
                <TableBody>{userHistory.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Chưa có dữ liệu.</TableCell></TableRow> : userHistory.map((h, i) => (
                    <TableRow key={h.Id || h.id || i}><TableCell className="font-medium">{h.ZipFileName || h.zipFileName}</TableCell><TableCell>{new Date(h.UploadDate || h.uploadDate).toLocaleString()}</TableCell><TableCell>{h.TotalSubmissions || h.totalSubmissions}</TableCell><TableCell className="text-red-500 font-semibold">{h.SuspiciousPairsCount || h.suspiciousPairsCount}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleViewSessionDetail(h)}><Eye className="h-4 w-4 mr-1" /> Xem</Button></TableCell></TableRow>
                ))}</TableBody></Table></Card></main></div>
    );

    return (
        <div className="flex flex-col min-h-screen"><Header onLogoClick={() => router.push('/')} /><main className="container mx-auto py-10 px-4 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Quản trị hệ thống</h1>
                    <p className="text-muted-foreground mt-2">Duyệt người dùng và quản lý dữ liệu.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAdminData(true)}
                    disabled={isRefreshing}
                    className="w-fit"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Tải lại dữ liệu
                </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList><TabsTrigger value="overview">Tổng quan</TabsTrigger><TabsTrigger value="users">Người dùng</TabsTrigger></TabsList>
                <TabsContent value="overview"><div className="grid gap-4 md:grid-cols-3">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Tài khoản</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.TotalUsers || (stats as any).totalUsers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Phiên kiểm tra</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.TotalSessions || (stats as any).totalSessions}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Lượt so sánh</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.TotalComparisons || (stats as any).totalComparisons}</div></CardContent></Card>
                </div></TabsContent>
                <TabsContent value="users">
                    <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Vai trò</TableHead>
                                        <TableHead className="text-center">Phiên</TableHead>
                                        <TableHead className="text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usersList
                                        .filter(u => (u.username || u.Username) !== user?.username)
                                        .map((u, idx) => {
                                            const role = u.role || u.Role || 'user';
                                            const isApproved = u.isApproved || u.IsApproved;
                                            const id = u.id || u.Id;
                                            const username = u.username || u.Username;

                                            return (
                                                <TableRow
                                                    key={id || idx}
                                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={() => setViewingUserDetail(u)}
                                                >
                                                    <TableCell className="font-medium">{username}</TableCell>
                                                    <TableCell>
                                                        {isApproved ? (
                                                            <span className="text-green-600 flex items-center gap-1 text-xs font-medium"><CheckCircle className="h-3 w-3" /> Đã duyệt</span>
                                                        ) : (
                                                            <span className="text-amber-600 flex items-center gap-1 text-xs font-medium"><Clock className="h-3 w-3" /> Chờ duyệt</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {role.toUpperCase()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">{u.totalScans ?? u.TotalScans ?? 0}</TableCell>
                                                    <TableCell className="text-right flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                        {!isApproved && (
                                                            <Button size="sm" variant="outline" className="h-8 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApprove(id)}>Duyệt</Button>
                                                        )}
                                                        <Button size="sm" variant="ghost" className="h-8 text-amber-600 hover:text-amber-700" onClick={() => handleResetPassword(id, username)} title="Reset về 123456"><KeyRound className="h-4 w-4" /></Button>
                                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => handleLoadUserHistory(u)}><History className="h-4 w-4" /></Button>
                                                        <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(id, username)}><Trash2 className="h-4 w-4" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={!!viewingUserDetail} onOpenChange={(open) => !open && setViewingUserDetail(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-primary" />
                            Thông tin người dùng
                        </DialogTitle>
                        <DialogDescription>
                            Xem chi tiết hồ sơ định danh của thành viên hệ thống.
                        </DialogDescription>
                    </DialogHeader>

                    {viewingUserDetail && (
                        <div className="py-4 space-y-6">
                            <div className="flex flex-col items-center justify-center space-y-2 border-b pb-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                    {(viewingUserDetail.username || viewingUserDetail.Username).charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-bold">{viewingUserDetail.username || viewingUserDetail.Username}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${(viewingUserDetail.role || viewingUserDetail.Role) === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {(viewingUserDetail.role || viewingUserDetail.Role).toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Email</span>
                                        <span className="text-sm">{viewingUserDetail.email || viewingUserDetail.Email || "Không có"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Trạng thái xác thực</span>
                                        <span className="text-sm">
                                            {viewingUserDetail.isApproved || viewingUserDetail.IsApproved ? (
                                                <span className="text-green-600 font-medium">Đã được phê duyệt</span>
                                            ) : (
                                                <span className="text-amber-600 font-medium">Đang chờ phê duyệt</span>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Thống kê hoạt động</span>
                                        <span className="text-sm">Đã thực hiện <strong>{viewingUserDetail.totalScans ?? viewingUserDetail.TotalScans ?? 0}</strong> lượt kiểm tra code</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2">
                                <Button className="flex-1" variant="outline" onClick={() => {
                                    const u = viewingUserDetail;
                                    setViewingUserDetail(null);
                                    handleLoadUserHistory(u);
                                }}>
                                    <History className="h-4 w-4 mr-2" /> Xem lịch sử
                                </Button>
                                <Button className="flex-1" onClick={() => setViewingUserDetail(null)}>
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </main></div>
    );
}