import { StrictMode } from 'react';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App.jsx';
import Header from './components/layouts/header/header.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Header />
    <App />
  </BrowserRouter>
);