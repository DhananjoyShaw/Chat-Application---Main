import React from 'react';
import Message from './Message';
import useGetMessages from '../../hooks/useGetMessages';
import useGetGroupMessages from '../../hooks/useGetGroupMessages';
import useGetRealTimeMessage from '../../hooks/useGetRealTimeMessage';
import { useSelector } from "react-redux";

const Messages = ({ isGroup = false }) => {
    const { messages } = useSelector(store => store.message);

    // Always call all hooks, but only use their effects conditionally
    // const userMessagesResult = useGetMessages();
    // const groupMessagesResult = useGetGroupMessages();
    useGetMessages();
    useGetGroupMessages();
    useGetRealTimeMessage();

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {messages && messages.map((message) => (
                <Message
                    key={message._id}
                    message={message}
                    isGroup={isGroup}
                />
            ))}
        </div>
    );
};

export default Messages;