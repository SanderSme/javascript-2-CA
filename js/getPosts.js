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
  const searchString = e.target.value.toLowerCase();
  const filteredPosts = data.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchString) ||
      post.author.name.toLowerCase().includes(searchString)
    );
  });
  displayPosts(filteredPosts);
});

const accessToken = getToken();
if (!accessToken) {
  location.href = "../sign-in.html";
}

const sortOld = document.querySelector("#sortOld");
const sortNew = document.querySelector("#sortNew");

let GET_POSTS_URL = `${GET_POSTS_API_URL}/?_author=true&_comments=true&_reactions=true&&?sort=created&sortOrder=desc`;

sortOld.addEventListener("click", function () {
  GET_POSTS_URL = `${GET_POSTS_API_URL}/?_author=true&_comments=true&_reactions=true&&?sort=created&sortOrder=asc`;
  sortOld.classList.add("bg-sky-900");
  sortOld.classList.add("text-white");
  sortNew.classList.remove("bg-sky-900");
  sortNew.classList.remove("text-white");
  getPosts().then(() => {
    displayPosts(data);
    reactToPost();
  });
});

sortNew.addEventListener("click", function () {
  GET_POSTS_URL = `${GET_POSTS_API_URL}/?_author=true&_comments=true&_reactions=true&&?sort=created&sortOrder=desc`;
  sortNew.classList.add("bg-sky-900");
  sortNew.classList.add("text-white");
  sortOld.classList.remove("bg-sky-900");
  sortOld.classList.remove("text-white");
  getPosts().then(() => {
    displayPosts(data);
    reactToPost();
  });
});

async function getPosts() {
  const response = await fetch(GET_POSTS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    data = await response.json();
    displayPosts(data);
    console.log(data);
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
        let postComments = post.comments;
        function displayComments() {
          let listOfComments = ``;
          for (let i = 0; i < postComments.length; i++) {
            if (postComments[i].body) {
              listOfComments += `<li class="flex justify-between w-3/4 mx-auto border-b border-gray-300 py-2">
              <p class="font-semibold">${postComments[i].owner}:</p>
              <p>${postComments[i].body}</p>
            </li>`;
            }
          }
          return listOfComments;
        }
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
        let avatar = `<img src="./img/user-alt.svg" alt="" class="lg:w-10 mobile:w-6"/>`;
        if (post.author.avatar) {
          avatar = `<img src="${post.author.avatar}" alt="" class="lg:w-16 mobile:w-10"/>`;
        }
        return `
        <li class="flex justify-center mt-5">
          <div
            
            class="border shadow bg-gray-100 p-8 rounded-md w-3/4 hover:bg-white"
          >
            <div class="flex justify-between mb-5">
              <div>
                <div class="flex items-end mb-2">
                ${avatar}
                  <h3 class="mobile:text-sm lg:text-lg ml-2 font-semibold">${author}</h3>
                </div>
                <p>${timeSinceCreated} ${time}</p>
              </div>
              <a href="/single-post.html?post_id=${ID}" class="hover:underline lg:text-lg mobile:text-md">View post details-></a>
            </div>
            
            <h4 class="lg:text-xl mobile:text-lg p-2 mb-2 text-center" >${postTitle}</h4>
            <img src="${postMedia}" class="w-1/2 mx-auto"/>
            <p class="pb-4 lg:w-1/2 mobile:w-3/4 mx-auto mt-6 mobile:text-md lg:text-lg">
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
            <div id="commentSection" class="border-t border-gray-500 mt-6 hidden">
              <p>Comments: </p>
              <ul id="comments" class="hidden">
              ${displayComments()}
              </ul>
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
  showComments();
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
  if (response.ok) {
    getPosts().then(() => {
      reactToPost();
    });
  }
}

function showComments() {
  const commentSection = document.querySelector("#commentSection");
  let showCommentsBtns = document.getElementsByClassName("comment-btn");
  let numberOfCommentBtns = showCommentsBtns.length;
  for (let i = 0; i < numberOfCommentBtns; i++) {
    showCommentsBtns[i].addEventListener("click", function () {
      const postID = this.dataset.id;
      console.log(postID);
      commentSection.classList.toggle("hidden");
    });
  }
}
