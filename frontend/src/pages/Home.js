import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Home.css'

function Home() {
  return (
    <div className="containerStyle">
      <a href="http://localhost:3001/auth/google" className='link'>Sign in with Google to play!</a>
    </div>
  );
}

export default Home;

