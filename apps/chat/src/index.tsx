import 'franken-ui/js/core.iife';
import 'franken-ui/js/icon.iife';

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
