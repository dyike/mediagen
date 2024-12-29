import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import TaskDetails from './components/TaskDetails';

const container = document.getElementById('root');
if (!container) throw new Error("Root container not found");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/task/:id" element={<TaskDetails />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
