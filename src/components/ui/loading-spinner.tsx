import React from "react";

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <span className="text-lg font-medium text-gray-700 mt-2">
                Hệ thống đang tiến hành phân tích, vui lòng chờ giây lát
            </span>
        </div>
    );
}
