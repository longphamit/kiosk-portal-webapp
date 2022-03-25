import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import store from './@app/redux/stores';
import AppRouter from './@app/routers/app-routers';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
    <AppRouter/>
    <ToastContainer position="top-right" autoClose={3000}  />
  </Provider>
  );
}

export default App;
