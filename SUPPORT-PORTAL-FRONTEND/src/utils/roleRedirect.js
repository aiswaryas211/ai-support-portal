export const roleRedirect = (role, navigate) => {
  if (role === "admin") navigate("/admin");
  else if (role === "agent") navigate("/agent");
  else navigate("/customer");
};
