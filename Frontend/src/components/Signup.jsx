import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from '../url';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
    gender: "",
  });

  const navigate = useNavigate();

  // Handle Gender Selection (Radio Buttons)
  const handleCheckbox = (e) => {
    setUser({ ...user, gender: e.target.value });
  };

  // Handle Profile Picture Upload
  const handleFileChange = (e) => {
    setUser({ ...user, profilePhoto: e.target.files[0] });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("username", user.username);
      formData.append("password", user.password);
      formData.append("confirmPassword", user.confirmPassword);
      formData.append("gender", user.gender);
      if (user.profilePhoto) {
        formData.append("profilePhoto", user.profilePhoto);
      }

      const res = await axios.post(`${URL}/api/v1/user/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.log(error);
    }

    // Reset form after submission
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      profilePhoto: null,
      gender: "",
    });
  };

  return (
    <div className="min-w-70 sm:min-w-96 sm:mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center text-gray-100'>Signup</h1>
        <form onSubmit={onSubmitHandler} encType="multipart/form-data">
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-gray-100'>Full Name</span>
            </label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Full Name' required />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-gray-100'>Username</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Username' required />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-gray-100'>Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Password' required />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-gray-100'>Confirm Password</span>
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Confirm Password' required />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-gray-100'>Profile Picture</span>
            </label>
            <input type="file" onChange={handleFileChange} accept="image/*" className='w-full file-input' />
          </div>
          <div className='my-4 text-gray-100'>
            <label className='block'>Gender</label>
            <div className='flex items-center gap-4'>
              <label className='flex items-center'>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={user.gender === "male"}
                  onChange={handleCheckbox}
                  className="radio mx-2" />
                Male
              </label>
              <label className='flex items-center'>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={user.gender === "female"}
                  onChange={handleCheckbox}
                  className="radio mx-2" />
                Female
              </label>
            </div>
          </div>
          <p className='text-center my-2 text-gray-100'>
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
          </p>
          <div>
            <button type='submit' className='btn btn-block btn-sm mt-2 bg-purple-600 hover:bg-purple-900 text-gray-100 border border-slate-700'>
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
