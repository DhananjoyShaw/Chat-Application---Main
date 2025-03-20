import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';

const useGetRealTimeMessage = () => {
    const { selectedUser } = useSelector(store => store.user);
    const { socket } = useSelector(store => store.socket);
    const { selectedGroup } = useSelector(store => store.group);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (selectedUser && (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)) {
                dispatch(setMessages([...messages, newMessage]));
            }
        };

        const handleNewGroupMessage = (newMessage) => {
            if (selectedGroup && newMessage.groupId === selectedGroup._id) {
                dispatch(setMessages([...messages, newMessage]));
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("newGroupMessage", handleNewGroupMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("newGroupMessage", handleNewGroupMessage);
        };
    }, [selectedUser, selectedGroup, messages, dispatch, socket]);

    return null;
};

export default useGetRealTimeMessage;
