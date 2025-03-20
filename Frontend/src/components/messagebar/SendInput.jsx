import React, { useState } from 'react';
import { IoSend, IoAttach, IoClose } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from '../../redux/messageSlice';
import { URL } from '../../url';

const SendInput = ({ isGroup = false }) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const dispatch = useDispatch();
    const { selectedUser, authUser } = useSelector(store => store.user);
    const { selectedGroup } = useSelector(store => store.group);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim() && !file) return;

        const formData = new FormData();
        formData.append('message', message);
        if (file) {
            formData.append('file', file);
        }

        try {
            let res;

            if (isGroup && selectedGroup) {
                res = await axios.post(`${URL}/api/v1/group/sendmessages/${selectedGroup._id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        withCredentials: true
                    }
                );
                console.log("Group Message Response:", res.data);

                const formattedMessage = { ...res.data, senderId: res.data.senderId || authUser._id };
                dispatch(setMessages([...messages, formattedMessage]));

            } else if (selectedUser) {
                res = await axios.post(`${URL}/api/v1/message/send/${selectedUser._id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        withCredentials: true
                    }
                );

                const newMessage = res?.data?.newMessage;
                if (newMessage) {
                    dispatch(setMessages([...messages, newMessage]));
                }
            }
        } catch (error) {
            console.log(error);
        }

        setMessage("");
        setFile(null);
        setFilePreview(null);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Create file preview
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreview(e.target.result);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(null);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        setFilePreview(null);
    };

    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            <div className='w-full relative'>

                {/* for attaching files */}
                {file && (
                    <div className="mb-2 flex items-center bg-gray-700 rounded p-2">
                        {filePreview ? (
                            <img src={filePreview} alt="File preview" className="h-12 w-12 object-cover rounded mr-2" />
                        ) : (
                            <div className="h-12 w-12 bg-gray-600 rounded flex items-center justify-center mr-2"><IoAttach className="text-xl" /></div>
                        )}
                        <div className="flex-1 text-sm text-white truncate"> {file.name}</div>
                        <button type="button" onClick={removeFile} className="text-white hover:text-red-400 ml-2"><IoClose className="text-2xl" /></button>
                    </div>
                )}

                {/* normal texting  */}
                <div className="relative">
                    <input
                        value={message} onChange={(e) => setMessage(e.target.value)} type="text"
                        placeholder={isGroup ? 'Message to group...' : 'Send a message...'}
                        className='border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 placeholder:text-white text-white'
                    />
                    <input type="file" id="file-input" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="file-input" className="absolute flex inset-y-0 end-10 items-center pr-1 cursor-pointer text-white hover:text-blue-300">
                        <IoAttach className="text-2xl" />
                    </label>
                    <button type="submit" className='absolute flex inset-y-0 end-0 items-center text-lg pr-4 text-white hover:text-blue-300'><IoSend /></button>
                </div>
            </div>
        </form>
    );
};

export default SendInput;