import {
  USER_POSTS_API_URL,
  DELETE_POST_API_URL,
  CHANGE_AVATAR_URL,
} from "./settings/api";
import { getToken, getUserName } from "./utils/storage";
import moment from "moment";

const userPostsContainer = document.querySelector("#myPosts-container");
const noPostsToDisplayMessage = document.querySelector(
  "#noPostsToDisplayMessage"
);
const fetchPostErrorMessage = document.querySelector("#fetchPostErrorMessage");
const userInfo = document.querySelector("#userInfo");

const deleteErrorMessage = document.querySelector("#deleteErrorMessage");

const changeAvatarForm = document.querySelector("#changeAvatarForm");
const avatarInput = document.querySelector("#avatar");
const postAvatarError = document.querySelector("#postAvatarError");

changeAvatarForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let isAvatar = false;
  if (avatarInput.value.trim().length > 0) {
    postAvatarError.classList.add("hidden");
    isAvatar = true;
  } else {
    postAvatarError.classList.remove("hidden");
  }
  if (isAvatar) {
    let avatarData = {
      avatar: avatarInput.value,
    };
    (async function changeAvatar() {
      const response = await fetch(CHANGE_AVATAR_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(avatarData),
      });
      if (response.ok) {
        location.reload();
      } else {
        const error = await response.json;
        console.log(error);
      }
    })();
  }
});

const accessToken = getToken();
if (!accessToken) {
  location.href = "../sign-in.html";
}
async function getUserPosts() {
  const response = await fetch(USER_POSTS_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    let now = moment(new Date());
    let userAvatar = `<img src="./img/user-alt.svg" alt="" class="w-1/2"/>`;
    let userAvatarSmall = `<img src="./img/user-alt.svg" alt="" class="w-1/6"/>`;
    if (data.avatar) {
      userAvatar = `<img src="${data.avatar}" alt="" class="md:w-1/2 mobile:w-1/3"/>`;
      userAvatarSmall = `<img src="${data.avatar}" alt="" class="lg:w-1/5 mobile:w-1/3"/>`;
    }
    userInfo.innerHTML = `<div class="flex flex-col items-center">${userAvatar} <button type="button" class="mt-1 underline" id="changeAvatarBtn">Change avatar>></button></div>
    <div class="mobile:w-full lg:w-1/2 mx-auto">
      <div>
        <p class="mx-auto lg:text-xl mobile:text-lg font-bold">${data.name}</p>
      </div>
      <div class="flex mobile:flex-col lg:flex-row lg:justify-between mt-10 lg:text-xl mobile:text-lg">
        <p class="mobile:mr-0 lg:mr-6">Email:</p>
        <p>${data.email}</p>
      </div>
    </div>`;
    const posts = data.posts;
    if (!posts.length) {
      noPostsToDisplayMessage.innerHTML = "You have no posts to display";
    } else {
      const myPosts = posts
        .map((post) => {
          const postTitle = post.title;
          const postBody = post.body;
          const postOwner = post.owner;
          let postMedia = `<img src="${post.media}" class="w-1/2 mx-auto"/>`;
          if (!post.media) {
            postMedia = "";
          }
          const created = post.created;
          const postID = post.id;
          const hoursSinceCreated = now.diff(created, "hours");
          return `<li class="flex justify-center mt-5">
        <div class="border shadow bg-gray-100 p-8 rounded-md w-3/4">
          <div class="flex justify-between mb-5">
          <div>
          <div class="flex items-end mb-2">
                ${userAvatarSmall}
                  <h3 class="mobile:text-sm lg:text-lg ml-2 font-semibold">${postOwner}</h3>
                </div>
          <p>${hoursSinceCreated} h ago</p>
        </div>
        <a href="/single-post.html?post_id=${postID}" class="hover:underline lg:text-lg mobile:text-md">View post details-></a>
          </div>
          <h4 class="lg:text-xl mobile:text-lg p-2 mb-2 w-1/2 text-center mx-auto">${postTitle}</h4>
          ${postMedia}
          <p class="lg:w-1/2 mobile:w-3/4 mx-auto mt-6 mobile:text-md lg:text-lg">
            ${postBody}
          </p>
          <div class="flex justify-between mt-6">
            <a href="./edit-post.html?post_id=${postID}" id="edit-post-btn" class="fa fa-edit fa-2x mr-6 text-gray-500"></a>
            <div id="deleteErrorMessage" class="text-red-500"></div>
            <button data-id="${postID}" type="button" class="delete-post-btn fa fa-trash fa-2x text-gray-500"></button>
          </div>
        </div>
      </li>`;
        })
        .join("");
      userPostsContainer.insertAdjacentHTML("beforeend", myPosts);
    }
  } else {
    const error = await response.json();
    const errorMessage = `Error: ${error}`;
    fetchPostErrorMessage.innerHTML = errorMessage;
  }
}

getUserPosts().then(() => {
  deletePost();
  const changeAvatarBtn = document.querySelector("#changeAvatarBtn");

  changeAvatarBtn.addEventListener("click", function () {
    changeAvatarForm.classList.toggle("hidden");
  });
});

function deletePost() {
  let deletePostBtn = document.getElementsByClassName("delete-post-btn");
  let numberOfDeleteBtns = deletePostBtn.length;
  for (let i = 0; i < numberOfDeleteBtns; i++) {
    deletePostBtn[i].addEventListener("click", function () {
      const postID = this.dataset.id;
      deletePostByID(postID);
    });
  }
}

async function deletePostByID(id) {
  const response = await fetch(`${DELETE_POST_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    getUserPosts().then(() => {
      deletePost();
      location.reload();
    });
  } else {
    const error = await response.json();
    const errorMessage = `Could not delete post. ${error}`;
    deleteErrorMessage.innerHTML = errorMessage;
  }
}
