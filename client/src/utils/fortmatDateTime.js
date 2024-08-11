export const formatDateTime = (date) => {
  const formatter = new Intl.DateTimeFormat("vi", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh", // Specify the desired time zone (optional)
  });
  return formatter.format(new Date(date));
};
