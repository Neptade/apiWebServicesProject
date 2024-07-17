import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ValueAdjuster = () => {
  const [values, setValues] = useState({
    size: 0,
    speed: 0,
    sizeIncrease: 0,
    speedIncrease: 0,
  });
  const token = localStorage.getItem("jwtToken");

  const handleIncrement = async (key) => {
    console.log('incrementing', key);
    setValues(prevValues => ({
      ...prevValues,
      [key]: prevValues[key] + 1
    }));
    const response = await fetch(`http://localhost:3001/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({token, key}),
    });
  };

  return (
    <div>
      <Link to="/game">game</Link>
      {Object.keys(values).map(key => (
        <div key={key} style={{ margin: '10px' }}>
          <span>{key}: {values[key]}</span>
          <button onClick={() => handleIncrement(key)}>▲</button>
        </div>
      ))}
    </div>
  );
};

export default ValueAdjuster;
