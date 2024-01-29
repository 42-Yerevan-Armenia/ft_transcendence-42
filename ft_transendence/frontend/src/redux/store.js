import {configureStore} from '@reduxjs/toolkit';
import dataReducer from "./features/dataSlice";

//name state counter
const store = configureStore({
    reducer: {
        counter:dataReducer,
    }
})

export default store;