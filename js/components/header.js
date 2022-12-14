import { getUserName } from "../utils/storage";

function createHeader() {
  const { pathname } = document.location;
  const navBar = document.querySelector("#nav-bar");
  if (navBar) {
    const userName = getUserName();
    let headerContent;
    let userContent;
    headerContent = `<div class="py-6 pr-6 text-gray-100 text-xl hover:underline">
    <a href="./sign-up.html" class="${pathname === "./sign-up.html" ? "" : ""}"
      >Sign Up</a
    >
  </div>`;
    userContent = `<div class="py-6 pl-6 ml-20 text-gray-100 text-xl hover:underline">
    <a href="./sign-in.html" class="${pathname === "./sign-in.html" ? "" : ""}"
      >Log In</a
    >
  </div>`;
    if (userName) {
      headerContent = `<div class="py-6 pr-6 hover:underline">
      <a href="./index.html" class="${pathname === "./index.html" ? "" : ""}"
        >Home</a
      >
    </div>
    <div class="py-6 pl-6 ml-20 hover:underline">
      <a href="./profile.html" class="${
        pathname === "./profile.html" ? "" : ""
      }"
        >Profile</a
      >
    </div>`;
      userContent = `<p class="fas fa-user fa-2x text-gray-100 p-6"></p>
      <div>
        <p id="logedInUser" class="text-white font-medium">${userName}</p>
        <a
          href="./sign-in.html"
          id="log-out-btn"
          class="${pathname === "./sign-in.html" ? "hover:underline" : ""}"
          >Log Out</a
        >
      </div>`;
    }
    navBar.innerHTML = `<div class="flex text-gray-100 text-xl">${headerContent}</div><div class="flex items-center text-gray-100">${userContent}</div>`;
  }
}
export default createHeader;
