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
  const response = await fetch(
    `${GET_POSTS_API_URL}/?_author=true&_comments=true&_reactions=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    let now = moment(new Date());
    if (!data.length) {
      noPostsToDisplayMessage.classList.remove("hidden");
    } else {
      const listOfPosts = data
        .map((post) => {
          const postTitle = post.title;
          const postBody = post.body;
          const postMedia = post.media;
          const created = post.created;
          const ID = post.id;
          const author = post.author.name;
          const reactions = post.reactions.length;
          const hoursSinceCreated = now.diff(created, "hours");
          return `
        <li class="flex justify-center mt-5">
          <div
            
            class="border shadow bg-gray-100 p-8 rounded-md w-3/4 hover:bg-white"
          >
            <div class="flex justify-between mb-5">
              <div>
                <h3>${author}</h3>
                <p>${hoursSinceCreated} h ago</p>
              </div>
              <a href="/single-post.html?post_id=${ID}" class="hover:underline">View post details-></a>
            </div>
            
            <h4 class="text-lg p-2 mb-2 text-center" >${postTitle}</h4>
            <img src="${postMedia}" class="w-1/2 mx-auto"/>
            <p class="pb-4 w-1/2 mx-auto mt-6">
              ${postBody}
            </p>
            <div class="mt-12 flex">
              <button type="button" id="like-btn" class="fa fa-thumbs-up fa-2x p-2"></button>
              <div id="numberOfLikes">${reactions}</div>
            </div>
          </div>
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
