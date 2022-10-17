import { getToken } from "./utils/storage";
import { SINGLE_POST_API_URL, REACT_API_URL } from "./settings/api";

const params = window.location.search;
const searchParams = new URLSearchParams(params);
const postID = searchParams.get("post_id");
const accessToken = getToken();

const singlePostDetails = document.querySelector("#singlePostDetails");

async function getPostByID() {
  const response = await fetch(
    `${SINGLE_POST_API_URL}/${postID}?_author=true&_comments=true&_reactions=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  console.log(data);
  const postTitle = data.title;
  const postBody = data.body;
  const postMedia = data.media;
  const postAuthor = data.author.name;
  const postReactions = data._count.reactions;
  const commentsCount = data._count.comments;
  const timeUpdated = new Date(data.updated);
  const postUpdated = timeUpdated.toLocaleTimeString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const timeCreated = new Date(data.created);
  const postCreated = timeCreated.toLocaleTimeString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const ID = data.id;
  let postAvatar = `<img src="./img/user-alt.svg" alt="" class="lg:w-10 mobile:w-6"/>`;
  if (data.author.avatar) {
    postAvatar = `<img src="${data.author.avatar}" alt="" class="lg:w-16 mobile:w-10"/>`;
  }
  singlePostDetails.innerHTML = `
  <li class="flex justify-center mt-5">
    <div class="border shadow bg-gray-100 p-8 rounded-md w-3/4">
      <div class="flex justify-between mb-5">
      <div class="flex items-end mb-2">
      ${postAvatar}
        <h3 class="ml-2 font-semibold mobile:text-sm lg:text-lg">${postAuthor}</h3>
      </div>
        <p class="lg:text-lg mobile:text-md">Post-ID: ${ID}</p>
      </div>
      <h4 class="lg:text-xl mobile:text-lg p-2 mb-2 text-center">${postTitle}</h4>
      <img src="${postMedia}" class="w-1/2 mx-auto"/>
      <p class="pb-4 lg:w-1/2 mobile:w-3/4 mx-auto mt-6 mobile:text-md lg:text-lg">
        ${postBody}
      </p>
      <div class="flex justify-between lg:text-md xl:text-lg mobile:text-sm lg:w-1/3 mobile:w-3/4 mx-auto mt-6">
        <p>Created:</p>
        <p>${postCreated}</p>
      </div>
    <div class="flex justify-between lg:text-md xl:text-lg md:text-md mobile:text-sm lg:w-1/3 mobile:w-3/4 mx-auto mt-6">
      <p>Updated:</p>
      <p>${postUpdated}</p>
    </div>
    <div class="flex justify-between mt-6">
      <div class="flex">
        <button type="button" data-id="${ID}" id="like-btn" class="like-btn fa fa-thumbs-up fa-2x p-2"></button>
        <div>${postReactions}</div>      
        </div>
        <div class="flex">
        <div class="fa fa-comment fa-2x p-2"></div>
        <div>${commentsCount}</div>
      </div>
    </div>
  </div>
</li>`;
}

getPostByID().then(() => {
  reactToPost();
});

function reactToPost() {
  let reactToPostBtns = document.getElementsByClassName("like-btn");
  let numberOfReactBtns = reactToPostBtns.length;
  for (let i = 0; i < numberOfReactBtns; i++) {
    reactToPostBtns[i].addEventListener("click", function () {
      const postID = this.dataset.id;
      console.log(postID);
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
    getPostByID().then(() => {
      reactToPost();
    });
  } else {
    console.log("not liked");
  }
}
