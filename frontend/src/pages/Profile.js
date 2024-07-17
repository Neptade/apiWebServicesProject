import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const ValueAdjuster = () => {
  const [values, setValues] = useState({
    size: 0,
    speed: 0,
    sizeIncrease: 0,
    speedIncrease: 0,
  });
  const [points, setPoints] = useState(0);
  const token = localStorage.getItem("jwtToken");
  
  const handleIncrement = async (key) => {
    console.log('incrementing', key);
    const response = await fetch(`http://localhost:3001/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token, key }),
    });
    const data = await response.json();
    setPoints(data.points);
  };

  useEffect(() => {
    const currentPoints = points;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await response.json();
        setValues({
          size: data.size,
          speed: data.speed,
          sizeIncrease: data.sizeIncrease,
          speedIncrease: data.speedIncrease,
        });
        setPoints(data.points.points); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <Link to="/game">game</Link>
      <div>
        Points: {points}
      </div>
      {Object.keys(values).map(key => (
        <div key={key} style={{ margin: '10px' }}>
          <span>{key}: </span>
          <span>{values[key]}</span>
          <button onClick={() => handleIncrement(key)}>▲</button>
        </div>
      ))}
    </div>
  );
};

export default ValueAdjuster;
