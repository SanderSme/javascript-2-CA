import { getToken } from "./utils/storage";
import { SINGLE_POST_API_URL } from "./settings/api";

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
  const postReactions = data.reactions.length;
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
  singlePostDetails.innerHTML = `
  <li class="flex justify-center mt-5">
    <div class="border shadow bg-gray-100 p-8 rounded-md w-3/4">
      <div class="flex justify-between mb-5">
        <h3>${postAuthor}</h3>
        <p>Post-ID: ${ID}</p>
      </div>
      <h4 class="text-xl p-2 mb-2 text-center">${postTitle}</h4>
      <img src="${postMedia}" class="w-1/2 mx-auto"/>
      <p class="pb-4 w-1/2 mx-auto mt-6">
        ${postBody}
      </p>
      <div class="flex justify-between w-1/3 mx-auto mt-6">
        <p>Created:</p>
        <p>${postCreated}</p>
      </div>
    <div class="flex justify-between w-1/3 mx-auto mt-6">
      <p>Updated:</p>
      <p>${postUpdated}</p>
    </div>
    <div class="flex justify-between mt-6">
      <div class="flex">
        <button type="button" id="like-btn" class="fa fa-thumbs-up fa-2x p-2"></button>
        <div>${postReactions}</div>      
        </div>
      <div class="fa fa-comment fa-2x p-2"></div>
    </div>
  </div>
</li>`;
}

getPostByID();
