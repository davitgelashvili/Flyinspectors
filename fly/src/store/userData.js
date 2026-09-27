import { createSlice } from '@reduxjs/toolkit'

const initialUserData = {
    logedIn: null,
    user: null,
}

const userData = createSlice({
    name: 'user',
    initialState: initialUserData,
    reducers: {
        changeLogedIn(state, action) {
            state.logedIn = action.payload
            if (!action.payload) state.user = null
        },
        // როლი Sidebar-სა და როუტების გასაშუქებლად სჭირდება
        setUser(state, action) {
            state.user = action.payload
            state.logedIn = Boolean(action.payload)
        },
    }
})

export const userAction = userData.actions;

export default userData.reducer;
