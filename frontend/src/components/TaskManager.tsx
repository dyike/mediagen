import React, { useState, useEffect } from "react";
import { GetTasks, AddTask, DeleteTask } from "../../wailsjs/go/main/App";

interface Task {
  Id: number;
  TaskID: string;
  VideoURL: string;
  CreatedAt: number;
  UpdatedAt: number;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [videoURL, setVideoURL] = useState<string>("");

  const fetchTasks = async () => {
    try {
      const result = await GetTasks();
      const mappedTasks: Task[] = result.map((taskPo) => ({
        Id: taskPo.id,
        TaskID: taskPo.task,
        VideoURL: taskPo.video_url,
        CreatedAt: taskPo.created_at,
        UpdatedAt: taskPo.updated_at,
      }));
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
        {tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No tasks available.
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
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
      </div>
    </div>
  );
};

export default TaskManager;