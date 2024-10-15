import { createSlice } from "@reduxjs/toolkit";

const controlSlice = createSlice({
    name: "control",
    initialState: {
        toolSelected: "mouse",
        menuClick: false
    },
    reducers: {
        setToolSelected: (state, action) => {
            state.toolSelected = action.payload;
        },
        setMenuClick: (state, action) => {
            state.menuClick = action.payload;
        },

    }
});

export const {setToolSelected, setMenuClick} = controlSlice.actions;
export default controlSlice.reducer