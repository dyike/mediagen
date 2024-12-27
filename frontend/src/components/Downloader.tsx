import React, { useState } from "react";
import { DownloadVideo, TranscribeAudio, OrganizeContent } from "../../wailsjs/go/main/App";

const Downloader: React.FC = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");

  const handleDownload = async () => {
    setStatus("正在下载...");
    try {
      const filePath = await DownloadVideo(url);
      setStatus("下载完成，正在转录...");
      const transcript = await TranscribeAudio(filePath);
      setStatus("转录完成，正在整理内容...");
      const organized = await OrganizeContent(transcript);
      setStatus("内容整理完成！");
      setResult(organized);
    } catch (err) {
      setStatus(`出错: ${err}`);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">下载器</h2>
      <input
        type="text"
        placeholder="输入视频链接"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        下载
      </button>
    </div>
  );
};

export default Downloader;
