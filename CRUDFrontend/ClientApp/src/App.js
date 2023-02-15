import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

import logo from './logo.svg';
import './App.css';
import CRUD from './CRUD';
function App() {
    return (
        <div className="App">
            <CRUD />
        </div>
    );
}

export default App;
