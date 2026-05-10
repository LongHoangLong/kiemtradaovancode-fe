"use client";

import { useLanguage } from "@/contexts/language-context";
import { DetailedComparisonInfo, PlagiarismDetails } from "@/types/plagiarism";
import { Button } from "./ui/button";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CodeHighlighter } from "./code-highlighter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlgorithmExplanation } from "./algorithm-explanation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface DetailedComparisonProps {
    info: DetailedComparisonInfo;
    onBack: () => void;
    threshold: number;
}

export function DetailedComparison({ info, onBack, threshold }: DetailedComparisonProps) {
    const { t } = useLanguage();
    const { token } = useAuth();
    const { toast } = useToast();
    const [details, setDetails] = useState<PlagiarismDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const comparisonId = info.Id;

    const normalizeMap = (data: any): [string, number][] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'object') {
            return Object.entries(data);
        }
        return [];
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!token || !comparisonId) return;
            setIsLoading(true);
            try {
                const response = await fetch(`/api/analysis/detail/${comparisonId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to fetch comparison details.");
                }

                const data = await response.json();
                const detailData = Array.isArray(data) ? data[0] : data;

                let parsedExplanation: any = {};
                if (detailData.ExplanationJson) {
                    try {
                        parsedExplanation = JSON.parse(detailData.ExplanationJson);
                    } catch (e) {
                        console.error("Failed to parse ExplanationJson:", e);
                    }
                }

                // 1. LẤY DỮ LIỆU MAP
                const rawMapA = parsedExplanation.MapA || parsedExplanation.mapA || parsedExplanation.FrequencyMapA || parsedExplanation.frequencyMapA;
                const rawMapB = parsedExplanation.MapB || parsedExplanation.mapB || parsedExplanation.FrequencyMapB || parsedExplanation.frequencyMapB;

                // 2. TRÍCH XUẤT SHARED NGRAMS (Sửa lỗi undefined ở đây)
                const rawShared = parsedExplanation.SharedTokens || parsedExplanation.sharedTokens || [];
                const sharedNgramsList = rawShared.map((item: any) => item.Token || item.token);

                setDetails({
                    ContentA: detailData.SourceA || detailData.ContentA || "",
                    ContentB: detailData.SourceB || detailData.ContentB || "",
                    TokensA: parsedExplanation.TokensA || parsedExplanation.tokensA || [],
                    TokensB: parsedExplanation.TokensB || parsedExplanation.tokensB || [],
                    MapA: normalizeMap(rawMapA),
                    MapB: normalizeMap(rawMapB),
                    SharedNgrams: sharedNgramsList // Gán giá trị đã trích xuất
                });

            } catch (error: any) {
                console.error("Fetch detail error:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message || "Could not load comparison details."
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [comparisonId, token, toast]);

    const getShortName = (name: string) => {
        if (!name) return "Unknown File";
        const parts = name.split('/').pop()?.split('.') ?? [];
        return parts.slice(0, -1).join('.') || name;
    };

    const getSimilarityColor = (similarity: number) => {
        if (similarity > threshold) return "text-destructive";
        if (similarity > threshold / 2) return "text-orange-500";
        return "text-green-600";
    }

    const similarityScore = info.Similarity || 0;

    return (
        <div className="w-full flex flex-col gap-6">
            <div>
                <Button variant="ghost" onClick={onBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.backToAnalysis}
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{t.detailedComparison}</h2>
                        <p className="text-muted-foreground text-lg">
                            {getShortName(info.FileA)} -- {getShortName(info.FileB)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`text-4xl font-bold ${getSimilarityColor(similarityScore)}`}>
                            {similarityScore.toFixed(1)}%
                        </p>
                        <p className="text-muted-foreground">{t.overallSimilarity}</p>
                    </div>
                </div>
            </div>

            {similarityScore > threshold && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 !text-red-500 dark:!text-red-400" />
                    <AlertTitle className="text-red-700 dark:text-red-300 font-bold">{t.warning}</AlertTitle>
                    <AlertDescription className="text-red-600 dark:text-red-400">
                        {t.warningDetail}
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : details ? (
                <Tabs defaultValue="code" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="code">{t.fullSourceCode}</TabsTrigger>
                        <TabsTrigger value="explanation" disabled={!details.TokensA || details.TokensA.length === 0}>
                            {t.textExplanation || "Diễn giải (Văn bản)"}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="code" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.fullSourceCode}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CodeHighlighter
                                    contentA={details.ContentA}
                                    contentB={details.ContentB}
                                    fileA={info.FileA}
                                    fileB={info.FileB}
                                    sharedNgrams={details.SharedNgrams || []}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="explanation" className="mt-4">
                        <AlgorithmExplanation details={details} />
                    </TabsContent>
                </Tabs>
            ) : (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Could not load comparison details.</AlertDescription>
                </Alert>
            )}
        </div>
    );
}