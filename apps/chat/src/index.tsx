import 'franken-ui/js/core.iife';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { ConfigProvider } from './config';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </StrictMode>,
  );
}
