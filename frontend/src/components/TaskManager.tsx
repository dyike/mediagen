import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MediaService } from "../../bindings/github.com/dyike/mediagen";

interface Task {
  Id: number;
  TaskID: string;
  VideoURL: string;
  TaskStatus: string;
  CreatedAt: number;
  UpdatedAt: number;
}

const PAGE_SIZE = 2;

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [videoURL, setVideoURL] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTasks = async () => {
    try {
      const result = await MediaService.GetTasks();
      const mappedTasks: Task[] = result
        .map((taskPo) => ({
          Id: taskPo.id,
          TaskID: taskPo.task,
          VideoURL: taskPo.video_url,
          TaskStatus: taskPo.task_status,
          CreatedAt: taskPo.created_at,
          UpdatedAt: taskPo.updated_at,
        }))
        .sort((a, b) => b.Id - a.Id);
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!videoURL.trim()) {
      alert("Video URL cannot be empty.");
      return;
    }
    await MediaService.AddTask(videoURL);
    setVideoURL("");
    fetchTasks();
  };

  const handleDeleteTask = async (ID: number) => {
    await MediaService.DeleteTask(ID);
    fetchTasks();
  };

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);
  const currentTasks = tasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">

      {/* Create Task Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          视频链接
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="输入视频链接"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            添加任务
          </button>
        </div>
      </div>

      {/* Task List Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          任务列表
        </h3>
        {currentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            当前无任务
          </p>
        ) : (
          <ul className="space-y-3">
            {currentTasks.map((task) => (
              <li
                key={task.TaskID}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex items-center"
              >
                <div className="flex-1 min-w-0">
                  <Link to={`/task/${task.Id}`} className="block">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {task.VideoURL}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      状态: {task.TaskStatus || "未知"}
                    </p>
                    <p className="text-xs text-gray-500">
                      创建: {new Date(task.CreatedAt).toLocaleString("zh-CN")}
                    </p>
                  </Link>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.Id)}
                  className="ml-3 px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}


        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-sm rounded-md ${currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              上一页
            </button>
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-sm rounded-md ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
