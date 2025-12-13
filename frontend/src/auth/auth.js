import {jwtDecode} from "jwt-decode";
export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

export const getUserRole = () => {
  try {
    const token = getToken();
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
