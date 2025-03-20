import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "../../uiShadcn/ui/button";
import { Input } from "../../uiShadcn/ui/input";
import { Checkbox } from "../../uiShadcn/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../uiShadcn/ui/card";
import { setGroups } from '../../redux/groupSlice';
import { URL } from '../../url';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupPhoto, setGroupPhoto] = useState(null);
    const [showCard, setShowCard] = useState(false);

    const cardRef = useRef(null);

    const dispatch = useDispatch();
    const { otherUsers } = useSelector(store => store.user);
    const { groups } = useSelector(store => store.group);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", groupName);
            formData.append("members", JSON.stringify(selectedMembers));
            if (groupPhoto) {
                formData.append("groupPhoto", groupPhoto);
            }

            const res = await axios.post(`${URL}/api/v1/group/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            dispatch(setGroups([...groups, res?.data]));
            setGroupName('');
            setSelectedMembers([]);
            setGroupPhoto(null);
            setShowCard(false);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const handleMemberToggle = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setGroupPhoto(file);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setShowCard(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block">
            <Button variant="custom" size="custom" onClick={() => setShowCard(!showCard)} className="ml-2"> Create Group </Button>

            {showCard && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div ref={cardRef} className="w-96 shadow-lg rounded-lg">
                        <Card>
                            <CardHeader><CardTitle>Create New Group</CardTitle></CardHeader>
                            <CardContent>
                                <form id="createGroupForm" onSubmit={handleCreateGroup} className="space-y-4">
                                    <Input
                                        placeholder="Enter group name..." value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)} className="w-full"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium mt-7 text-gray-300">Group Photo</label>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 mb-8 block w-full" />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto border rounded p-2">
                                        {otherUsers && otherUsers.length > 0 ? (
                                            otherUsers.map(user => (
                                                <div key={user._id} className="flex items-center space-x-2 py-1">
                                                    <Checkbox
                                                        id={user._id}
                                                        checked={selectedMembers.includes(user._id)}
                                                        onCheckedChange={() => handleMemberToggle(user._id)}
                                                    />
                                                    <label htmlFor={user._id} className="text-sm cursor-pointer">{user.username || user.fullName}</label>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-300">No other users available</p>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-between mt-3">
                                <Button variant="custom" size="custom" onClick={() => setShowCard(false)}>Cancel</Button>
                                <Button type="submit" variant="custom" size="custom" form="createGroupForm" disabled={!groupName.trim() || selectedMembers.length === 0} >Create</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGroup;

