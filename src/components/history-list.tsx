"use client";

import { useLanguage } from "@/contexts/language-context";
import { HistoryItem } from "@/types/plagiarism";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { History, Eye, Trash2, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "./ui/tooltip";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HistoryListProps {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
  onClearAll: () => void;
}

export function HistoryList({ history, onView, onDelete, onClearAll }: HistoryListProps) {
  const { t } = useLanguage();
  const T = t as any;

  if (!history || history.length === 0) return null;

  return (
    <Card className="w-full max-w-4xl shadow-lg mt-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6" />
              {T.history || "Lịch sử phân tích"}
            </CardTitle>
            <CardDescription>{T.historyDescription || "Xem lại các báo cáo phân tích trước đây."}</CardDescription>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                <Trash className="mr-2 h-4 w-4" />
                {T.clearHistory || "Xóa tất cả"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{T.confirmDeleteTitle || "Xác nhận xóa?"}</AlertDialogTitle>
                <AlertDialogDescription>{T.confirmDeleteAllDesc || "Bạn có chắc chắn muốn xóa toàn bộ lịch sử không?"}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{T.cancel || "Hủy"}</AlertDialogCancel>
                <AlertDialogAction onClick={onClearAll} className="bg-destructive hover:bg-destructive/90">{T.confirmDelete || "Xóa"}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-lg">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{T.fileName || "Tên tệp"}</TableHead>
                  <TableHead>{T.date || "Ngày"}</TableHead>
                  <TableHead className="text-center">{T.totalSubmissions || "Số bài"}</TableHead>
                  <TableHead className="text-right">{T.actions || "Hành động"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.Id}>
                    {/* Hiển thị đúng tên File */}
                    <TableCell className="font-medium">{item.FileName}</TableCell>
                    {/* Hiển thị đúng Ngày giờ */}
                    <TableCell>{new Date(item.SubmittedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-center">{item.TotalFiles}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => onView(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {T.viewReport || "Xem"}
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Xóa mục này?</AlertDialogTitle>
                                    <AlertDialogDescription>Xóa kết quả phân tích của {item.FileName}?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    {/* QUAN TRỌNG: Gọi hàm onDelete được truyền từ cha */}
                                    <AlertDialogAction onClick={() => onDelete(item)} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}