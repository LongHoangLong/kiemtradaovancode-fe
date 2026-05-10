"use client";

import { useLanguage } from "@/contexts/language-context";
import { AnalysisResult, DetailedComparisonInfo } from "@/types/plagiarism";
import { Button } from "./ui/button";
import { ArrowLeft, AlertTriangle, FileStack, Scale, Sliders } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SimilarityMatrix } from "./similarity-matrix";
import { DetailedList } from "./plagiarism-report";
import { DetailedComparison } from "./detailed-comparison";
import { useState, useMemo, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface AnalysisReportProps {
    result: AnalysisResult | null;
    onReset: () => void;
    threshold: number;
    // CẢI TIẾN: Thêm nhãn tùy chỉnh cho nút quay lại
    backLabel?: string;
}

const StatCard = ({ icon, title, value, color, suffix }: { icon: React.ReactNode, title: string, value: string | number, color?: string, suffix?: string }) => (
    <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-primary/20 text-primary`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold">{value}{suffix}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </CardContent>
    </Card>
);

export function AnalysisReport({ result, onReset, threshold, backLabel }: AnalysisReportProps) {
    const { t } = useLanguage();
    const [detailedViewInfo, setDetailedViewInfo] = useState<DetailedComparisonInfo | null>(null);
    const [similarityThreshold, setSimilarityThreshold] = useState(0);

    useEffect(() => {
        if (detailedViewInfo) {
            window.scrollTo(0, 0);
        }
    }, [detailedViewInfo]);

    const handleShowDetail = (info: DetailedComparisonInfo) => {
        setDetailedViewInfo(info);
    };

    const handleBackToReport = () => {
        setDetailedViewInfo(null);
        window.scrollTo(0, 0);
    };

    const filteredDetailedList = useMemo(() => {
        if (!result) return [];
        const list = result.DetailedList || [];
        if (similarityThreshold === 0) return list;
        return list.filter(item => (item.Similarity || 0) >= similarityThreshold);
    }, [result, similarityThreshold]);

    const handleMatrixClick = (fileAIndex: number, fileBIndex: number) => {
        if (!result) return;
        let fileNames: string[] = [];
        if (result.Matrix && result.Matrix.FileNames) {
            fileNames = result.Matrix.FileNames;
        } else if (result.DetailedList) {
            const fileSet = new Set<string>();
            result.DetailedList.forEach(item => {
                if (item.FileA) fileSet.add(item.FileA);
                if (item.FileB) fileSet.add(item.FileB);
            });
            fileNames = Array.from(fileSet).sort();
        }
        const fileA = fileNames[fileAIndex];
        const fileB = fileNames[fileBIndex];
        const comparison = (result.DetailedList || []).find(
            (item) => (item.FileA === fileA && item.FileB === fileB) || (item.FileA === fileB && item.FileB === fileA)
        );
        if (comparison) handleShowDetail(comparison);
    }

    if (!result) return null;

    // LOGIC CẢI TIẾN: Khi xem chi tiết code, Component DetailedComparison sẽ chiếm toàn bộ
    // diện tích, do đó nút "Quay lại danh sách lịch sử" ở dưới sẽ tự biến mất.
    if (detailedViewInfo) {
        return <DetailedComparison info={detailedViewInfo} onBack={handleBackToReport} threshold={threshold} />;
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div>
                {/* Nút quay lại linh hoạt */}
                <Button variant="ghost" onClick={onReset} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {backLabel || t.startNewAnalysis}
                </Button>

                <h2 className="text-3xl font-bold tracking-tight">{result.FileName}</h2>
                <p className="text-muted-foreground text-sm">
                    {result.Timestamp ? new Date(result.Timestamp).toLocaleString() : ""}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<FileStack className="h-6 w-6" />} title={t.totalSubmissions} value={result.TotalSubmissions} />
                <StatCard icon={<Scale className="h-6 w-6" />} title={t.totalComparisons} value={result.TotalComparisons} />
                <StatCard icon={<AlertTriangle className="h-6 w-6" />} title={t.suspiciousPairs} value={result.SuspiciousPairs} />
                <StatCard icon={<Sliders className="h-6 w-6" />} title={t.thresholdLabel} value={threshold} suffix="%" />
            </div>

            <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">{t.detailedList}</TabsTrigger>
                    <TabsTrigger value="matrix">{t.similarityMatrix}</TabsTrigger>
                </TabsList>

                <TabsContent value="matrix" className="mt-4">
                    <SimilarityMatrix
                        matrix={result.Matrix!}
                        results={result.DetailedList}
                        onCellClick={handleMatrixClick}
                        threshold={threshold}
                    />
                </TabsContent>

                <TabsContent value="list" className="mt-4">
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">{t.filterBy}:</span>
                            <Select
                                value={String(similarityThreshold)}
                                onValueChange={(value) => setSimilarityThreshold(Number(value))}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t.filterBy} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">{t.showAll}</SelectItem>
                                    <SelectItem value="25">{t.over25}</SelectItem>
                                    <SelectItem value="50">{t.over50}</SelectItem>
                                    <SelectItem value="75">{t.over75}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DetailedList results={filteredDetailedList} onShowDetail={handleShowDetail} threshold={threshold} />
                </TabsContent>
            </Tabs>
        </div>
    );
}