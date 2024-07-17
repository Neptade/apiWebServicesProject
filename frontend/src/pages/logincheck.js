import React, { useEffect, useState } from 'react';
import { Navigate  } from 'react-router-dom';

const parseCookie = str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

function LoginCheck() {
    const [redirect, setRedirect] = useState(false);
    
    useEffect(() => {
        const cookies = parseCookie(document.cookie);
        const jwtToken = cookies["jwtToken"];
    
        if (jwtToken) {
        localStorage.setItem("jwtToken", jwtToken);
        setRedirect(true);
        }
    }, []);
    
    if (redirect) {
        return <Navigate to="/game" />;
    }

  return (
    <div>
      Redirecting...
    </div>
  );
}

export default LoginCheck;
