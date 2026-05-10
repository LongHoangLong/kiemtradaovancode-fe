"use client";

import { PlagiarismResult, DetailedComparisonInfo } from "@/types/plagiarism";
import { Button } from "./ui/button";
import { Eye, Folder, AlertTriangle, Users, Info, ArrowLeft, FileCode2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useMemo, useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

let cachedModalGroup: string | null = null;
let cachedModalOther: string | null = null;

interface DetailedListProps {
    results: PlagiarismResult[];
    onShowDetail: (info: DetailedComparisonInfo) => void;
    threshold: number;
}

export function DetailedList({ results, onShowDetail, threshold }: DetailedListProps) {
    const { t } = useLanguage();

    const [selectedGroupForModal, setSelectedGroupForModal] = useState<string | null>(cachedModalGroup);
    const [selectedOtherStudentForModal, setSelectedOtherStudentForModal] = useState<string | null>(cachedModalOther);

    const setAndCacheGroup = (val: string | null) => {
        cachedModalGroup = val;
        setSelectedGroupForModal(val);
    };

    const setAndCacheOther = (val: string | null) => {
        cachedModalOther = val;
        setSelectedOtherStudentForModal(val);
    };

    const getScoreColor = (similarity: number) => {
        if (similarity >= 75) return { text: "text-red-600", bg: "bg-red-500", badge: "bg-red-100 text-red-700" };
        if (similarity >= 50) return { text: "text-orange-600", bg: "bg-orange-500", badge: "bg-orange-100 text-orange-700" };
        if (similarity >= 25) return { text: "text-yellow-600", bg: "bg-yellow-400", badge: "bg-yellow-100 text-yellow-700" };
        return { text: "text-emerald-600", bg: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" };
    };

    const groupedResults = useMemo(() => {
        const groups: Record<string, PlagiarismResult[]> = {};

        results.forEach((item) => {
            const matchA = item.FileA.match(/_(\d+)\./);
            if (matchA) {
                const keyA = `Sinh viên: ${matchA[1]}`;
                if (!groups[keyA]) groups[keyA] = [];
                groups[keyA].push(item);
            } else {
                const keyUnknown = "Tệp không xác định (File gốc)";
                if (!groups[keyUnknown]) groups[keyUnknown] = [];
                groups[keyUnknown].push(item);
            }

            const matchB = item.FileB.match(/_(\d+)\./);
            if (matchB) {
                const keyB = `Sinh viên: ${matchB[1]}`;
                const isSameStudent = matchA && matchB && matchA[1] === matchB[1];

                if (!isSameStudent) {
                    if (!groups[keyB]) groups[keyB] = [];
                    groups[keyB].push({
                        ...item,
                        FileA: item.FileB,
                        FileB: item.FileA
                    });
                }
            }
        });

        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => a.FileA.localeCompare(b.FileA));
        });

        return groups;
    }, [results]);

    useEffect(() => {
        if (selectedGroupForModal && !groupedResults[selectedGroupForModal]) {
            setAndCacheGroup(null);
            setAndCacheOther(null);
        }
    }, [groupedResults, selectedGroupForModal]);

    // ĐÃ CẬP NHẬT: Tính tỷ lệ trùng lặp TRUNG BÌNH thay vì lớn nhất
    const modalData = useMemo(() => {
        if (!selectedGroupForModal || !groupedResults[selectedGroupForModal]) return [];

        const groupItems = groupedResults[selectedGroupForModal];
        // Thay vì maxSim, chúng ta dùng sumSim (tổng) và count (số lượng) để tính trung bình
        const matches: Record<string, { sumSim: number, count: number, items: PlagiarismResult[] }> = {};

        groupItems.forEach(item => {
            const matchB = item.FileB.match(/_(\d+)\./);
            const otherName = matchB ? `Sinh viên: ${matchB[1]}` : item.FileB;

            if (otherName !== selectedGroupForModal) {
                if (!matches[otherName]) {
                    matches[otherName] = { sumSim: 0, count: 0, items: [] };
                }

                matches[otherName].items.push(item);
                matches[otherName].sumSim += (item.Similarity || 0);
                matches[otherName].count += 1;
            }
        });

        // Ánh xạ lại Object, tính toán avgSim (Trung bình) và sắp xếp giảm dần theo điểm trung bình
        return Object.entries(matches)
            .map(([name, data]) => {
                const avgSim = data.count > 0 ? data.sumSim / data.count : 0;
                return [name, { avgSim, items: data.items }] as [string, { avgSim: number, items: PlagiarismResult[] }];
            })
            .sort((a, b) => b[1].avgSim - a[1].avgSim);

    }, [selectedGroupForModal, groupedResults]);


    if (!results || results.length === 0) {
        return <div className="text-center text-muted-foreground py-8">Chưa có dữ liệu phân tích.</div>;
    }

    return (
        <div className="space-y-4">
            {Object.entries(groupedResults).map(([groupName, groupItems], index) => {
                return (
                    <div
                        key={index}
                        className="flex flex-wrap gap-3 items-center justify-between p-4 border rounded-lg bg-card text-foreground cursor-pointer select-none transition-colors duration-200 hover:border-primary/40 hover:bg-muted/30 group"
                        onClick={() => setAndCacheGroup(groupName)}
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Folder className="h-5 w-5" fill="currentColor" />
                            </div>
                            <h3 className="font-semibold text-lg tracking-wide group-hover:text-primary transition-colors">
                                {groupName}
                            </h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="hidden sm:inline-flex">
                                {groupItems.length} tệp
                            </Badge>

                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 shadow-sm transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAndCacheGroup(groupName);
                                }}
                                title="Xem danh sách sinh viên trùng lặp"
                            >
                                <Users className="h-4 w-4 sm:mr-1.5" />
                                <span className="hidden sm:inline text-xs font-semibold">Đối chiếu</span>
                            </Button>
                        </div>
                    </div>
                );
            })}

            <Dialog
                open={!!selectedGroupForModal}
                onOpenChange={(open) => {
                    if (!open) {
                        setAndCacheGroup(null);
                        setAndCacheOther(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[600px]">
                    {selectedOtherStudentForModal ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-start gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 mt-0.5 hover:bg-muted"
                                        onClick={() => setAndCacheOther(null)}
                                        title="Quay lại danh sách tổng quan"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <div>
                                        <DialogTitle className="text-xl">Chi tiết các bài đối chiếu</DialogTitle>
                                        <DialogDescription className="text-sm mt-1.5 flex flex-wrap items-center gap-1.5">
                                            <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{selectedGroupForModal}</span>
                                            <span className="text-xs font-bold text-muted-foreground">VS</span>
                                            <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{selectedOtherStudentForModal}</span>
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 mt-4 custom-scrollbar">
                                {modalData.find(m => m[0] === selectedOtherStudentForModal)?.[1].items.map((item, idx) => {
                                    const similarityScore = item.Similarity || 0;
                                    const colors = getScoreColor(similarityScore);

                                    return (
                                        <div
                                            key={idx}
                                            className="flex flex-col gap-3 p-4 border rounded-lg bg-card transition-colors duration-200 hover:border-primary/40 hover:bg-muted/30 group"
                                        >
                                            <div className="flex flex-col gap-1 text-sm">
                                                <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors" title={item.FileA}>
                                                    <FileCode2 className="inline h-4 w-4 mr-2 text-primary/70 mb-0.5" />
                                                    {item.FileA}
                                                </div>
                                                <div className="text-muted-foreground truncate pl-6" title={item.FileB}>
                                                    {item.FileB}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <span className={`font-bold text-base ${colors.text}`}>
                                                        {similarityScore.toFixed(1)}%
                                                    </span>
                                                    <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden hidden sm:block">
                                                        <div className={`h-full ${colors.bg}`} style={{ width: `${similarityScore}%` }} />
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 shadow-sm transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary shrink-0"
                                                    onClick={() => {
                                                        onShowDetail(item as any);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 mr-1.5" /> Xem Code
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Info className="h-5 w-5 text-primary" />
                                    Tổng quan đối chiếu
                                </DialogTitle>
                                <DialogDescription className="text-base mt-2">
                                    Mức độ trùng lặp mã nguồn TRUNG BÌNH của <strong className="text-foreground">{selectedGroupForModal}</strong> so với các sinh viên khác.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 mt-4 custom-scrollbar">
                                {modalData.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                                        Không có dữ liệu trùng lặp đáng kể.
                                    </div>
                                ) : (
                                    modalData.map(([otherName, data], idx) => {
                                        // Sử dụng data.avgSim (Tỷ lệ trung bình) để lấy màu sắc và hiển thị
                                        const colors = getScoreColor(data.avgSim);
                                        return (
                                            <div
                                                key={idx}
                                                className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 border rounded-lg bg-card transition-colors duration-200 hover:border-primary/40 hover:bg-muted/30 group"
                                            >
                                                <div className="font-medium flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${colors.badge}`}>
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-foreground group-hover:text-primary transition-colors">{otherName}</span>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                                    <div className="flex items-center gap-2">
                                                        {data.avgSim >= threshold && (
                                                            <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse" />
                                                        )}
                                                        <span className={`font-bold text-lg ${colors.text} w-16 text-right`} title="Tỷ lệ trùng lặp trung bình">
                                                            {data.avgSim.toFixed(1)}%
                                                        </span>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 shadow-sm transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary shrink-0"
                                                        onClick={() => setAndCacheOther(otherName)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1.5" /> Chi tiết
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}