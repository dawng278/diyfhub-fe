import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        <h2 className="text-white text-xl font-semibold">Đang tải ứng dụng</h2>
        <p className="text-gray-400">Vui lòng chờ trong giây lát...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
