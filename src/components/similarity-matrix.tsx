"use client";

import { useLanguage } from "@/contexts/language-context";
import { SimilarityMatrix as SimilarityMatrixType, PlagiarismResult } from "@/types/plagiarism";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useMemo } from "react";

interface SimilarityMatrixProps {
  matrix?: SimilarityMatrixType;
  results?: PlagiarismResult[];
  onCellClick: (fileAIndex: number, fileBIndex: number) => void;
  threshold: number;
}

export function SimilarityMatrix({ matrix, results, onCellClick, threshold }: SimilarityMatrixProps) {
  const { t } = useLanguage();
  
  // === 1. LOGIC XỬ LÝ DỮ LIỆU ===
  const { processedFileNames, processedMatrix } = useMemo(() => {
    const safeMatrix = matrix as any;
    const apiFileNames = safeMatrix?.FileNames || safeMatrix?.fileNames;
    
    if (apiFileNames && apiFileNames.length > 0) {
        return {
            processedFileNames: apiFileNames as string[],
            processedMatrix: (safeMatrix?.SimilarityMatrix || safeMatrix?.similarityMatrix || []) as number[][]
        };
    }

    if (results && results.length > 0) {
        const fileSet = new Set<string>();
        results.forEach(item => {
            if (item.FileA) fileSet.add(item.FileA);
            if (item.FileB) fileSet.add(item.FileB);
        });
        
        const sortedFiles = Array.from(fileSet).sort();
        const size = sortedFiles.length;
        const newMatrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));

        results.forEach(item => {
            const indexA = sortedFiles.indexOf(item.FileA);
            const indexB = sortedFiles.indexOf(item.FileB);
            
            if (indexA !== -1 && indexB !== -1) {
                const score = item.Similarity || 0;
                newMatrix[indexA][indexB] = score;
                newMatrix[indexB][indexA] = score;
            }
        });

        return {
            processedFileNames: sortedFiles,
            processedMatrix: newMatrix
        };
    }

    return { processedFileNames: [], processedMatrix: [] };

  }, [matrix, results]);


  // === 2. HÀM RÚT GỌN TÊN FILE ===
  const getShortName = (name: string) => {
    if (!name) return "Unknown";
    const fileName = name.split('/').pop() || name;
    // Giữ nguyên độ dài 30 ký tự để hiển thị đủ MSSV
    return fileName.length > 30 ? fileName.substring(0, 27) + "..." : fileName;
  };
  
  const shortFileNames = processedFileNames.map(getShortName);

  // === 3. HÀM CHỌN MÀU SẮC ===
  const getCellStyle = (similarity: number) => {
    if (similarity >= 75) return "bg-red-500 text-white hover:bg-red-600";
    if (similarity >= 50) return "bg-orange-500 text-white hover:bg-orange-600";
    if (similarity >= 25) return "bg-yellow-400 text-black hover:bg-yellow-500";
    return "bg-emerald-500 text-white hover:bg-emerald-600";
  };

  if (processedFileNames.length === 0) {
      return (
        <Card className="w-full shadow-lg">
            <CardHeader><CardTitle>{t.similarityMatrixDesc}</CardTitle></CardHeader>
            <CardContent className="py-8 text-center text-muted-foreground">
                {results ? t.noSignificantPlagiarism : "No matrix data available."}
            </CardContent>
        </Card>
      );
  }

  return (
    <Card className="w-full shadow-lg overflow-hidden">
       <CardHeader>
        <CardTitle>{t.similarityMatrixDesc || "Ma trận tương đồng (%)"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 p-0 sm:p-6">
        <TooltipProvider delayDuration={0}>
        <div className="overflow-auto max-h-[800px] w-full pb-12">
          <div className="inline-block min-w-full align-middle">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  {/* Cột góc trái: Giữ độ rộng để tên hàng dọc không bị ép */}
                  <th className="sticky top-0 left-0 z-20 p-2 bg-background border-b border-r min-w-[200px]"></th>
                  
                  {/* Header Hàng Ngang */}
                  {shortFileNames.map((name, index) => (
                    // [FIX 1]: Tăng chiều cao lên 180px để chữ không bị cắt ngọn
                    <th key={index} className="sticky top-0 z-10 h-[180px] px-1 align-bottom bg-background border-b min-w-[50px]">
                        {/* [FIX 2]: Đổi justify-center thành justify-start để chữ bắt đầu từ bên trái, không bị lùi về sau */}
                        <div className="w-full flex items-end justify-start">
                           {/* [FIX 3]: translate-x-3 để đẩy chữ ra khỏi mép trái một chút cho đẹp */}
                           <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap text-xs text-muted-foreground translate-x-3 -translate-y-2 font-medium">
                              {name}
                           </div>
                        </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shortFileNames.map((rowName, i) => (
                  <tr key={i}>
                    {/* Header Hàng Dọc */}
                    <td className="sticky left-0 z-10 p-2 pr-4 border-r border-b font-medium text-xs text-foreground bg-background whitespace-nowrap text-right min-w-[200px]">
                        {rowName}
                    </td>

                    {/* Các ô dữ liệu */}
                    {shortFileNames.map((colName, j) => {
                      const score = (processedMatrix[i] && processedMatrix[i][j] !== undefined) ? processedMatrix[i][j] : 0;
                      const isDiagonal = i === j;

                      return (
                      <td key={j} className="p-1 border-b border-r border-dashed border-gray-100 text-center min-w-[50px]">
                        {isDiagonal ? (
                          <div className="bg-muted/50 h-8 w-full rounded-md flex items-center justify-center text-muted-foreground select-none">
                            -
                          </div>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                  className={`
                                    h-8 w-full min-w-[45px] rounded-md flex items-center justify-center 
                                    text-xs font-bold cursor-pointer transition-all shadow-sm
                                    ${getCellStyle(score)}
                                  `}
                                  onClick={() => onCellClick(i,j)}
                              >
                                  {score.toFixed(1)}%
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <div className="text-center">
                                    <p className="font-semibold text-lg">{score.toFixed(2)}%</p>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        <p>{rowName}</p>
                                        <p className="font-bold my-1">VS</p>
                                        <p>{colName}</p>
                                    </div>
                                </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </td>
                    )})}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Chú thích màu sắc */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground justify-center border-t pt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div> &lt; 25%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-400"></div> 25-50%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500"></div> 50-75%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div> &gt; 75%</div>
        </div>

        </TooltipProvider>
      </CardContent>
    </Card>
  );
}