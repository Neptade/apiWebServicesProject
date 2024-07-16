import React, { useState, useEffect } from 'react';
import Room from "./pages/Room";
import Profile from "./pages/Profile";
import { GoogleLogin } from '@react-oauth/google';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
	const makePage = (page) => (<>{page}</>);

	const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };
	return (
		<div className="App">
			<header className="App-header">
				<h2>React Google Login</h2>
				<GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
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
