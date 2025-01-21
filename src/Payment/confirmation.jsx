import React from 'react';

const Confirmation = () => {
  return (
    <div className="confirmation-container">
      <h1>Your Order has been Placed Successfully!</h1>

      <style>
        {`
          .confirmation-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f7f7f7;
            text-align: center;
          }

          h1 {
            font-size: 2rem;
            color: #28a745;  /* Green color to indicate success */
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default Confirmation;
