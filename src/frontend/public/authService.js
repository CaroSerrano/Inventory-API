const authService = {
  setToken(token) {
    Cookies.set("token", token, {
      expires: 1, // en días
      secure: true,
      sameSite: "Strict",
    });
  },

  getToken() {
    return Cookies.get("token");
  },

  removeToken() {
    Cookies.remove("token");
  },
};

export default authService;
