import { getToken } from "./utils/storage";
import { SINGLE_POST_API_URL } from "./settings/api";

const params = window.location.search;
const searchParams = new URLSearchParams(params);
const postID = searchParams.get("post_id");
const accessToken = getToken();

const singlePostDetails = document.querySelector("#singlePostDetails");

async function getPostByID() {
  const response = await fetch(`${SINGLE_POST_API_URL}/${postID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  const postTitle = data.title;
  const postBody = data.body;
  const timeUpdated = new Date(data.updated);
  const postUpdated = timeUpdated.toLocaleDateString();
  const timeCreated = new Date(data.created);
  const postCreated = timeCreated.toLocaleDateString();
  const ID = data.id;
  singlePostDetails.innerHTML = `<li class="flex justify-center mt-5">
  <div class="border shadow bg-gray-100 p-8 rounded-md w-3/4">
    <div class="flex justify-between mb-5">
      <h3>Sander Smedbøl</h3>
      <p>Post-ID: ${ID}</p>
    </div>
    <h4 class="text-xl p-2 mb-2 text-center">${postTitle}</h4>
    <p class="border-b border-gray-500 pb-4">
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
      <div class="fa fa-thumbs-up"></div>
      <div class="fa fa-comment"></div>
    </div>
  </div>
</li>`;
}

getPostByID();
