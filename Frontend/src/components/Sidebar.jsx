import React, { useState } from "react"
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from "../redux/userSlice.js";
import { setMessages } from "../redux/messageSlice.js";
import { URL } from "../url.js";

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
        <div className="flex flex-col border border-gray-900 p-4 md:h-[85vh] h-[650px] w-[320px]" style={{ borderRight: '1px solid #64748b' }}>
            <form onSubmit={searchSubmitHandler} action="" className="flex items-center gap-1">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered rounded-md" type="text"
                    placeholder="Search..."

                />
                <button type="submit" className="btn bg-zinc-700">
                    <BiSearchAlt2 className="w-5 h-5 outline-none" />
                </button>
            </form>
            <div className="divider px-3"></div>
            <OtherUsers onUserSelect={onUserSelect} />
            <div className="mt-2">
                <button onClick={logoutHandler} className="btn btn-sm bg-purple-600 hover:bg-purple-900">Logout</button>
            </div>
        </div>
    )
}

export default Sidebar;