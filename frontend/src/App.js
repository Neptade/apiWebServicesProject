import React, { useState, useEffect } from 'react';
import Room from "./pages/Room";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import LoginCheck from "./pages/logincheck";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
	const makePage = (page) => (<>{page}</>);

	return (
		<div className="App">
			<header className="App-header">
			</header>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={makePage(<Home />)} />
					<Route path="/profile" element={makePage(<Profile />)} /> 
					<Route path="/game" element={makePage(<Room />)} /> 
					<Route path="/loginCheck" element={makePage(<LoginCheck />)} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
