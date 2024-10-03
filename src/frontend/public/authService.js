const authService = {
  setToken(token) {
    localStorage.setItem("authToken", token); // o sessionStorage.setItem, o manejar cookies
  },
  getToken() {
    return localStorage.getItem("authToken"); // o sessionStorage.getItem, o leer cookies
  },
  removeToken() {
    localStorage.removeItem("authToken"); // o sessionStorage.removeItem, o eliminar cookies
  },
};

export default authService;
