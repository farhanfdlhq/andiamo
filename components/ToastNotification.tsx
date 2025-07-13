// Andiamo/components/ToastNotification.tsx
import React, { useEffect, useState } from "react";

interface ToastNotificationProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Tunggu animasi fade-out selesai sebelum memanggil onClose
        setTimeout(onClose, 300); // Durasi animasi fade-out
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  let bgColor = "bg-green-500";
  if (type === "error") bgColor = "bg-red-500";
  if (type === "info") bgColor = "bg-blue-500";

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-md shadow-lg text-white text-sm z-50 transition-opacity duration-300 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default ToastNotification;
