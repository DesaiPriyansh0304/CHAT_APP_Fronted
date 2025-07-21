import React, { useState, useRef, useEffect } from 'react';
import { IoPersonOutline, IoChatboxEllipsesOutline } from 'react-icons/io5';
import { RiContactsLine, RiGroupLine } from "react-icons/ri";
import { SlSettings } from 'react-icons/sl';
import { MdOutlineLanguage } from 'react-icons/md';
import { LuMoon, LuSun } from 'react-icons/lu';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { BsMotherboard } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../feature/Slice/Auth/AuthSlice';
import { fetchLoginUser } from "../feature/Slice/Auth/LoginUserSlice";
import { toggleTheme } from '../feature/Slice/Theme/ThemeSlice';
import "./Slidebar/css/Slidebar.css";
import 'flag-icons/css/flag-icons.min.css';

function Sidebar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    {/*theme slice*/ }
    const theme = useSelector((state) => state.theme.mode);

    const { userData: user, loading, error } = useSelector((state) => state.loginuser); //login user data
    // console.log('loading --->/Slidbar', loading);
    // console.log('error --->/Slidbar', error);

    const [showLangMenu, setShowLangMenu] = useState(false);              //show lung menu
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);          //show avtar menu

    {/*top menu icon*/ }
    const topItems = [
        { id: 0, icon: <IoPersonOutline size={26} />, title: 'Profile', page: 'profile' },
        { id: 1, icon: <IoChatboxEllipsesOutline size={27} />, title: 'Chats', page: 'chats' },
        { id: 2, icon: <RiGroupLine size={24} />, title: 'Groups', page: 'group' },
        { id: 3, icon: <RiContactsLine size={24} />, title: 'Contacts', page: 'contact' },
        { id: 4, icon: <SlSettings size={26} />, title: 'Settings', page: 'setting' },
    ];
    {/*bottom menu icon*/ }
    const bottomItems = [
        { id: 100, icon: <BsMotherboard size={24} />, title: 'AllUser', page: 'alluser' },
        { id: 101, icon: <FaRegEdit size={26} />, title: 'Edit', page: 'avtarpage' },
        { id: 102, icon: <MdOutlineLanguage size={26} />, title: 'Language', action: () => setShowLangMenu(p => !p) },
        {
            id: 103,
            icon: theme === 'dark' ? <LuSun size={24} /> : <LuMoon size={24} />,
            title: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
            action: () => dispatch(toggleTheme()),
        },
    ];

    {/*Avtar menu icon*/ }
    const avatarItems = [
        { id: 0, icon: <FiUser />, title: 'Profile', page: 'profile' },
        { id: 1, icon: <FiSettings />, title: 'Settings', page: 'setting' },
        { id: 2, icon: <FiLogOut />, title: 'Logout' },
    ];

    {/*language menu with flge*/ }
    const languages = [
        { code: 'en', label: 'English', flag: 'gb' },
        { code: 'hi', label: 'Hindi', flag: 'in' },
        { code: 'es', label: 'Spanish', flag: 'es' },
        { code: 'ru', label: 'Russian', flag: 'ru' },
        { code: 'de', label: 'German', flag: 'de' },
        { code: 'it', label: 'Italian', flag: 'it' },
        { code: 'gu', label: 'Gujarati', flag: 'in' }
    ];

    // Detect active tab on initial render based on route
    const [clickEffect, setClickEffect] = useState(() => {
        const currentPath = location.pathname.split("/")[1];
        const allTabs = [...topItems, ...bottomItems];
        const match = allTabs.find(item => item.page === currentPath);
        return match ? match.id : null;
    });

    // Update active tab on route change
    useEffect(() => {
        const currentPath = location.pathname.split("/")[1]; // e.g. 'chats'
        const allTabs = [...topItems, ...bottomItems];
        const match = allTabs.find(item => item.page === currentPath);
        if (match) {
            setClickEffect(match.id);
            localStorage.setItem("activeTab", match.id);
        }
    }, [location]);

    {/*LoginUserSlice API Call*/ }
    useEffect(() => {
        dispatch(fetchLoginUser());
    }, [dispatch]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const menuRef = useRef();
    const langMenuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showAvatarMenu && menuRef.current && !menuRef.current.contains(e.target)) {
                setShowAvatarMenu(false);
            }
            if (showLangMenu && langMenuRef.current && !langMenuRef.current.contains(e.target)) {
                setShowLangMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAvatarMenu, showLangMenu]);

    const getButtonClass = (id) => {
        const base = "relative p-2 rounded-xl overflow-hidden transition-transform duration-300 transform hover:scale-115 cursor-pointer";
        const common = "hover:text-blue-600 dark:hover:text-[var(--text-color1)] ";
        const isActive = clickEffect === id;

        if (isActive) {
            if (theme === 'dark') {
                return `${base} invisible-animated-border text-[var(--text-color1)] ${common}`;
            } else {
                return `${base} text-blue-600 bg-blue-100 border border-blue-600 ${common}`;
            }
        } else {
            return `${base} text-gray-500 dark:text-[var(--text-color)] ${common}`;
        }
    };

    const bghandleClick = (id, page) => {
        setClickEffect(id);
        localStorage.setItem('activeTab', id);
        navigate(`/${page}`);
        setShowLangMenu(false);
        setShowAvatarMenu(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='dark:bg-[var(--primary-color)]'>
            <div className="relative w-full h-screen flex flex-col items-center justify-between py-4 shadow-md">
                <div className="items-center justify-center">
                    <img src="/Img/logo.jpg" alt="Logo" />
                </div>

                <div>
                    <ul className="flex flex-col gap-4 mt-3">
                        {topItems.map(({ icon, title, page, id }) => (
                            <li key={id} className="relative group">
                                <button onClick={() => bghandleClick(id, page)} className={getButtonClass(id)}>
                                    <span className="relative z-10">{icon}</span>
                                </button>
                                <div className="absolute left-12 -translate-y-1/2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md transition-opacity duration-300">
                                    {title}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-center relative">
                    <ul className="flex flex-col gap-3">
                        {bottomItems.map(({ id, icon, title, action, page }) => (
                            <li key={id} className="relative group dark:text-[var(--text-color)]">
                                <button
                                    onClick={() => {
                                        if (action) action();
                                        else if (page) {
                                            navigate(`/${page}`);
                                            setClickEffect(id);
                                            localStorage.setItem("activeTab", id);
                                        }
                                        setShowAvatarMenu(false);
                                    }}
                                    className={getButtonClass(id)}
                                >
                                    {icon}
                                </button>
                                <div className="absolute left-12 top-1/2 -translate-y-1/2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md transition-opacity duration-300">
                                    {title}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Language Menu */}
                    {showLangMenu && (
                        <div
                            ref={langMenuRef}
                            className="absolute bottom-24 left-16 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700"
                        >
                            <ul className="p-2">
                                {languages.map((lang) => (
                                    <li
                                        key={lang.code}
                                        onClick={() => {
                                            console.log("Selected:", lang);
                                            setShowLangMenu(false);
                                        }}
                                        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-md"
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
                            onClick={() => {
                                setShowAvatarMenu((prev) => !prev);
                                setShowLangMenu(false);
                            }}
                            className="w-12 h-12 rounded-full border-3 border-gray-300  dark:border-[var(--text-color)] shadow-md transition-transform duration-300 transform hover:scale-125 cursor-pointer"
                        >
                            <img
                                src={user?.profile_avatar || "https://via.placeholder.com/100"}
                                alt="User"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </button>

                        {showAvatarMenu && (
                            <div className="absolute left-14 bottom-0 w-35 bg-white border border-blue-300 rounded-md shadow-lg z-50" ref={menuRef}>
                                <ul className="p-2">
                                    {avatarItems.map(({ icon, title, id, page }) => (
                                        <li key={id} className="flex flex-col">
                                            {title === "Logout" && <hr className="border-gray-300 my-0" />}
                                            <div
                                                className="flex items-center gap-6 p-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
                                                onClick={() => {
                                                    if (title === "Logout") {
                                                        dispatch(logout());
                                                        navigate('/login');
                                                    } else if (page) {
                                                        navigate(`/${page}`);
                                                    }
                                                    setShowAvatarMenu(false);
                                                }}
                                            >
                                                <div className="text-blue-500">{icon}</div>
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
        </div>
    );
}

export default Sidebar;
