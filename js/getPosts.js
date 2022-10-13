import { GET_POSTS_API_URL, REACT_API_URL } from "./settings/api";
import { getToken } from "./utils/storage";
import moment from "moment";

const postsContainer = document.querySelector("#posts-container");
const getPostsErrorMessage = document.querySelector("#getPostsErrorMessage");
const noPostsToDisplayMessage = document.querySelector(
  "#noPostsToDisplayMessage"
);

const searchBar = document.querySelector("#searchBar");
let data = [];

searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value;
  const filteredPosts = data.filter((post) => {
    return post.title.toLowerCase().includes(searchString);
  });
  displayPosts(filteredPosts);
});

const accessToken = getToken();
if (!accessToken) {
  location.href = "../sign-in.html";
}

async function getPosts() {
  const response = await fetch(
    `${GET_POSTS_API_URL}/?_author=true&_comments=true&_reactions=true&&?sort=created&sortOrder=desc`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (response.ok) {
    data = await response.json();
    displayPosts(data);
  } else {
    const error = await response.json();
    const errorMessage = `Error: ${error}`;
    getPostsErrorMessage.classList.remove("hidden");
    getPostsErrorMessage.innerHTML = errorMessage;
  }
}

const displayPosts = (data) => {
  postsContainer.innerHTML = "";
  let now = moment(new Date());
  if (!data.length) {
    noPostsToDisplayMessage.classList.remove("hidden");
  } else {
    noPostsToDisplayMessage.classList.add("hidden");
    const listOfPosts = data
      .map((post) => {
        const postTitle = post.title;
        const postBody = post.body;
        const postMedia = post.media;
        const created = post.created;
        const ID = post.id;
        const author = post.author.name;
        const reactions = post.reactions.length;
        const commentsCount = post._count.comments;
        let time = "m ago";
        let timeSinceCreated = now.diff(created, "minutes");
        if (timeSinceCreated > 59) {
          timeSinceCreated = now.diff(created, "hours");
          time = "h ago";
          if (timeSinceCreated > 24) {
            timeSinceCreated = now.diff(created, "days");
            time = "d ago";
          }
        }
        return `
        <li class="flex justify-center mt-5">
          <div
            
            class="border shadow bg-gray-100 p-8 rounded-md w-3/4 hover:bg-white"
          >
            <div class="flex justify-between mb-5">
              <div>
                <h3>${author}</h3>
                <p>${timeSinceCreated} ${time}</p>
              </div>
              <a href="/single-post.html?post_id=${ID}" class="hover:underline">View post details-></a>
            </div>
            
            <h4 class="text-xl p-2 mb-2 text-center" >${postTitle}</h4>
            <img src="${postMedia}" class="w-1/2 mx-auto"/>
            <p class="pb-4 w-1/2 mx-auto mt-6">
              ${postBody}
            </p>
            <div class="flex justify-between mt-6">
              <div class="flex">
                <button type="button" data-id="${ID}" id="like-btn" class="like-btn fa fa-thumbs-up fa-2x p-2"></button>
                <div>${reactions}</div>      
              </div>
              <div class="flex">
                <button type="button" data-id="${ID}" class="comment-btn fa fa-comment fa-2x p-2"></button>
                <div>${commentsCount}</div>
              </div>
            </div>
            
          </div>
        </li>
        `;
      })
      .join("");
    postsContainer.insertAdjacentHTML("beforeend", listOfPosts);
  }
};

getPosts().then(() => {
  displayPosts(data);
  reactToPost();
});

function reactToPost() {
  let reactToPostBtns = document.getElementsByClassName("like-btn");
  let numberOfReactBtns = reactToPostBtns.length;
  for (let i = 0; i < numberOfReactBtns; i++) {
    reactToPostBtns[i].addEventListener("click", function () {
      const postID = this.dataset.id;
      reactToPostBtns[i].classList.add("text-sky-600");
      reactoToPostByID(postID);
    });
  }
}

async function reactoToPostByID(id) {
  const response = await fetch(`${REACT_API_URL}/${id}/react/👍`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response);
  if (response.ok) {
    getPosts().then(() => {
      reactToPost();
      location.reload();
    });
  } else {
    console.log("not liked");
  }
}
