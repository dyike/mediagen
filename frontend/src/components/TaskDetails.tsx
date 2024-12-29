import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
    </div>
  );
};

export default TaskDetails;