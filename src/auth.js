import axios from "axios";

const API_URL = "http://localhost:4002/api/superadmin/token_data"; // Your API endpoint

// const getToken = () => {

const getToken = () => {
  const tokens = ["authToken"];
  for (const token of tokens) {
    const value = localStorage.getItem(token);
    if (value) return value;
  }
  return null;
};
const baseUrl = process.env.REACT_APP_BASE_API;


export const handleAuth = async (navigate) => {
  const API_URL = "http://localhost:4002/api/superadmin/token_data";
  // const token = localStorage.getItem("authToken");
  const token = getToken();

  if (!token) {
    console.error("Token not found in localStorage");
    navigate("/auth/login", { state: { error: "Token not found" } });
    return;
  }

  try {

    const res = await axios.post(
      `${baseUrl}/superadmin/token_data`,
      { token }, // Empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );


    if (res.data.statusCode !== 200) {
      localStorage.clear();
      navigate("/auth/login", {
        state: { error: "Invalid token or unauthorized access" },
      });
      return;
    }

    const { role, superAdminId } = res.data.data;

    switch (role) {
      case "Superadmin":
        localStorage.setItem("admin_id", superAdminId);
        break;
      default:
        console.error("Unrecognized role");
        localStorage.clear();
        navigate("/auth/login");
        return;
    }

    // setTokenDecode(res.data);
    return res.data;
  } catch (error) {
    console.error("Error:", error);

    if (error.response?.status === 401) {
      localStorage.clear();
      navigate("/auth/login", { state: { error: "Unauthorized access" } });
    } else {
      navigate("/auth/login", {
        state: { error: "An unexpected error occurred" },
      });
    }
  }
};

// module.exports = { handleAuth };
