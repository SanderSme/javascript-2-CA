const { resolve } = require("path");

export default {
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        signIn: resolve(__dirname, "sign-in.html"),
        signUp: resolve(__dirname, "sign-up.html"),
      },
    },
  },
};
