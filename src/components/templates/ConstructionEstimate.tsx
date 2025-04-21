import React from 'react';

const ConstructionEstimate: React.FC = () => {
  return (
    <div className="construction-estimate">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

          .construction-estimate {
            margin: 0;
            padding: 0;
            font-family: 'Open Sans', sans-serif;
            background-image: url('https://images.unsplash.com/photo-1575887153762-9c768f84d0e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            color: #333;
          }

          .overlay {
            background: rgba(255, 255, 255, 0.85);
            margin: 40px auto;
            padding: 30px;
            max-width: 800px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          }

          header {
            text-align: center;
            margin-bottom: 20px;
          }

          h1 {
            font-size: 2em;
            margin: 0;
            letter-spacing: 2px;
          }

          .company-info, .client-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }

          .section-title {
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 1.1em;
            border-bottom: 2px solid #555;
            display: inline-block;
            padding-bottom: 2px;
          }

          .details {
            display: flex;
            flex-direction: column;
          }

          .details span {
            margin-bottom: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            padding: 12px;
            border: 1px solid #ccc;
            text-align: left;
          }

          th {
            background-color: #f5f5f5;
          }

          .total {
            font-weight: 700;
            font-size: 1.2em;
            text-align: right;
            padding-right: 10px;
          }

          .terms {
            margin-top: 30px;
            font-size: 0.95em;
          }

          footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #555;
          }
        `}
      </style>
      <div className="overlay">
        {/* Header */}
        <header>
          <h1>Construction Estimate / Quote</h1>
        </header>

        {/* Company and Client Info */}
        <div className="company-info">
          <div className="details">
            <div className="section-title">From:</div>
            <span>**Your Company Name**</span>
            <span>Address Line 1</span>
            <span>City, State, ZIP</span>
            <span>Phone: (xxx) xxx-xxxx</span>
            <span>Email: info@yourcompany.com</span>
          </div>
          <div className="details">
            <div className="section-title">To:</div>
            <span>Client Name</span>
            <span>Address Line 1</span>
            <span>City, State, ZIP</span>
            <span>Phone: (xxx) xxx-xxxx</span>
            <span>Email: client@email.com</span>
          </div>
        </div>

        {/* Project Info */}
        <div className="project-info" style={{marginBottom: '20px'}}>
          <div className="section-title">Project Description:</div>
          <p style={{marginTop: '8px'}}>Insert project details or scope of work here.</p>
        </div>

        {/* Estimate Details Table */}
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Labor</td>
              <td>40 hrs</td>
              <td>$50.00</td>
              <td>$2,000.00</td>
            </tr>
            <tr>
              <td>Materials</td>
              <td>1 lot</td>
              <td>$1,500.00</td>
              <td>$1,500.00</td>
            </tr>
            <tr>
              <td>Equipment</td>
              <td>5 days</td>
              <td>$200.00</td>
              <td>$1,000.00</td>
            </tr>
            <tr>
              <td>Subcontractors</td>
              <td>2</td>
              <td>$750.00</td>
              <td>$1,500.00</td>
            </tr>
          </tbody>
        </table>

        <div className="total">
          Total Estimate: $6,000.00
        </div>

        <div className="terms">
          <div className="section-title">Terms & Conditions:</div>
          <p>This estimate is valid for 30 days from the date of issue. Payment terms: 50% deposit upon acceptance, 50% upon completion.</p>
        </div>

        <footer>
          Thank you for your business!
        </footer>
      </div>
    </div>
  );
};

export default ConstructionEstimate; 