import {createSlice} from "@reduxjs/toolkit";



const initialState = {
  HomeMiddleShow:{
    homeConteiner: true,
    Profile: false,
    Game: false,
    Leaderboard: false,
    Live: false,
    Settings: false
  },
  Data:{

  }
}
  

export const AllData = createSlice({
    //state.counter.HomeMiddleShow
    //state.counter ... = {...initialState}
    name : "Data",
    initialState,
    reducers: {
  
       //all data.actions using for despatch
        MiddleShow : ((state, action) => {
          //1)we don't need to return a new state "...state"
          //  because default returning a new state
          //2)data come in the inside function
          state.HomeMiddleShow = {    
            homeConteiner: false,
            Profile: false,
            Game: false,
            Leaderboard: false,
            Live: false,
            Settings: false,
            ...action.payload
          };
        })
    }
})

//for dispatch
//example dispatch(MiddleShow({...}))
export const {MiddleShow} = AllData.actions;



//for selector
//example 
export const ShowMidlle = (state) => state.counter.HomeMiddleShow;

//for store.js
export default AllData.reducer;