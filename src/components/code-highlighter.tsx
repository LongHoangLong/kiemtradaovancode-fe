"use client";

import React, { useMemo } from 'react';

interface CodeHighlighterProps {
  contentA: string;
  contentB: string;
  fileA: string;
  fileB: string;
  sharedNgrams?: string[]; // Danh sách các cụm N-gram (đã chuẩn hóa) giống nhau
}

const NGramViewer = ({ code, sharedNgramsSet }: { code: string, sharedNgramsSet: Set<string> }) => {
  const highlightedElements = useMemo(() => {
    // 1. Regex tách code y hệt Backend C# (Comment, Chuỗi, Số, Từ khóa, Toán tử, Khoảng trắng)
    const regex = /(\/\/.*|\/\*[\s\S]*?\*\/|".*?"|'.*?'|\b\d+(?:\.\d+)?\b|\w+|[{};(),.=<>\+\-\*\/]|\s+)/g;
    const parts = code.match(regex) || [code]; // Đề phòng match null

    const N = 3; // Kích thước N-Gram của thuật toán
    const activeTokens: { text: string, normalized: string, index: number }[] = [];
    const renderArray = parts.map(text => ({ text, isHighlighted: false }));

    // 2. Chạy qua từng phần tử để tạo N-Gram
    for (let i = 0; i < parts.length; i++) {
      const text = parts[i];
      const isWhitespace = /^\s+$/.test(text);
      const isComment = /^\/\/|^\/\*/.test(text);

      // Bỏ qua comment và khoảng trắng khi xét logic N-Gram
      if (isWhitespace || isComment) continue;

      // Chuẩn hóa token y hệt backend
      let normalized = text;
      if (/^".*"$|^'.*'$/.test(text)) normalized = "<STR>";
      else if (/^\d+(\.\d+)?$/.test(text)) normalized = "<NUM>";

      // Lưu token hợp lệ vào mảng tạm
      activeTokens.push({ text, normalized, index: i });

      // 3. Nếu đủ N token, ghép lại thành N-Gram và kiểm tra với dữ liệu từ Backend
      if (activeTokens.length >= N) {
        const ngramSlice = activeTokens.slice(-N);
        const ngramStr = ngramSlice.map(t => t.normalized).join(" ");

        // Nếu cụm này có trong danh sách đạo văn, đánh dấu highlight cho cả 3 từ nguyên thủy
        if (sharedNgramsSet.has(ngramStr)) {
          ngramSlice.forEach(t => {
            renderArray[t.index].isHighlighted = true;
          });
        }
      }
    }

    return renderArray;
  }, [code, sharedNgramsSet]);

  return (
    <pre className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative p-4 whitespace-pre-wrap">
      <code>
        {highlightedElements.map((el, index) =>
          el.isHighlighted ? (
            <span key={index} className="bg-yellow-200 text-yellow-900 text-destructive-foreground">
              {el.text}
            </span>
          ) : (
            <span key={index}>{el.text}</span>
          )
        )}
      </code>
    </pre>
  );
};

const getShortName = (name: string) => {
  const parts = name.split('/').pop()?.split('.') ?? [];
  return parts.slice(0, -1).join('.') || name;
};

export function CodeHighlighter({ contentA, contentB, fileA, fileB, sharedNgrams = [] }: CodeHighlighterProps) {
  // Biến mảng thành Set để tra cứu O(1) cho nhanh
  const sharedNgramsSet = useMemo(() => new Set(sharedNgrams), [sharedNgrams]);

  return (
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
      <div>
        <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileA)}</h3>
        <NGramViewer code={contentA} sharedNgramsSet={sharedNgramsSet} />
      </div>
      <div>
        <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileB)}</h3>
        <NGramViewer code={contentB} sharedNgramsSet={sharedNgramsSet} />
      </div>
    </div>
  );
}