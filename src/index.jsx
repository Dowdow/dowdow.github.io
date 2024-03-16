import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

const root = createRoot(document.getElementById('root'));
root.render(
  <App />,
);
