import { getUserName } from "../utils/storage";

function createHeader() {
  const { pathname } = document.location;
  const navBar = document.querySelector("#nav-bar");
  if (navBar) {
    const userName = getUserName();
    let headerContent;
    let userContent;
    headerContent = `<div class="py-6 pr-6 text-gray-100 text-xl ">
    <a href="./sign-up.html" class="${
      pathname === "./sign-up.html" ? "hover:underline" : ""
    }"
      >Sign Up</a
    >
  </div>`;
    userContent = `<div class="py-6 pl-6 ml-20 text-gray-100 text-xl">
    <a href="./sign-in.html" class="${
      pathname === "./sign-in.html" ? "hover:underline" : ""
    }"
      >Log In</a
    >
  </div>`;
    if (userName) {
      headerContent = `<div class="py-6 pr-6">
      <a href="./index.html" class="${
        pathname === "./index.html" ? "hover:underline" : ""
      }"
        >Home</a
      >
    </div>
    <div class="py-6 pl-6 ml-20">
      <a href="./profile.html" class="${
        pathname === "./profile.html" ? "hover:underline" : ""
      }"
        >Profile</a
      >
    </div>`;
      userContent = `<p class="fas fa-user fa-2x text-gray-100 p-6"></p>
      <div>
        <p id="logedInUser" class="text-white">${userName}</p>
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

//style på a-tag funker ikke!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
