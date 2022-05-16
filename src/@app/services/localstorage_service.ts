import { USER_ID } from "../constants/key";

export const localStorageGetUserIdService = () => {
  return localStorage.getItem(USER_ID);
};

export const localStorageSaveUserIdService = (userId: any) => {
  return localStorage.setItem(USER_ID, userId);
};

export const localStorageClearService = () => {
  localStorage.clear();
};
export const localStorageSaveReduxState = (state: any) => {
  const serializedState = JSON.stringify(state);
  return localStorage.setItem("REDUX_STATE", serializedState);
};
export const localStorageGetReduxState = () => {
  const serializedState = localStorage.getItem("REDUX_STATE");
  if (!serializedState) return undefined;
  return JSON.parse(serializedState);
};
