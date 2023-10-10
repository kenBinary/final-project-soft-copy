import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'normalize.css';
import './styles/page-style.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App></App> */}
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
    {/* for gh pages */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
