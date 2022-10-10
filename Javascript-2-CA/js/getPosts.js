import { GET_POSTS_API_URL } from "./settings/api";
import { getToken } from "./utils/storage";
import moment from "moment";

const postsContainer = document.querySelector("#posts-container");
const getPostsErrorMessage = document.querySelector("#getPostsErrorMessage");
const noPostsToDisplayMessage = document.querySelector(
  "#noPostsToDisplayMessage"
);

const accessToken = getToken();
if (!accessToken) {
  location.href = "../sign-in.html";
}

(async function getPosts() {
  const response = await fetch(GET_POSTS_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    let now = moment(new Date());
    if (!data.length) {
      noPostsToDisplayMessage.classList.remove("hidden");
    } else {
      const listOfPosts = data
        .map((post) => {
          const postTitle = post.title;
          const postBody = post.body;
          const created = post.created;
          const ID = post.id;
          const hoursSinceCreated = now.diff(created, "hours");
          return `
        <li class="flex justify-center mt-5">
          <a
            href="/single-post.html?post_id=${ID}"
            class="border shadow bg-gray-100 p-8 rounded-md w-3/4 hover:bg-white"
          >
            <div class="flex justify-between mb-5">
              <h3>Sander Smedbøl</h3>
              <p>${hoursSinceCreated} h ago</p>
            </div>
            <h4 class="text-lg p-2 mb-2 w-2/3 mx-auto" >${postTitle}</h4>
            <p class="w-2/3 mx-auto">
              ${postBody}
            </p>
          </a>
        </li>
        `;
        })
        .join("");
      postsContainer.insertAdjacentHTML("beforeend", listOfPosts);
    }
  } else {
    const error = await response.json();
    const errorMessage = `Error: ${error}`;
    throw new Error(errorMessage);
  }
})().catch((error) => {
  getPostsErrorMessage.classList.remove("hidden");
  getPostsErrorMessage.innerHTML = error;
});
