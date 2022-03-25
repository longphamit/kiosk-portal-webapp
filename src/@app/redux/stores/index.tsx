import { configureStore } from '@reduxjs/toolkit';
import { localStorageGetReduxState, localStorageSaveReduxState } from '../../services/localstorage_service';
import appReducers from "../slices/index"


const store = configureStore({
    reducer: {
      ...appReducers,
    },
    preloadedState:localStorageGetReduxState()
});
store.subscribe(()=>{
  localStorageSaveReduxState(store.getState())
})
export default store;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;