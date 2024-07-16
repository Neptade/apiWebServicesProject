import React, { useState, useEffect } from 'react';
import Room from "./pages/Room";
import Profile from "./pages/Profile";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
	const makePage = (page) => (<>{page}</>);

	return (
		<div className="App">
			<header className="App-header">
			<a href="http://localhost:3001/auth/google">Sign in with Google</a>
			</header>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={makePage(<Room />)} />
					<Route path="/profile" element={makePage(<Profile />)} /> 

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
