import React, { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from "../../redux/userSlice.js";
import { setMessages } from "../../redux/messageSlice.js";
import { URL } from "../../url.js";
import CreateGroup from "../groups/CreateGroup";
import GroupList from "../groups/GroupList";

const Sidebar = ({ onUserSelect }) => {
    const [search, setSearch] = useState("");
    const { otherUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${URL}/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const conversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));
        if (conversationUser) {
            dispatch(setOtherUsers([conversationUser]));
        } else {
            toast.error("User not found!");
        }
    }

    return (
        <div className="flex flex-col border border-gray-800 p-4 md:h-[85vh] h-[650px] w-[340px]" style={{ borderRight: '1px solid #64748b' }}>
            <form onSubmit={searchSubmitHandler} action="" className="flex items-center gap-1">
                <div className="relative w-full">
                    <input
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="input w-full input-bordered rounded-md placeholder:text-white" type="text" placeholder="Search..."
                    />
                    <button type="submit" className="absolute inset-y-0 end-3"><BiSearchAlt2 className="text-white text-2xl" /></button>
                </div>
            </form>
            <div className="overflow-auto mt-7 flex-1">
                <OtherUsers onUserSelect={onUserSelect} />
                <GroupList />
            </div>
            <div className="mt-2">
                <button onClick={logoutHandler} className="h-8 rounded-md px-2 text-sm text-white bg-purple-500 hover:bg-purple-800">Logout</button>
                <CreateGroup />
            </div>
        </div>
    )
};

export default Sidebar;