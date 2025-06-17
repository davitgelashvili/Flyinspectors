import { createSlice } from '@reduxjs/toolkit'

const initialUserData = {
    logedIn: null,
    userData: null,
}

const userData = createSlice({
    name: 'user',
    initialState: initialUserData,
    reducers: {
        changeLogedIn(state, action) {
            state.logedIn = action.payload
        },
        changeUserData(state, action) {
            state.userData = action.payload
        }
    }
})

export const userAction = userData.actions;

export default userData.reducer;