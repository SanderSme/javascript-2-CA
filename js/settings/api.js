import { getUserName } from "../utils/storage";

const BASE_API_URL = "https://nf-api.onrender.com/";
const LOGIN_API_URL = BASE_API_URL + "api/v1/social/auth/login";
const SIGNUP_API_URL = BASE_API_URL + "api/v1/social/auth/register";
const GET_POSTS_API_URL = BASE_API_URL + "api/v1/social/posts";
const CREATE_POST_API_URL = BASE_API_URL + "api/v1/social/posts";
const SINGLE_POST_API_URL = BASE_API_URL + "api/v1/social/posts";
const userName = getUserName();
const USER_POSTS_API_URL =
  BASE_API_URL + `api/v1/social/profiles/${userName}?_posts=true`;
const DELETE_POST_API_URL = BASE_API_URL + `api/v1/social/posts`;
const EDIT_POST_API_URL = BASE_API_URL + `api/v1/social/posts`;
const REACT_API_URL = BASE_API_URL + `api/v1/social/posts`;

export {
  BASE_API_URL,
  LOGIN_API_URL,
  SIGNUP_API_URL,
  GET_POSTS_API_URL,
  CREATE_POST_API_URL,
  SINGLE_POST_API_URL,
  USER_POSTS_API_URL,
  DELETE_POST_API_URL,
  EDIT_POST_API_URL,
  REACT_API_URL,
};
