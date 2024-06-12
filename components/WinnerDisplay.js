// components/WinnerDisplay.js
import React from 'react';

const WinnerDisplay = ({ winnerData }) => {
  if (!winnerData || winnerData.length === 0) {
    return <div>No results available.</div>;
  }

  return (
    <div>
      <h3>Voting Results:</h3>
      <p>The winning place is: {winnerData.winner}</p>
    </div>
  );
};

export default WinnerDisplay;
