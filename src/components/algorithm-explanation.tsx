"use client";

import React, { useMemo } from 'react';
import { PlagiarismDetails } from "@/types/plagiarism";
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Info } from 'lucide-react';

interface AlgorithmExplanationProps {
  details: PlagiarismDetails;
}

// --- HÀM CHUẨN HÓA DỮ LIỆU ---
const toEntries = (data: any): [string, number][] => {
  if (!data) return [];
  if (!Array.isArray(data) && typeof data === 'object') return Object.entries(data);
  if (Array.isArray(data)) {
    if (data.length === 0) return [];
    const firstItem = data[0];
    if (Array.isArray(firstItem)) return data as [string, number][];
    if (typeof firstItem === 'object' && firstItem !== null) {
      return data.map((item: any) => {
        const key = item.Token || item.token || item.Key || item.key || "unknown";
        const val = item.Frequency || item.frequency || item.Count || item.count || 0;
        return [String(key), Number(val)];
      });
    }
  }
  return [];
};

const Section: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

export const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ details }) => {
  const { t } = useLanguage();
  const safeDetails = details as any;

  // Thu thập dữ liệu
  const tokensA = safeDetails.TokensA || [];
  const tokensB = safeDetails.TokensB || [];
  const mapA = toEntries(safeDetails.MapA);
  const mapB = toEntries(safeDetails.MapB);

  const { commonTokens, intersectionSize } = useMemo(() => {
    const common: { token: string, count: number }[] = [];
    let intersection = 0;
    const mapAObj = new Map(mapA);
    const mapBObj = new Map(mapB);
    const allKeys = new Set([...Array.from(mapAObj.keys()), ...Array.from(mapBObj.keys())]);

    allKeys.forEach(token => {
      if (mapAObj.has(token) && mapBObj.has(token)) {
        const count = Math.min(mapAObj.get(token)!, mapBObj.get(token)!);
        common.push({ token, count });
        intersection += count;
      }
    });
    return { commonTokens: common.sort((a, b) => b.count - a.count), intersectionSize: intersection };
  }, [mapA, mapB]);

  const totalTokens = tokensA.length + tokensB.length;
  const similarity = totalTokens > 0 ? (2 * intersectionSize / totalTokens) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* PHẦN DIỄN GIẢI VĂN BẢN */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {t.textExplanation || "Diễn giải chi tiết thuật toán"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed space-y-4">
          <p>
            Hệ thống sử dụng phương pháp <strong>Tokenization kết hợp N-Gram ($N=3$)</strong> để phân tích sự tương đồng. Quy trình dựa trên việc loại bỏ chú thích, quy chuẩn hóa chuỗi/số và tính toán theo hệ số <strong>Sørensen–Dice</strong>.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="p-6 space-y-10">
          {/* BƯỚC 1: TOKENIZATION */}
          <Section title={t.step1Title} description={t.step1Description}>
            <div className="grid grid-cols-2 gap-4">
              <TokenDisplay tokens={tokensA} label="File A" />
              <TokenDisplay tokens={tokensB} label="File B" />
            </div>
          </Section>

          {/* BƯỚC 2: FREQUENCY MAP (ĐÃ KHÔI PHỤC) */}
          <Section title={t.step2Title} description={t.step2Description}>
            <div className="grid grid-cols-2 gap-4">
              <FrequencyTable entries={mapA} label="Map A" />
              <FrequencyTable entries={mapB} label="Map B" />
            </div>
          </Section>

          {/* BƯỚC 3: SIMILARITY */}
          <Section title={t.step3Title} description={t.step3Description}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="p-4 pb-0"><CardTitle className="text-sm">{t.commonTokens}</CardTitle></CardHeader>
                <CardContent className="p-4">
                  <ScrollArea className="h-40 w-full rounded border">
                    <Table className="text-xs">
                      <TableBody>
                        {commonTokens.map((ct, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono">{ct.token}</TableCell>
                            <TableCell className="text-right font-bold text-primary">{ct.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span>Giao (A ∩ B):</span><span className="font-mono font-bold">{intersectionSize}</span></div>
                  <div className="flex justify-between"><span>Tổng cụm File A:</span><span className="font-mono">{tokensA.length}</span></div>
                  <div className="flex justify-between"><span>Tổng cụm File B:</span><span className="font-mono">{tokensB.length}</span></div>
                  <div className="pt-2 border-t font-bold text-primary flex justify-between items-baseline">
                    <span>{t.similarityScore}:</span>
                    <span className="text-xl">{(similarity).toFixed(2)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>
        </CardContent>
      </Card>
    </div>
  );
};

// Component con để hiển thị danh sách Token
const TokenDisplay = ({ tokens, label }: { tokens: string[], label: string }) => (
  <div className="space-y-2">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <ScrollArea className="h-40 w-full rounded-md border bg-background">
      <div className="p-2 flex flex-wrap gap-1">
        {tokens.map((t, i) => (
          <span key={i} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">{t}</span>
        ))}
      </div>
    </ScrollArea>
  </div>
);

// Component con để hiển thị bảng tần suất (Bước 2)
const FrequencyTable = ({ entries, label }: { entries: [string, number][], label: string }) => (
  <div className="space-y-2">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <ScrollArea className="h-40 w-full rounded-md border bg-background">
      <Table className="text-[10px]">
        <TableBody>
          {entries.map(([token, count], i) => (
            <TableRow key={i} className="h-7">
              <TableCell className="font-mono py-1">{token}</TableCell>
              <TableCell className="text-right py-1 font-bold">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  </div>
);