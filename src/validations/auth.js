import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("access");
    const response = await axios.get(`${API_URL}/perfil/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
