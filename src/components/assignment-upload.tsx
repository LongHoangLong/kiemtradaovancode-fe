"use client";

import { useState, DragEvent, useCallback } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, File, X, AlertTriangle, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AssignmentUploadProps {
  onFileChange: (file: File | null) => void;
  onAnalyze: (file: File, sessionId?: string) => void;
  isAnalyzing: boolean;
  fileName: string | undefined;
  threshold: number;
  onThresholdChange: (value: number) => void;
  isLoggedIn: boolean;
}

export function AssignmentUpload({ 
  onFileChange, 
  onAnalyze, 
  isAnalyzing, 
  fileName, 
  threshold, 
  onThresholdChange, 
  isLoggedIn 
}: AssignmentUploadProps) {
  const { t } = useLanguage();
  // SỬA LỖI: Ép kiểu 'any' cho biến t để tránh lỗi TypeScript báo thiếu từ khóa mới
  const T = t as any;

  const { token } = useAuth();
  const { toast } = useToast();
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [preCheckResult, setPreCheckResult] = useState<{
      totalFiles: number;
      sessionId: string;
      suspiciousPairs: number;
  } | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setPreCheckResult(null);
      
      if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.endsWith('.rar')) {
        setLocalFile(file);
        onFileChange(file);
      } else {
        setLocalFile(null);
        onFileChange(null);
        toast({
          variant: "destructive",
          title: t.invalidFileTypeTitle || "Invalid File Type",
          description: t.invalidFileTypeDescription || "Please upload a .zip or .rar file.",
        });
      }
    }
  };

  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setLocalFile(null);
    onFileChange(null);
    setPreCheckResult(null);
  };

  const handlePreCheck = async () => {
    if (!localFile || !token) return;
    
    setIsUploading(true);
    try {
        const formData = new FormData();
        formData.append('file', localFile);
        formData.append('threshold', String(threshold));

        const response = await fetch('/api/analysis/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload check failed");
        }

        const data = await response.json();
        
        // Map dữ liệu linh hoạt (PascalCase hoặc camelCase)
        setPreCheckResult({
            totalFiles: data.TotalFiles || data.totalFiles || 0,
            sessionId: data.SessionId || data.sessionId || data.Id,
            suspiciousPairs: data.SuspiciousPairs || data.suspiciousPairs || 0
        });

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to upload file for pre-check.",
        });
    } finally {
        setIsUploading(false);
    }
  };

  const handleConfirmAnalysis = () => {
      if (localFile && preCheckResult) {
          onAnalyze(localFile, preCheckResult.sessionId);
      }
  };

  // --- RENDER POPUP ---
  if (preCheckResult) {
      const isLargeBatch = preCheckResult.totalFiles >= 25;
      
      return (
        <Card className={`w-full max-w-2xl shadow-lg border-2 ${isLargeBatch ? 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20' : 'border-green-500 bg-green-50/50 dark:bg-green-950/20'}`}>
            <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                {isLargeBatch ? (
                    <div className="rounded-full bg-yellow-100 p-4 dark:bg-yellow-900">
                        <AlertTriangle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                    </div>
                ) : (
                    <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                )}

                <div className="space-y-2">
                    <h3 className="text-xl font-bold">
                        {/* Sử dụng biến T (any) hoặc chuỗi mặc định để tránh lỗi đỏ */}
                        {isLargeBatch ? (T.largeBatchDetected || "Phát hiện số lượng lớn") : (T.readyToAnalyze || "Sẵn sàng phân tích")}
                    </h3>
                    <p className="text-muted-foreground">
                        {isLargeBatch 
                            ? `File nén chứa ${preCheckResult.totalFiles} bài nộp. Quá trình phân tích có thể mất nhiều thời gian hơn bình thường.` 
                            : `Đã xử lý thành công ${preCheckResult.totalFiles} bài nộp. Sẵn sàng so sánh.`}
                    </p>
                </div>

                <div className="flex gap-4 w-full justify-center mt-4">
                    <Button variant="outline" onClick={() => removeFile()} className="w-32" disabled={isAnalyzing}>
                        {T.cancel || "Hủy bỏ"}
                    </Button>
                    <Button 
                        onClick={handleConfirmAnalysis} 
                        className={`w-48 ${isLargeBatch ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        {T.startAnalysis || "Bắt đầu phân tích"}
                    </Button>
                </div>
            </CardContent>
        </Card>
      );
  }

  // --- RENDER GIAO DIỆN CHÍNH ---
  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle>{t.uploadTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {!isLoggedIn ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t.loginRequired}</AlertTitle>
            <AlertDescription>
             {t.loginToUpload}{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                {t.login}
              </Link>
              .
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <label
              htmlFor="dropzone-file"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`w-full p-10 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors
              ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
            >
              <input id="dropzone-file" type="file" className="hidden" accept=".zip,.rar" onChange={(e) => handleFileSelect(e.target.files)} />
              {fileName ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 bg-secondary py-2 px-4 rounded-lg">
                        <File className="h-6 w-6 text-primary" />
                        <span className="font-medium text-foreground">{fileName}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={removeFile}>
                            <X className="h-4 w-4"/>
                            <span className="sr-only">Remove file</span>
                        </Button>
                    </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
                  <UploadCloud className="h-12 w-12" />
                  <p className="font-semibold">{t.uploadSubtitle}</p>
                  <p className="text-xs">(.zip, .rar)</p>
                </div>
              )}
            </label>

            <div className="w-full max-w-sm flex flex-col gap-3 pt-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                        <Label htmlFor="threshold-slider" className="font-medium">{t.thresholdLabel}</Label>
                        <span className="text-xs text-muted-foreground">({t.defaultLabel}: 75%)</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{threshold}%</span>
                </div>
                <Slider
                    id="threshold-slider"
                    min={0}
                    max={100}
                    step={1}
                    value={[threshold]}
                    onValueChange={(value) => onThresholdChange(value[0])}
                    disabled={!fileName}
                />
            </div>

            <Button 
                onClick={handlePreCheck} 
                disabled={!fileName || isAnalyzing || isUploading} 
                size="lg" 
                className="w-full sm:w-auto"
            >
              {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
              ) : (
                  t.uploadButton
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}