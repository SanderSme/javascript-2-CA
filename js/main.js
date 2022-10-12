import "../style.css";
import { clearStorage } from "./utils/storage";
import createHeader from "./components/header";

createHeader();

const logOutBtn = document.querySelector("#log-out-btn");

if (logOutBtn) {
  logOutBtn.addEventListener("click", function () {
    clearStorage();
  });
}
