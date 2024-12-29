import React from 'react';
import { useParams, useNavigate } from "react-router-dom";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // 获取导航函数

  // 模拟从后端获取任务详情
  const task = {
    id,
    title: `Task ${id}`,
    description: `This is a detailed description for Task ${id}.`,
    createdAt: "2024-01-01 12:00:00",
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">任务详情</h2>
      <p className="text-gray-600 dark:text-gray-300">
        <strong>任务 ID:</strong> {task.id}
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        <strong>任务标题:</strong> {task.title}
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        <strong>任务描述:</strong> {task.description}
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        <strong>创建时间:</strong> {task.createdAt}
      </p>

      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)} // 返回上一页
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        返回
      </button>
    </div>
  );
};

export default TaskDetails;