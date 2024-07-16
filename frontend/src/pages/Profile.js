import React, { useState } from 'react';

const ValueAdjuster = () => {
  const [values, setValues] = useState({
    size: 0,
    speed: 0,
    sizeIncrease: 0,
    speedIncrease: 0,
  });

  const handleIncrement = (key) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: prevValues[key] + 1
    }));
  };

  const handleDecrement = (key) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: prevValues[key] - 1
    }));
  };

  return (
    <div>
      {Object.keys(values).map(key => (
        <div key={key} style={{ margin: '10px' }}>
          <span>{key}: {values[key]}</span>
          <button onClick={() => handleIncrement(key)}>▲</button>
          <button onClick={() => handleDecrement(key)}>▼</button>
        </div>
      ))}
    </div>
  );
};

export default ValueAdjuster;
