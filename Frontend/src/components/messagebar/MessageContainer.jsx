import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { setSelectedUser } from "../../redux/userSlice";
import { setSelectedGroup } from "../../redux/groupSlice";
import { useSelector, useDispatch } from "react-redux";

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const { selectedGroup } = useSelector(store => store.group);
    const dispatch = useDispatch();

    // Handle switching between user and group chats
    useEffect(() => {
        if (selectedUser) {
            dispatch(setSelectedGroup(null));
        }
    }, [selectedUser, dispatch]);

    useEffect(() => {
        if (selectedGroup) {
            dispatch(setSelectedUser(null));
        }
    }, [selectedGroup, dispatch]);

    const isOnline = selectedUser && onlineUsers?.includes(selectedUser?._id);

    return (
        <>
            {selectedUser ? (
                <div className="flex flex-col md:min-w-[640px] md:h-[85vh] h-[650px] w-[320px] border border-gray-800">
                    <div className="flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2">
                        <div className={`avatar ${isOnline ? "online" : ""}`}>
                            <div className="w-12 h-12">
                                <img src={selectedUser?.profilePhoto} alt="user-profile" className="w-12 h-12 rounded-full object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p>{selectedUser?.fullName}</p>
                        </div>
                    </div>
                    <Messages isGroup={false} />
                    <SendInput isGroup={false} />
                </div>
            ) : selectedGroup ? (
                <div className="flex flex-col md:min-w-[640px] md:h-[85vh] h-[650px] w-[320px] border border-gray-800">
                    <div className="flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2">
                        <div className="w-12 h-12 ">
                            <img src={selectedGroup?.groupPhoto} alt="user-profile" className="w-12 h-12 rounded-full object-cover" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="text-lg font-bold">{selectedGroup?.name}</p>
                            <p className="text-sm text-gray-400">
                                {selectedGroup?.members?.length} members
                            </p>
                        </div>
                    </div>
                    <Messages isGroup={true} />
                    <SendInput isGroup={true} />
                </div>
            ) : (
                <div className="md:min-w-[640px] flex flex-col justify-center items-center w-full h-full text-center ">
                    <h1 className="text-4xl text-white font-bold">Hi, {authUser?.fullName}</h1>
                    <h1 className="text-2xl text-white">Let's start a conversation</h1>
                </div>
            )}
        </>
    );
};

export default MessageContainer;