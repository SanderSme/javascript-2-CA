import { SIGNUP_API_URL } from "./settings/api";
import { validateEmail, validatePassword } from "./utils/validation";
import { saveToken, saveUser } from "./utils/storage";

const signUpForm = document.querySelector("#signup-form");

const userName = document.querySelector("#username");
const userNameErrorMessage = document.querySelector("#usernameErrorMessage");

const email = document.querySelector("#email");
const emailErrorMessage = document.querySelector("#emailErrorMessage");
const emailRequiredMessage = document.querySelector("#emailRequiredMessage");

const password = document.querySelector("#password");
const passwordErrorMessage = document.querySelector("#passwordErrorMessage");

const confirmPassword = document.querySelector("#confirmPassword");
const confirmErrorMessage = document.querySelector(
  "#confirmPasswordErrorMessage"
);

const signupErrorMessage = document.querySelector("#signupErrorMessage");

signUpForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let isUserName = false;
  if (userName.value.trim().length > 0) {
    userNameErrorMessage.classList.add("hidden");
    isUserName = true;
  } else {
    userNameErrorMessage.classList.remove("hidden");
  }
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
  } else if (email.value.trim().length && validateEmail(email.value) !== true) {
    emailErrorMessage.classList.remove("hidden");
  }
  let isPassword = false;
  if (password.value.trim().length >= 8) {
    passwordErrorMessage.classList.add("hidden");
    isPassword = true;
  } else {
    passwordErrorMessage.classList.remove("hidden");
  }
  let isConfirmPasswordValid = false;
  isConfirmPasswordValid = validatePassword(
    password.value,
    confirmPassword.value
  );
  if (isConfirmPasswordValid) {
    confirmErrorMessage.classList.add("hidden");
    isConfirmPasswordValid = true;
  } else {
    confirmErrorMessage.classList.remove("hidden");
  }
  let isFormValid =
    isUserName &&
    isEmail &&
    isEmailValid &&
    isPassword &&
    isConfirmPasswordValid;
  if (isFormValid) {
    console.log("validation done");
    const userData = {
      name: userName.value,
      email: email.value,
      password: password.value,
    };

    (async function newUser() {
      const response = await fetch(`${SIGNUP_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        location.href = "../sign-in.html";
      } else {
        const err = await response.json();
        const message = `Error: ${err.message}`;
        throw new Error(message);
      }
    })().catch((err) => {
      signupErrorMessage.innerHTML = `${err.message}`;
    });
  } else {
    console.log("validation failed");
  }
});
