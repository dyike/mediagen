import { useParams, useNavigate } from "react-router-dom";

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 模拟从后端获取任务详情
  const task = {
    id,
    title: `Task ${id}`,
    description: `This is a detailed description for Task ${id}.`,
    createdAt: "2024-01-01 12:00:00",
  };

  return (
    <div className="p-6">
      <div className="space-y-3 mb-6">
        <p className="text-sm">
          <span className="font-medium">任务 ID:</span> {task.id}
        </p>
        <p className="text-sm">
          <span className="font-medium">任务标题:</span> {task.title}
        </p>
        <p className="text-sm">
          <span className="font-medium">任务描述:</span> {task.description}
        </p>
        <p className="text-sm">
          <span className="font-medium">创建时间:</span> {task.createdAt}
        </p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
      >
        返回
      </button>
    </div>
  );
};

export default TaskDetails;
