import React, { useState, useEffect } from 'react';

function Notification() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const displayNotification = (text) => {
    setMessage(text);
    setIsVisible(true);

    // Hide the notification after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    // Set up the Colyseus listener here
    // room.onMessage("notification", (message) => {
    //     displayNotification(message.text);
    // });

    // For demonstration purposes, let's trigger a message after 2 seconds
    setTimeout(() => {
      displayNotification('Starting game with bot!');
    }, 2000);

    return () => {
      // Clean up listeners when component unmounts
      // room.removeAllListeners("notification");
    };
  }, []);

  if (!isVisible) return null;

  return <div className='notification'>{message}</div>;
}

export default Notification;
