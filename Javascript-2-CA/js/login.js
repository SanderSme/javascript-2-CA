import { LOGIN_API_URL } from "./settings/api";
import { validateEmail } from "./utils/validation";
import { saveUser, saveToken } from "./utils/storage";

const loginForm = document.querySelector("#login-form");
const email = document.querySelector("#email");
const emailErrorMessage = document.querySelector("#emailErrorMessage");
const emailRequiredMessage = document.querySelector("#emailRequiredMessage");

const password = document.querySelector("#password");
const passwordErrorMessage = document.querySelector("#passwordErrorMessage");

const loginErrorMessage = document.querySelector("#loginErrorMessage");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isEmail = false;
    if (email.value.trim().length > 0) {
      emailRequiredMessage.classList.add("hidden");
      isEmail = true;
    } else {
      emailRequiredMessage.classList.remove("hidden");
    }
    let isEmailValid = false;
    if (email.value.trim().length && validateEmail(email.value) === true) {
      emailErrorMessage.classList.add("hidden");
      isEmailValid = true;
    } else if (
      email.value.trim().length &&
      validateEmail(email.value) !== true
    ) {
      emailErrorMessage.classList.remove("hidden");
    }

    let isPassword = false;
    if (password.value.trim().length >= 8) {
      passwordErrorMessage.classList.add("hidden");
      isPassword = true;
    } else {
      passwordErrorMessage.classList.remove("hidden");
    }

    let validForm = isEmail && isEmailValid && isPassword;
    if (validForm) {
      const userData = {
        email: email.value,
        password: password.value,
      };

      (async function logInUser() {
        const response = await fetch(`${LOGIN_API_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          const data = await response.json();
          saveToken(data.accessToken);
          const userToSave = {
            name: data.name,
            email: data.email,
          };
          saveUser(userToSave);
          location.href = "../index.html";
        } else {
          const err = await response.json();
          const message = `Error: ${err.message}`;
          throw new Error(message);
        }
      })().catch((err) => {
        loginErrorMessage.innerHTML = `${err.message}`;
      });
    } else {
      console.log("validation did NOOOOOOT work");
    }
  });
}
