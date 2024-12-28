import React, { useState, useEffect } from "react";
import { GetTasks, AddTask, DeleteTask } from "../../wailsjs/go/main/App";

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
      const result = await GetTasks();
      const mappedTasks: Task[] = result
        .map((taskPo) => ({
          Id: taskPo.id,
          TaskID: taskPo.task,
          VideoURL: taskPo.video_url,
          TaskStatus: taskPo.task_status,
          CreatedAt: taskPo.created_at,
          UpdatedAt: taskPo.updated_at,
        }))
        .sort((a, b) => b.Id - a.Id); // Sort tasks by ID in descending order
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
    await AddTask(videoURL);
    setVideoURL("");
    fetchTasks();
  };

  const handleDeleteTask = async (ID: number) => {
    await DeleteTask(ID);
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
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl transition duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        任务管理
      </h2>

      {/* Create Task Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          视频链接
        </label>
        <div className="flex">
          <input
            type="text"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="Enter video URL"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleCreateTask}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-r-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            添加任务
          </button>
        </div>
      </div>

      {/* Task List Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          任务列表
        </h2>
        {currentTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            当前无任务.
          </p>
        ) : (
          <ul className="space-y-4">
            {currentTasks.map((task) => (
              <li
                key={task.TaskID}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
              >
                <div className="flex-grow">
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 truncate">
                    <a href={task.VideoURL} target="_blank" rel="noopener noreferrer">
                      {task.VideoURL}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    任务状态: {task.TaskStatus || "未知"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    创建时间:{" "}
                    {new Date(task.CreatedAt).toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    更新时间:{" "}
                    {new Date(task.UpdatedAt).toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.Id)}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg shadow-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              上一页
            </button>
            <span className="text-gray-800 dark:text-gray-100">
              页 {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg shadow-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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