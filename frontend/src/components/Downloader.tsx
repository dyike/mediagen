import React, { useState } from "react";
import { DownloadVideo, TranscribeAudio, OrganizeContent } from "../../wailsjs/go/main/App";

const Downloader: React.FC = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!url.trim()) {
      setStatus("请输入有效的视频链接！");
      return;
    }

    setIsLoading(true);
    setStatus("正在下载...");
    try {
      // 下载视频
      const filePath = await DownloadVideo(url);
      setStatus("下载完成，正在转录...");

      // 转录音频
      const transcript = await TranscribeAudio(filePath);
      setStatus("转录完成，正在整理内容...");

      // 整理内容
      const organized = await OrganizeContent(transcript);
      setStatus("内容整理完成！");
      setResult(organized);
    } catch (err) {
      setStatus(`出错: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg">
      {/* 标题 */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
        视频下载与转录
      </h2>

      {/* 输入框 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="输入视频链接"
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* 按钮 */}
      <div className="text-center">
        <button
          onClick={handleDownload}
          className={`px-6 py-3 text-white font-semibold rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "处理中..." : "开始下载"}
        </button>
      </div>

      {/* 状态消息 */}
      {status && (
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          {status}
        </p>
      )}

      {/* 结果展示 */}
      {result && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            整理结果：
          </h3>
          <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Downloader;