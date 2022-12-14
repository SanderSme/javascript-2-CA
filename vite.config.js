const { resolve } = require("path");

export default {
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        signIn: resolve(__dirname, "sign-in.html"),
        signUp: resolve(__dirname, "sign-up.html"),
        singlePost: resolve(__dirname, "single-post.html"),
        profile: resolve(__dirname, "profile.html"),
        editPost: resolve(__dirname, "edit-post.html"),
      },
    },
  },
};
