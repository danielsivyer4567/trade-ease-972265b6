import React from 'react';

const ConstructionQuote: React.FC = () => {
  return (
    <div className="construction-quote">
      <style>
        {`
          .construction-quote {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-image: url('https://images.unsplash.com/photo-1575887153762-9c768f84d0e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .overlay {
            background: rgba(0, 0, 0, 0.5);
            padding: 40px;
            max-width: 700px;
            width: 90%;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          }
          h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
          }
          p {
            font-size: 1.2em;
            line-height: 1.5;
            text-align: center;
          }
          .user-text {
            margin-top: 20px;
          }
        `}
      </style>
      <div className="overlay">
        <h1>"Insert Your Quote Here"</h1>
        <p className="user-text">Insert your message, quote, or project description here. Make it inspiring and professional.</p>
      </div>
    </div>
  );
};

export default ConstructionQuote; 