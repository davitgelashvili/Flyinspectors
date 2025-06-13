import { createSlice } from '@reduxjs/toolkit'

const initialUserData = {
    logedIn: null,
}

const userData = createSlice({
    name: 'user',
    initialState: initialUserData,
    reducers: {
        changeLogedIn(state, action) {
            state.logedIn = action.payload
        }
    }
})

export const userAction = userData.actions;

export default userData.reducer;