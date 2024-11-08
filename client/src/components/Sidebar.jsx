import React, { useContext } from 'react';
import { AuthContent } from '../context/AuthContent.jsx';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { MdHealthAndSafety, MdMenu } from 'react-icons/md';
import { FaUserDoctor } from "react-icons/fa6";

const Sidebar = ({ savedContent, isOpen, onItemClick, selectedItem }) => {
  const { user, logout } = useContext(AuthContent);
  
  const navigate = useNavigate();

  const handleItemClick = (item) => onItemClick(item);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
    className={`fixed top-0 left-0 h-full transition-transform transform ${
      isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-16'
    } bg-gray-800 text-white z-50`}
  >
    <div className="flex items-center justify-between px-4 py-3 bg-indigo-600">
      <div className="flex items-center space-x-4">
        <FaUserDoctor className="text-3xl" />
        {isOpen && <span className="text-xl font-bold">MedicineBot</span>}
      </div>
      {/* <button
        onClick={toggleSidebar}
        className="text-white hover:text-gray-300 focus:outline-none transition"
      >
        {isOpen ? '❮' : '❯'}
      </button> */}
    </div>
    {user ? (
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-gray-700 rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Your Saved Content</h2>
          {savedContent.length === 0 ? (
            <p className="text-gray-300">No saved content to display.</p>
          ) : (
            <div className="space-y-2">
              {savedContent
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border cursor-pointer hover:bg-indigo-500 transition ${
                      selectedItem === item ? 'bg-indigo-500 text-white' : 'bg-gray-800 border-gray-600'
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="font-medium">{item.medicineName}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="p-4 flex flex-col items-center space-y-3">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </div>
    )}
    {user && (
      <div className="bg-gray-700 p-4 mt-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaUser className="text-lg" />
          {isOpen && <span className="text-white font-medium">{user.username}</span>}
        </div>
        <FaSignOutAlt
          className="text-lg cursor-pointer hover:text-red-500 transition"
          onClick={handleLogout}
        />
      </div>
    )}
  </div>
  );
};

export default Sidebar;
