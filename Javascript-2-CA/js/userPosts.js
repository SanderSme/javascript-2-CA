import { USER_POSTS_API_URL, DELETE_POST_API_URL } from "./settings/api";
import { getToken } from "./utils/storage";
import moment from "moment";

const userPostsContainer = document.querySelector("#myPosts-container");
const noPostsToDisplayMessage = document.querySelector(
  "#noPostsToDisplayMessage"
);
const fetchPostErrorMessage = document.querySelector("#fetchPostErrorMessage");
const userInfo = document.querySelector("#userInfo");

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
    userInfo.innerHTML = `<div class="fa fa-user fa-6x text-gray-600"></div>
    <div class="w-1/2">
      <div class="flex justify-between text-xl font-bold">
        <p class="mx-auto">${data.name}</p>
      </div>
      <div class="flex justify-between mt-10 text-xl">
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
          const created = post.created;
          const postID = post.id;
          const hoursSinceCreated = now.diff(created, "hours");
          return `<li class="flex justify-center mt-5">
        <div class="border shadow bg-gray-100 p-8 rounded-md w-3/4">
          <div class="flex justify-between mb-5">
            <h3>${postOwner}</h3>
            <p>${hoursSinceCreated} h ago</p>
          </div>
          <h4 class="text-lg p-2 mb-2 w-2/3 mx-auto">${postTitle}</h4>
          <p class="w-2/3 mx-auto">
            ${postBody}
          </p>
          <div class="flex justify-between mt-6">
            <a href="#" id="edit-post-btn" class="fa fa-edit fa-2x mr-6 text-gray-500"></a>
            <button data-id:"${postID}" type="button" class="delete-post-btn fa fa-trash fa-2x text-gray-500"></button>
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

getUserPosts();

function deletePost() {
  let deletePostBtn = document.getElementsByClassName("delete-post-btn");
  let numberOfDeleteBtns = deletePostBtn.length;
  console.log(numberOfDeleteBtns);
  console.log(deletePostBtn);
  for (let i = 0; i < numberOfDeleteBtns; i++) {
    deletePostBtn[i].addEventListener("click", function () {
      console.log("clicked");
    });
  }
}
deletePost();
//.then(() => {
//   deletePost();
// });

// function deletePost() {
//   let deletePostBtn = document.querySelectorAll(".delete-post-btn");
//   let numberOfDeleteBtns = deletePostBtn.length;
//   for (let i = 0; i < numberOfDeleteBtns; i++) {
//     deletePostBtn[i].addEventListener("click", function () {
//       const postID = this.dataset.id;
//       deletePostByID(postID);
//     });
//   }
// }

// function deletePostByID(id) {
//   const deleteByID = async () => {
//     try {
//       let response = await fetch(`${DELETE_POST_API_URL}/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       if (response.status === 200) {
//         console.log("deleted post");
//         getUserPosts().then(() => {
//           deletePost();
//         });
//       } else {
//         const error = await response.json();
//         const errorMessage = `Error: ${error}`;
//         throw new Error(errorMessage);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   deleteByID().then(() => {});
// }
