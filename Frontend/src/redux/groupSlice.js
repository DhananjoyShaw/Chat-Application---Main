import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: "group",
    initialState: {
        groups: [],
        selectedGroup: null,
    },
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },
    },
});

export const { setGroups, setSelectedGroup } = groupSlice.actions;
export default groupSlice.reducer;
