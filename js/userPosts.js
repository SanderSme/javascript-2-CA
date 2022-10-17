import { USER_POSTS_API_URL, DELETE_POST_API_URL } from "./settings/api";
import { getToken } from "./utils/storage";
import moment from "moment";

const userPostsContainer = document.querySelector("#myPosts-container");
const noPostsToDisplayMessage = document.querySelector(
  "#noPostsToDisplayMessage"
);
const fetchPostErrorMessage = document.querySelector("#fetchPostErrorMessage");
const userInfo = document.querySelector("#userInfo");

const deleteErrorMessage = document.querySelector("#deleteErrorMessage");

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
    console.log(data);
    let now = moment(new Date());
    console.log(data.avatar);
    let userAvatar = `<img src="./img/user-alt.svg" alt="" class="md:w-1/5 mobile:w-1/3"/>`;
    if (data.avatar) {
      userAvatar = `<img src="${data.avatar}" alt="" class="md:w-1/5 mobile:w-1/3"/>`;
    }
    userInfo.innerHTML = `${userAvatar}
    <div class="w-1/2">
      <div class="flex justify-between">
        <p class="mx-auto xl:text-xl mobile:text-lg font-bold">${data.name}</p>
      </div>
      <div class="flex justify-between mt-10 xl:text-xl mobile:text-lg">
        <p>Email:</p>
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
          const postMedia = post.media;
          const created = post.created;
          const postID = post.id;
          const hoursSinceCreated = now.diff(created, "hours");
          return `<li class="flex justify-center mt-5">
        <div class="border shadow bg-gray-100 p-8 rounded-md w-3/4">
          <div class="flex justify-between mb-5">
          <div>
          <div class="flex items-end mb-2">
                ${userAvatar}
                  <h3 class="mobile:text-sm lg:text-lg ml-2 font-semibold">${postOwner}</h3>
                </div>
          <p>${hoursSinceCreated} h ago</p>
        </div>
        <a href="/single-post.html?post_id=${postID}" class="hover:underline lg:text-lg mobile:text-md">View post details-></a>
          </div>
          <h4 class="lg:text-xl mobile:text-lg p-2 mb-2 w-1/2 text-center mx-auto">${postTitle}</h4>
          <img src="${postMedia}" class="w-1/2 mx-auto"/>
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
