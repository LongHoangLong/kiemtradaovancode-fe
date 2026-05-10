"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // Thêm Import Router
import { Header } from "@/components/layout/header";
import { AnalysisReport } from "@/components/analysis-report";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult, PlagiarismResult, HistoryItem } from "@/types/plagiarism";
import { AssignmentUpload } from "@/components/assignment-upload";
import { HistoryList } from "@/components/history-list";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
    const router = useRouter(); // Khởi tạo router
    const { t } = useLanguage();
    const T = t as any;
    const { toast } = useToast();

    // Lấy thêm isAdmin từ AuthContext
    const { user, token, isAdmin } = useAuth();

    // =========================================================
    // CHẶN ADMIN TRUY CẬP TRANG NÀY
    // =========================================================
    useEffect(() => {
        if (isAdmin) {
            router.replace('/admin');
        }
    }, [isAdmin, router]);

    // Các State quản lý dữ liệu
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [threshold, setThreshold] = useState(75);
    const [uploadKey, setUploadKey] = useState(Date.now());

    // Nếu là Admin thì trả về giao diện Loading nhẹ nhàng để che form đi trước khi nó bị Redirect đi
    if (isAdmin) {
        return (
            <div className="flex flex-col min-h-screen bg-muted/40">
                <Header onLogoClick={() => { }} />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </main>
            </div>
        );
    }

    // =========================================================
    // 1. HÀM LẤY LỊCH SỬ (Mapping dữ liệu SQL -> Frontend)
    // =========================================================
    const fetchHistory = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch('/api/Analysis/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.warn("Server trả về dữ liệu không phải JSON (có thể là lỗi HTML 404/500)");
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch history');

            const data = await response.json();

            setHistory(data.map((item: any) => ({
                Id: item.Id || item.id,
                FileName: item.ZipFileName || item.zipFileName || item.fileName || "Tệp không tên",
                SubmittedAt: item.UploadDate || item.uploadDate || item.submittedAt || new Date().toISOString(),
                TotalFiles: item.TotalSubmissions || item.totalSubmissions || item.totalFiles || 0,
                SuspiciousPairs: item.SuspiciousPairsCount || item.suspiciousPairsCount || 0,
                Threshold: item.Threshold || item.threshold || 0,
            })));
        } catch (error) {
            console.error("Failed to load history", error);
            setHistory([]);
        }
    }, [token]);

    useEffect(() => {
        if (user && !isAdmin) fetchHistory();
        else setHistory([]);
    }, [user, isAdmin, fetchHistory]);

    useEffect(() => {
        if (analysisResult) window.scrollTo(0, 0);
    }, [analysisResult]);

    const handleReset = () => {
        setFile(null);
        setAnalysisResult(null);
        setProgress(0);
        setUploadKey(Date.now());
        fetchHistory();
    };

    // =========================================================
    // 2. HÀM XÓA 1 MỤC
    // =========================================================
    const handleDeleteHistoryItem = async (item: HistoryItem) => {
        if (!token) return;
        try {
            const response = await fetch(`/api/Analysis/history/${item.Id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Không thể xóa mục này");
            } else {
                if (!response.ok) throw new Error(`Lỗi kết nối (${response.status}): Vui lòng thử lại.`);
            }

            toast({ title: T.success || "Thành công", description: "Đã xóa mục lịch sử." });
            setHistory(prev => prev.filter(h => h.Id !== item.Id));
        } catch (error: any) {
            toast({ variant: "destructive", title: "Lỗi xóa", description: error.message });
        }
    };

    // =========================================================
    // 3. HÀM XÓA TẤT CẢ LỊCH SỬ
    // =========================================================
    const handleClearAllHistory = async () => {
        if (!token) return;
        try {
            const response = await fetch(`/api/Analysis/history`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Không thể xóa lịch sử");
            } else {
                if (!response.ok) throw new Error(`Lỗi kết nối (${response.status}): Vui lòng thử lại.`);
            }

            toast({ title: T.success || "Thành công", description: "Đã xóa toàn bộ lịch sử." });
            setHistory([]);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Lỗi xóa", description: error.message });
        }
    };

    // =========================================================
    // 4. CÁC HÀM XỬ LÝ PHÂN TÍCH (UPLOAD & VIEW)
    // =========================================================
    const handleFileChange = (selectedFile: File | null) => {
        setFile(selectedFile);
        setAnalysisResult(null);
        setProgress(0);
    };

    const handleViewHistoryItem = async (historyItem: HistoryItem) => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            if (!token) throw new Error("Not authenticated");

            const sessionResponse = await fetch(`/api/Analysis/session/${historyItem.Id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!sessionResponse.ok) throw new Error('Failed to fetch session details');

            const sessionData: PlagiarismResult[] = await sessionResponse.json();
            const sortedResults = sessionData.sort((a, b) => (b.Similarity || 0) - (a.Similarity || 0));

            const fileNames = [...new Set(sessionData.flatMap(p => [p.FileA, p.FileB]))];
            const fileIndexMap = new Map(fileNames.map((name, i) => [name, i]));
            const n = fileNames.length;
            const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

            sessionData.forEach(pair => {
                const i = fileIndexMap.get(pair.FileA);
                const j = fileIndexMap.get(pair.FileB);
                if (i !== undefined && j !== undefined) {
                    const val = pair.Similarity || 0;
                    matrix[i][j] = val;
                    matrix[j][i] = val;
                }
            });

            const result: AnalysisResult = {
                Id: historyItem.Id,
                Timestamp: historyItem.SubmittedAt,
                FileName: historyItem.FileName,
                TotalSubmissions: historyItem.TotalFiles,
                SuspiciousPairs: historyItem.SuspiciousPairs,
                TotalComparisons: sessionData.length,
                DetailedList: sortedResults,
                Matrix: { FileNames: fileNames, SimilarityMatrix: matrix },
                Threshold: historyItem.Threshold,
            };
            setAnalysisResult(result);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalysis = async (fileToAnalyze?: File, existingSessionId?: string) => {
        const currentFile = fileToAnalyze || file;
        if (!currentFile || !token) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);
        setProgress(30);

        try {
            let sessionId = existingSessionId;
            let totalFiles = 0;
            let suspiciousPairs = 0;

            if (!sessionId) {
                const formData = new FormData();
                formData.append('file', currentFile);
                formData.append('threshold', String(threshold));

                const uploadResponse = await fetch('/api/Analysis/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
                if (!uploadResponse.ok) throw new Error('Upload failed');

                const uploadData = await uploadResponse.json();
                sessionId = uploadData.SessionId || uploadData.sessionId;
                totalFiles = uploadData.TotalFiles || uploadData.totalFiles;
                suspiciousPairs = uploadData.SuspiciousPairs || uploadData.suspiciousPairs;
            }

            setProgress(60);

            const sessionResponse = await fetch(`/api/Analysis/session/${sessionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!sessionResponse.ok) throw new Error('Failed to fetch details');

            const sessionData: PlagiarismResult[] = await sessionResponse.json();
            const sortedResults = sessionData.sort((a, b) => (b.Similarity || 0) - (a.Similarity || 0));

            const fileNames = [...new Set(sessionData.flatMap(p => [p.FileA, p.FileB]))];
            const fileIndexMap = new Map(fileNames.map((name, i) => [name, i]));
            const n = fileNames.length;
            const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
            sessionData.forEach(pair => {
                const i = fileIndexMap.get(pair.FileA);
                const j = fileIndexMap.get(pair.FileB);
                if (i !== undefined && j !== undefined) {
                    const val = pair.Similarity || 0;
                    matrix[i][j] = val;
                    matrix[j][i] = val;
                }
            });

            if (!totalFiles) totalFiles = fileNames.length;

            const result: AnalysisResult = {
                Id: sessionId || "",
                Timestamp: new Date().toISOString(),
                FileName: currentFile.name,
                TotalSubmissions: totalFiles,
                SuspiciousPairs: suspiciousPairs || sessionData.length,
                TotalComparisons: sessionData.length,
                DetailedList: sortedResults,
                Matrix: { FileNames: fileNames, SimilarityMatrix: matrix },
                Threshold: threshold,
            };

            setAnalysisResult(result);
            fetchHistory();

        } catch (error: any) {
            toast({ variant: "destructive", title: "Failed", description: error.message });
        } finally {
            setIsAnalyzing(false);
            setProgress(100);
        }
    };

    // =========================================================
    // GIAO DIỆN (RENDER)
    // =========================================================
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header onLogoClick={handleReset} />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                <div className={isAnalyzing ? '' : 'hidden'}>
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
                        <div className="w-full max-w-md shadow-md bg-white rounded-lg">
                            <div className="p-6 flex flex-col items-center gap-4">
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                                </div>
                                <h3 className="text-lg font-semibold">Hệ thống đang tiến hành phân tích, vui lòng chờ giây lát</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={!isAnalyzing && !!analysisResult ? '' : 'hidden'}>
                    <AnalysisReport
                        result={analysisResult}
                        onReset={handleReset}
                        threshold={analysisResult?.Threshold || threshold}
                    />
                </div>

                <div className={!isAnalyzing && !analysisResult ? '' : 'hidden'}>
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{T.appName}</h2>
                            <p className="text-lg text-muted-foreground">{T.tagline}</p>
                        </div>

                        <AssignmentUpload
                            key={uploadKey}
                            onFileChange={handleFileChange}
                            onAnalyze={(f, sid) => handleAnalysis(f, sid)}
                            isAnalyzing={isAnalyzing}
                            fileName={file?.name}
                            threshold={threshold}
                            onThresholdChange={setThreshold}
                            isLoggedIn={!!user}
                        />

                        {user && <HistoryList
                            history={history}
                            onView={handleViewHistoryItem}
                            onDelete={handleDeleteHistoryItem}
                            onClearAll={handleClearAllHistory}
                        />}
                    </div>
                </div>
            </main>
            <footer className="py-4 px-6 md:px-8">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {T.appName}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}