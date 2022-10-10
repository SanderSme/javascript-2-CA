import { CREATE_POST_API_URL } from "./settings/api";
import { getToken } from "./utils/storage";

const createPost = document.querySelector("#create-post-form");

const postTitle = document.querySelector("#postTitle");
const postTitleErrorMessage = document.querySelector("#postTitleError");

const postBody = document.querySelector("#postBody");
const postBodyErrorMessage = document.querySelector("#postBodyError");

const createPostFailedMessage = document.querySelector(
  "#createPostFailedMessage"
);

createPost.addEventListener("submit", function (event) {
  event.preventDefault();
  let isPostTitle = false;
  if (postTitle.value.trim().length > 0) {
    postTitleErrorMessage.classList.add("hidden");
    isPostTitle = true;
  } else {
    postTitleErrorMessage.classList.remove("hidden");
  }
  let isPostBody = false;
  if (postBody.value.trim().length > 0) {
    postBodyErrorMessage.classList.add("hidden");
    isPostBody = true;
  } else {
    postBodyErrorMessage.classList.remove("hidden");
  }
  let formIsValid = isPostTitle && isPostBody;
  if (formIsValid) {
    const postData = {
      title: postTitle.value,
      body: postBody.value,
    };
    console.log(postData);
    const accessToken = getToken();
    (async function createPost() {
      const response = await fetch(CREATE_POST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        document.location.reload();
      } else {
        const error = await response.json();
        const errorMessage = `Error: ${error}`;
        throw new Error(errorMessage);
      }
    })().catch((errorMessage) => {
      createPostFailedMessage.innerHTML = errorMessage;
    });
  }
});
