export const formatIST = (dateString) => {
  if (!dateString) return "";

  // Force ISO format so JS parses correctly
  const iso = dateString.includes("Z") ? dateString : dateString + "Z";

  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};