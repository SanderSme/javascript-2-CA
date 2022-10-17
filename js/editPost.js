import { EDIT_POST_API_URL, GET_POSTS_API_URL } from "./settings/api";
import { getToken } from "./utils/storage";

const editPostForm = document.querySelector("#edit-post-form");
const postTitle = document.querySelector("#postTitle");
const postTitleErrorMessage = document.querySelector("#postTitleError");
const postBody = document.querySelector("#postBody");
const postBodyErrorMessage = document.querySelector("#postBodyError");
const editFormErrorMessage = document.querySelector("#editFormErrorMessage");
const postMedia = document.querySelector("#img");

const accessToken = getToken();

const params = window.location.search;
const searchParams = new URLSearchParams(params);
const postID = searchParams.get("post_id");

if (!accessToken) {
  location.href = "../sign-in.html";
}

async function getPostByID() {
  const response = await fetch(`${GET_POSTS_API_URL}/${postID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    const title = data.title;
    const body = data.body;
    const media = data.media;
    postTitle.value = title;
    postBody.value = body;
    postMedia.value = media;
  } else {
    const error = await response.json();
    throw Error(error);
  }
}

getPostByID().catch((error) => {
  editFormErrorMessage.innerHTML = error;
});

editPostForm.addEventListener("submit", function (event) {
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
  let validForm = isPostTitle && isPostTitle;
  if (validForm) {
    let postData = {
      title: postTitle.value,
      body: postBody.value,
      media: postMedia.value,
    };
    if (!postMedia.value) {
      postData = {
        title: postTitle.value,
        body: postBody.value,
      };
    }
    (async function editPost() {
      const response = await fetch(`${EDIT_POST_API_URL}/${postID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        location.href = `single-post.html?post_id=${postID}`;
      } else {
        const error = await response.json();
        const errorMessage = `Error: ${error}`;
        throw new Error(errorMessage);
      }
      editPostForm.reset();
    })().catch((errorMessage) => {
      editFormErrorMessage.innerHTML = `${errorMessage}`;
    });
  } else {
    editFormErrorMessage.innerHTML = "Error";
  }
});
