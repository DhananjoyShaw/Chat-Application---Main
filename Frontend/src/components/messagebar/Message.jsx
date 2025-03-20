import React, { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

const Message = ({ message, isGroup = false }) => {
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);
    const { selectedGroup } = useSelector(store => store.group);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const isOwnMessage = isGroup
        ? message?.senderId?._id === authUser?._id
        : message?.senderId === authUser?._id;

    const getSenderPhoto = () => {
        if (isOwnMessage) return authUser?.profilePhoto;
        return isGroup ? message?.senderId?.profilePhoto : selectedUser?.profilePhoto;
    };

    const getSenderName = () => (isGroup && !isOwnMessage ? message?.senderId?.fullName : "You");

    const getFileDisplay = () => {
        if (!message?.fileUrl) return null;

        const fileType = message?.fileType || '';

        // Handle image files
        if (fileType.startsWith('image/')) {
            return <img src={message.fileUrl} alt="Shared image" className="max-w-full max-h-30 rounded mt-2" />;
        }

        // Handle video files
        if (fileType.startsWith('video/')) {
            return (
                <video controls className="max-w-full max-h-48 rounded mt-2">
                    <source src={message.fileUrl} type={message.fileType} />
                    Your browser does not support the video tag.
                </video>
            );
        }

        // Handle audio files
        if (fileType.startsWith('audio/')) {
            return (
                <audio controls className="max-w-full mt-2">
                    <source src={message.fileUrl} type={message.fileType} />
                    Your browser does not support the audio tag.
                </audio>
            );
        }

        // Handle other file types with download link
        return (
            <div className="flex items-center rounded text-sm p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <a href={message.fileUrl} download={message.fileName || "file"} className="text-blue-300 hover:underline">
                    {message.fileName || "Download File"}
                </a>
            </div>
        );
    };

    return (
        <div ref={scroll} className={`chat ${isOwnMessage ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="User avatar" src={getSenderPhoto()} />
                </div>
            </div>
            <div className="chat-header">
                {isGroup && <span className="mr-2">{getSenderName()}</span>}
                <time className="text-xs opacity-50 text-white">
                    {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
            </div>
            <div className={`chat-bubble ${!isOwnMessage ? 'bg-gray-200 text-black' : ''}`}>
                {message?.message}
                {getFileDisplay()}
            </div>
        </div>
    );
};

export default Message;