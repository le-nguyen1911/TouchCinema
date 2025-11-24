const dateFormat = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString("vi-VN", {
    weekday: "short",      
    month: "long",         
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,         
  });
};

export default dateFormat;
