// src/types/plagiarism.ts

export type TokenMap = [string, number][];

export type PlagiarismDetails = {
    // SỬA: Chuyển sang PascalCase để khớp C#
    ContentA: string;
    ContentB: string;
    TokensA: string[];
    TokensB: string[];
    MapA: TokenMap;
    MapB: TokenMap;
    SharedNgrams?: string[];
}

export type PlagiarismResult = {
    Id: string;         // Backend trả về Id
    FileA: string;      // Backend trả về FileA
    FileB: string;      // Backend trả về FileB
    Similarity: number; // Backend trả về Similarity
    Details?: PlagiarismDetails;
};

export type DetailedComparisonInfo = PlagiarismResult;

export interface SimilarityMatrix {
    FileNames: string[];        // Backend trả về FileNames
    SimilarityMatrix: number[][]; // Backend trả về SimilarityMatrix
}

export interface AnalysisResult {
    Id: string;                 // SessionId
    Timestamp: string;
    FileName: string;           // Tên file zip
    TotalSubmissions: number;
    SuspiciousPairs: number;
    TotalComparisons: number;
    DetailedList: PlagiarismResult[]; // Backend trả về DetailedList
    Matrix?: SimilarityMatrix;        // Backend trả về Matrix
    Threshold: number;
}

export interface HistoryItem {
    Id: string;             // SessionId
    FileName: string;
    SubmittedAt: string;    // Backend trả về SubmittedAt
    TotalFiles: number;
    SuspiciousPairs: number;
    Threshold: number;
}