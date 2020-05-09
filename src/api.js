let api_root;
if (process.env.NODE_ENV === "production") {
  api_root = "https://grummy.mart.pizza:6969";
} else {
  api_root = "http://localhost:6969";
}
export default api_root;
