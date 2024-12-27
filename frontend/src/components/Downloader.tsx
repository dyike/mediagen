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
      <h1>视频笔记生成器</h1>
      <input
        type="text"
        placeholder="输入视频链接"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleDownload}>生成笔记</button>
      <p>{status}</p>
      {result && (
        <div>
          <h2>整理结果</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default Downloader;
