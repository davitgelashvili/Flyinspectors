import { configureStore } from "@reduxjs/toolkit";
import userData from "./userData";
import translate from "./translate";

const store = configureStore({
  reducer: {
    userData,
    translate
  }
});

export default store;