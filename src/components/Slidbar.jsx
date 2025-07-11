import React, { useState, useRef, useEffect } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { PiChatText } from 'react-icons/pi';
import { RiContactsLine } from "react-icons/ri";
import { SlSettings } from 'react-icons/sl';
import { MdOutlineLanguage } from 'react-icons/md';
import { LuMoon } from 'react-icons/lu';
import { RiGroupLine } from 'react-icons/ri';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { TbUserPlus } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../feature/Slice/AuthSlice';
import { fetchLoginUser } from "../feature/Slice/LoginUserSlice";
import { FaUsers } from "react-icons/fa";
import 'flag-icons/css/flag-icons.min.css';

function Sidebar() {
    // { setActivePage }
    // console.log('✌️setActivePage --->', setActivePage);

    const [clickEffect, setClickEffect] = useState(null);           // Icon Clike Effect
    const [showLangMenu, setShowLangMenu] = useState(false);        //language Menu
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);    //Avtar Menu

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //login user data Api call
    useEffect(() => {
        dispatch(fetchLoginUser());
    }, [dispatch]);


    //login User data Slice  
    const { userData: user } = useSelector((state) => state.loginuser);

    //Clike Event
    const menuRef = useRef();
    const langMenuRef = useRef();

    useEffect(() => {
        const handleClickAnywhere = (event) => {
            if (showAvatarMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowAvatarMenu(false);
            }

            if (showLangMenu && langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setShowLangMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickAnywhere);
        return () => {
            document.removeEventListener('mousedown', handleClickAnywhere);
        };
    }, [showAvatarMenu, showLangMenu]);

    //MIAN ICON 
    const bghandleClick = (index, page) => {
        setClickEffect(index);
        navigate(`/${page}`); // Navigate to route (this will auto trigger rendering in ChatContainer)
        setShowLangMenu(false);
        setShowAvatarMenu(false);
    };

    //LanguageMenu
    const toggleLanguageMenu = () => {
        setShowLangMenu(prev => {
            if (!prev) {
                setShowAvatarMenu(false);
            }
            return !prev;
        });
    };

    //AvtarMenu
    const toggleAvatarMenu = () => {
        setShowAvatarMenu(prev => !prev);
        setShowLangMenu(false);
    };

    //languages list menu
    const languages = [
        { code: 'en', label: 'English', flag: 'gb' },
        { code: 'hi', label: 'Hindi', flag: 'in' },
        { code: 'es', label: 'Spanish', flag: 'es' },
        { code: 'ru', label: 'Russian', flag: 'ru' },
        { code: 'de', label: 'German', flag: 'de' },
        { code: 'it', label: 'Italian', flag: 'it' },
        { code: 'gu', label: 'Gujarati', flag: 'in' }
    ];


    //top Icon
    const topItems = [
        { id: 0, icon: <IoPersonOutline size={26} />, title: 'Profile', page: 'profile' },
        { id: 1, icon: <PiChatText size={26} />, title: 'Chats', page: 'chats' },
        { id: 2, icon: <RiGroupLine size={24} />, title: 'Groups', page: 'group' },
        { id: 3, icon: <RiContactsLine size={24} />, title: 'Contacts', page: 'contact' },
        { id: 4, icon: <SlSettings size={26} />, title: 'Settings', page: 'setting' },
    ];

    //bottom Icon
    const bottomItems = [
        { id: 0, icon: <FaUsers size={25} />, tital: 'AllUser', page: 'alluser' },
        { id: 1, icon: <TbUserPlus size={26} />, title: 'Edit', page: 'avtarpage' },
        { id: 2, icon: <MdOutlineLanguage size={26} />, title: 'Language', action: toggleLanguageMenu },
        { id: 3, icon: <LuMoon size={24} />, title: 'Dark Mode', action: () => console.log("Toggle dark mode") },
    ];

    //Avtar Menu Icon
    const avatarItems = [
        { id: 0, icon: <FiUser />, title: 'Profile', page: 'profile' },
        { id: 1, icon: <FiSettings />, title: 'Settings', page: 'setting' },
        { id: 2, icon: <FiLogOut />, title: 'Logout' },
    ];

    return (
        <div className="relative w-full h-screen bg-white flex flex-col items-center justify-between py-4 shadow-md">
            {/* Logo */}
            <div className="items-center justify-cente borde">
                <img src="/Img/logo.jpg" alt="Logo" />
            </div>

            {/* Top Icons */}
            <div>
                <ul className="flex flex-col gap-4 mt-3">
                    {topItems.map(({ icon, title, page, id }) => (
                        <li key={id} className="relative group">
                            <button
                                onClick={() => bghandleClick(id, page)}
                                className={`p-2 ${clickEffect === id ?
                                    'bg-blue-100 text-blue-600 border border-blue-200 rounded-md cursor-pointer'
                                    : 'text-gray-500'} hover:text-blue-600 transition-transform duration-300 transform hover:scale-115 cursor-pointer`}
                            >
                                {icon}
                            </button>
                            {/* Tooltip */}
                            <div className="absolute left-12 -translate-y-1/2 z-10 invisible group-hover:visible 
              opacity-0 group-hover:opacity-100 inline-block px-3 py-2 text-sm font-medium
              text-white bg-gray-900 rounded-lg shadow-md transition-opacity duration-300">
                                {title}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bottom Icons */}
            <div className="flex flex-col items-center relative ">
                <ul className="flex flex-col gap-3">
                    {bottomItems.map(({ id, icon, title, action, page }) => (
                        <li key={id} className="relative group">
                            <button
                                onClick={() => {
                                    if (action) action();
                                    else if (page) {
                                        navigate(`/${page}`);
                                        setClickEffect(id);
                                    }
                                    setShowAvatarMenu(false);
                                }}
                                className="text-gray-500 hover:text-blue-600 p-2 transition-transform duration-300 
        transform hover:scale-125 rounded-md cursor-pointer"
                            >
                                {icon}
                            </button>

                            {/* Tooltip */}
                            <div className="absolute left-12 top-1/2 -translate-y-1/2 z-10 invisible 
      group-hover:visible opacity-0 group-hover:opacity-100 inline-block px-3 py-2 text-sm 
      font-medium text-white bg-gray-900 rounded-lg shadow-md transition-opacity duration-300">
                                {title}
                            </div>
                        </li>
                    ))}

                </ul>

                {/* Language Menu */}
                {showLangMenu && (
                    <div
                        ref={langMenuRef}
                        className="absolute bottom-24 left-16 w-40 bg-white border border-gray-200 
      rounded-md shadow-lg z-50 transition-all duration-200 ease-out"
                    >
                        <ul className="p-2">
                            {languages.map((lang) => (
                                <li
                                    key={lang.code}
                                    onClick={() => {
                                        console.log("Selected:", lang);
                                        setShowLangMenu(false);
                                    }}
                                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 
            text-sm text-gray-700"
                                >
                                    <span className={`fi fi-${lang.flag} w-5 h-5`}></span>
                                    <span>{lang.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}



                {/* Avatar */}
                <div className="mt-8 relative">
                    <button
                        onClick={toggleAvatarMenu}
                        className="w-12 h-12 rounded-full border-3 border-gray-300 shadow-md transition-transform duration-300 transform hover:scale-125 cursor-pointer"
                    >
                        <img
                            src={user?.profile_avatar || "https://via.placeholder.com/100"}
                            alt="User"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </button>

                    {/* Avatar Menu */}
                    {showAvatarMenu && (
                        <div className="absolute left-14 bottom-0 w-35 bg-white border border-blue-300 rounded-md shadow-lg z-50"
                            ref={menuRef}
                        >
                            <ul className="p-2">
                                {avatarItems.map(({ icon, title, id, page }) => (
                                    <li key={id} className="flex flex-col">
                                        {title === "Logout" && <hr className=" border-gray-300 my-0" />}
                                        <div
                                            className="flex items-center gap-6 p-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                                            onClick={() => {
                                                // console.log("Clicked avatar item:", title);
                                                if (title === "Logout") {
                                                    dispatch(logout());
                                                    navigate('/login');
                                                } else if (page) {
                                                    // console.log("Navigating to page:", page);
                                                    // setActivePage(page);
                                                    navigate(`/${page}`);
                                                }
                                                setShowAvatarMenu(false);
                                            }}
                                        >
                                            <div className="text-blue-500" size={24}>{icon}</div>
                                            <div>{title}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
