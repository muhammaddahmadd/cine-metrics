import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import StarComp from './StarRating';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarComp 
    fill = {"yellow"}
  message = {["Poor", "Okay", "Avg", "Good", "Excellent"]
}

    />
  </React.StrictMode>
);

