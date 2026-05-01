export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./api/**/*.js"],
  theme: {
    extend: {
      colors: {
        midnight: "#080B16",
        navy: "#10172A",
        mist: "#F5F7FB",
        emerald: "#10B981",
        electric: "#2563EB",
        violet: "#7C3AED",
        gold: "#F5B84B",
        danger: "#EF4444"
      },
      boxShadow: { premium: "0 24px 80px rgba(15, 23, 42, 0.16)" }
    }
  },
  plugins: []
};
