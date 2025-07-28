import React from 'react';
import { IoPersonOutline, IoChatboxEllipsesOutline } from 'react-icons/io5';
import { RiContactsLine, RiGroupLine } from 'react-icons/ri';
import { SlSettings } from 'react-icons/sl';
import { BsGlobe2 } from "react-icons/bs";
import { LuMoon, LuSun } from 'react-icons/lu';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { BsMotherboard } from 'react-icons/bs';
import { LiaUserEditSolid } from "react-icons/lia";


{
  /*Top Icon*/
}
export const topItems = [
  { id: 0, icon: <IoPersonOutline size={26} />, title: 'Profile', page: 'profile' },
  { id: 1, icon: <IoChatboxEllipsesOutline size={27} />, title: 'Chats', page: 'chats' },
  { id: 2, icon: <RiGroupLine size={24} />, title: 'Groups', page: 'group' },
  { id: 3, icon: <RiContactsLine size={24} />, title: 'Contacts', page: 'contact' },
  { id: 4, icon: <SlSettings size={26} />, title: 'Settings', page: 'setting' },
];

{
  /*Bottom Icon*/
}
export const bottomItems = (theme, setShowLangMenu, dispatch, toggleTheme) => [
  { id: 100, icon: <BsMotherboard size={24} />, title: 'AllUser', page: 'alluser' },
  { id: 101, icon: <LiaUserEditSolid size={28} />, title: 'Edit', page: 'avtarpage' },
  {
    id: 102,
    icon: <BsGlobe2 size={22} />,
    title: 'Language',
    action: () => setShowLangMenu((prev) => !prev),
  },
  {
    id: 103,
    icon: theme === 'dark' ? <LuSun size={24} /> : <LuMoon size={24} />,
    title: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
    action: () => dispatch(toggleTheme()),
  },
];

{
  /*Avatar Icon menu*/
}
export const avatarItems = [
  { id: 0, icon: <FiUser />, title: 'Profile', page: 'profile' },
  { id: 1, icon: <FiSettings />, title: 'Settings', page: 'setting' },
  { id: 2, icon: <FiLogOut />, title: 'Logout' },
];

{
  /*Language list*/
}
export const languages = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'hi', label: 'Hindi', flag: 'in' },
  { code: 'es', label: 'Spanish', flag: 'es' },
  { code: 'ru', label: 'Russian', flag: 'ru' },
  { code: 'de', label: 'German', flag: 'de' },
  { code: 'it', label: 'Italian', flag: 'it' },
  { code: 'gu', label: 'Gujarati', flag: 'in' },
];
