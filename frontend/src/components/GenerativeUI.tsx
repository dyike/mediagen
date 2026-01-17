import { useState } from 'react';
import { Renderer } from '@json-render/react';

// 注册 React 组件实现
const componentRegistry = {
  Card: ({ element, children }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {element.props.title}
      </h3>
      {element.props.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {element.props.description}
        </p>
      )}
      <div>{children}</div>
    </div>
  ),

  Button: ({ element }: any) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    const variant = element.props.variant || 'primary';

    return (
      <button
        className={`px-4 py-2 rounded-md font-medium transition-colors ${variants[variant as keyof typeof variants]}`}
        onClick={() => {
          if (element.props.action) {
            alert(`执行操作: ${element.props.action}`);
          }
        }}
      >
        {element.props.label}
      </button>
    );
  },

  Metric: ({ element }: any) => {
    const trendColors = {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-600',
    };
    const trend = element.props.trend || 'neutral';
    const trendIcons = {
      up: '↑',
      down: '↓',
      neutral: '→',
    };

    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {element.props.label}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {element.props.value}
          </div>
          <span className={`text-sm ${trendColors[trend as keyof typeof trendColors]}`}>
            {trendIcons[trend as keyof typeof trendIcons]}
          </span>
        </div>
      </div>
    );
  },

  Text: ({ element }: any) => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    const size = element.props.size || 'md';

    return (
      <p className={`${sizes[size as keyof typeof sizes]} text-gray-700 dark:text-gray-300`}>
        {element.props.content}
      </p>
    );
  },

  Grid: ({ element, children }: any) => {
    const columns = element.props.columns || 2;
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    };

    return (
      <div className={`grid ${gridClasses[columns as keyof typeof gridClasses]} gap-4`}>
        {children}
      </div>
    );
  },
};

// 模拟的 UI 生成示例 - 使用扁平结构
const examplePrompts = [
  {
    prompt: '创建一个销售仪表板',
    tree: {
      'root': {
        key: 'root',
        type: 'Grid',
        props: { columns: 3 },
        children: ['metric1', 'metric2', 'metric3'],
      },
      'metric1': {
        key: 'metric1',
        type: 'Metric',
        props: { label: '总销售额', value: '¥125,430', trend: 'up' },
      },
      'metric2': {
        key: 'metric2',
        type: 'Metric',
        props: { label: '订单数', value: '342', trend: 'up' },
      },
      'metric3': {
        key: 'metric3',
        type: 'Metric',
        props: { label: '客户数', value: '89', trend: 'down' },
      },
    },
  },
  {
    prompt: '显示用户信息卡片',
    tree: {
      'root': {
        key: 'root',
        type: 'Card',
        props: {
          title: '用户资料',
          description: '查看和编辑您的个人信息',
        },
        children: ['text1', 'text2', 'button1'],
      },
      'text1': {
        key: 'text1',
        type: 'Text',
        props: { content: '姓名: 张三', size: 'md' },
      },
      'text2': {
        key: 'text2',
        type: 'Text',
        props: { content: '邮箱: zhangsan@example.com', size: 'md' },
      },
      'button1': {
        key: 'button1',
        type: 'Button',
        props: { label: '编辑资料', variant: 'primary' },
      },
    },
  },
  {
    prompt: '创建一个项目概览',
    tree: {
      'root': {
        key: 'root',
        type: 'Grid',
        props: { columns: 2 },
        children: ['card1', 'card2'],
      },
      'card1': {
        key: 'card1',
        type: 'Card',
        props: {
          title: '进行中的任务',
          description: '当前正在执行的任务列表',
        },
        children: ['metric4', 'button2'],
      },
      'card2': {
        key: 'card2',
        type: 'Card',
        props: {
          title: '已完成任务',
          description: '最近完成的任务统计',
        },
        children: ['metric5', 'button3'],
      },
      'metric4': {
        key: 'metric4',
        type: 'Metric',
        props: { label: '活跃任务', value: '12', trend: 'neutral' },
      },
      'button2': {
        key: 'button2',
        type: 'Button',
        props: { label: '查看全部', variant: 'secondary' },
      },
      'metric5': {
        key: 'metric5',
        type: 'Metric',
        props: { label: '本周完成', value: '28', trend: 'up' },
      },
      'button3': {
        key: 'button3',
        type: 'Button',
        props: { label: '导出报告', variant: 'primary', action: 'export_report' },
      },
    },
  },
];

const GenerativeUI = () => {
  const [currentTree, setCurrentTree] = useState<any>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [darkMode] = useState(false);

  const handlePromptClick = (example: any) => {
    setSelectedPrompt(example.prompt);
    setCurrentTree(example.tree);
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            生成式 UI 演示
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            使用 json-render 框架，通过 AI 生成可控的用户界面
          </p>
        </div>

        {/* 提示词选择区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            选择一个示例提示词
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(example)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPrompt === example.prompt
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {example.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 生成的 UI 预览区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              生成的界面预览
            </h2>
            {currentTree && (
              <button
                onClick={() => {
                  setCurrentTree(null);
                  setSelectedPrompt('');
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                清空
              </button>
            )}
          </div>

          {currentTree ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <Renderer tree={currentTree} registry={componentRegistry} />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                请选择一个提示词来生成界面
              </p>
            </div>
          )}
        </div>

        {/* 说明区域 */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            关于此演示
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• 使用 @json-render/core 和 @json-render/react 框架</li>
            <li>• 预定义了 Card、Button、Metric、Text、Grid 等组件</li>
            <li>• AI 只能使用目录中定义的组件，确保输出可控</li>
            <li>• 生成的是 JSON 结构，然后渲染成 React 组件</li>
            <li>• 实际使用时可以接入 OpenAI/Claude 等 AI 模型生成 JSON</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GenerativeUI;
