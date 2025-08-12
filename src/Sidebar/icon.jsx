import React from 'react';
//top icon import
import { IoPersonOutline, IoChatboxEllipsesOutline } from 'react-icons/io5';
import { RiContactsLine, RiGroupLine } from 'react-icons/ri';
import { SlSettings } from 'react-icons/sl';
//botton icon import
import { BsMotherboard } from 'react-icons/bs';
import { LiaUserEditSolid } from "react-icons/lia";
import { BsGlobe2 } from "react-icons/bs";
import { LuMoon, LuSun } from 'react-icons/lu';
//Avtar icon
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
// flag-icon
import 'flag-icons/css/flag-icons.min.css';


//Top Icon
export const topItems = [
    { id: 0, icon: <IoPersonOutline size={26} />, title: 'Profile', page: 'profile', lable: "Profile" },
    { id: 1, icon: <IoChatboxEllipsesOutline size={27} />, title: 'Chats', page: 'chats', lable: "Chats" },
    { id: 2, icon: <RiGroupLine size={24} />, title: 'Groups', page: 'group', lable: "Groups" },
    { id: 3, icon: <RiContactsLine size={24} />, title: 'Contacts', page: 'contact', lable: "Contacts" },
    { id: 4, icon: <SlSettings size={26} />, title: 'Settings', page: 'setting', lable: "Settings" },
];

// Bottom Icon
export const bottomItems = (theme, setShowLangMenu, dispatch, toggleTheme) => [
    { id: 101, icon: <BsMotherboard size={24} />, title: 'AllUser', page: 'alluser', lable: "All User" },
    { id: 102, icon: <LiaUserEditSolid size={28} />, title: 'Edit', page: 'avtarpage', lable: "Edit Profile" },
    {
        id: 103,
        icon: <BsGlobe2 size={22} />,
        title: 'Language',
        action: () => setShowLangMenu((prev) => !prev),
        lable: "Language"
    },
    {
        id: 104,
        icon: theme === 'dark' ? <LuSun size={24} /> : <LuMoon size={24} />,
        title: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
        action: () => dispatch(toggleTheme()),
        lable: "Dark/Light Mode"
    },
];

// Avatar Icon menu
export const avatarItems = [
    { id: 201, icon: <FiUser />, title: 'Profile', page: 'profile' },
    { id: 202, icon: <FiSettings />, title: 'Settings', page: 'setting' },
    { id: 203, icon: <FiLogOut />, title: 'Logout' },
];

// Language menu list 
export const languages = [
    { code: 'en', label: 'English', flag: 'gb' },
    { code: 'hi', label: 'Hindi', flag: 'in' },
    { code: 'es', label: 'Spanish', flag: 'es' },
    { code: 'ru', label: 'Russian', flag: 'ru' },
    { code: 'de', label: 'German', flag: 'de' },
    { code: 'it', label: 'Italian', flag: 'it' },
    { code: 'gu', label: 'Gujarati', flag: 'in' },
];
