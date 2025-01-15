// ClarityTracker.js
import React, { useEffect } from 'react';
import { clarity } from 'react-microsoft-clarity';

const ClarityTracker = ({ clarityId, userId, userProperties }) => {
  
  useEffect(() => {
    // Initialize Clarity with the provided ID
    clarity.init(clarityId);

    // Optional: Set cookie consent if needed
    clarity.consent();

    // Optional: Start tracking user behavior
    clarity.start();

    // Cleanup function to stop tracking when the component unmounts
    return () => {
      clarity.stop();
    };
  }, [clarityId, userId, userProperties]);

  return null; // This component does not render anything
};

export default ClarityTracker;