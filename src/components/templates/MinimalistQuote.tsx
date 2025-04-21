import React from 'react';

const MinimalistQuote: React.FC = () => {
  return (
    <div className="minimalist-quote">
      <style>
        {`
          .minimalist-quote {
            margin: 0;
            padding: 0;
            font-family: 'Lora', serif;
            background-image: url('https://images.unsplash.com/photo-1606788075761-4f333cb71f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
          }
          .overlay {
            background: rgba(0, 0, 0, 0.4);
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            width: 85%;
            text-align: center;
          }
          h1 {
            font-size: 2em;
            margin-bottom: 15px;
            font-weight: 600;
          }
          p {
            font-size: 1.2em;
          }
        `}
      </style>
      <div className="overlay">
        <h1>"Insert Your Quote Here"</h1>
        <p>Share your vision and inspire your team or clients with this elegant template.</p>
      </div>
    </div>
  );
};

export default MinimalistQuote; 