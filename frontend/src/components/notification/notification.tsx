import React, { useState, useEffect } from 'react';
import { Room } from 'colyseus.js';

type NotificationProps = {
  room: Room; // Assuming the room is of type Room from Colyseus
};

function Notification({ room }: NotificationProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const displayNotification = (text: string) => {
    setMessage(text);
    setIsVisible(true);

    // Hide the notification after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
      setMessage(null); // Reset message state
    }, 3000);
  };

  useEffect(() => {
    if (!room) return;

    // Set up the Colyseus listener here
    const handleNotification = (message: { text: string }) => {
      displayNotification(message.text);
    };

    room.onMessage('notification', handleNotification);

    // For demonstration purposes, let's trigger a message after 2 seconds
    setTimeout(() => {
      displayNotification('Starting game with bot!');
    }, 2000);

    return () => {
      // Clean up listeners when component unmounts
      // room.removeAllListeners("notification");
      room.onMessage('notification', handleNotification); // Assuming the method to remove a specific listener is "offMessage"
    };
  }, [room]);

  if (!isVisible) return null;

  return <div className='notification'>{message}</div>;
}

export default Notification;
