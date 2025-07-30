// Sidebar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../feature/Slice/Auth/AuthSlice';
import { toggleTheme } from '../feature/Slice/Theme/ThemeSlice';
import { topItems, bottomItems, avatarItems, languages } from './Side panel/Icon';
import './Side panel/Css/Slidebar.css';
import 'flag-icons/css/flag-icons.min.css';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.mode);
  const { userData: user, loading, error } = useSelector((state) => state.loginuser);

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const [clickEffect, setClickEffect] = useState(() => {
    const currentPath = location.pathname.split('/')[1];
    const allTabs = [...topItems, ...bottomItems(theme, setShowLangMenu, dispatch, toggleTheme)];
    const match = allTabs.find((item) => item.page === currentPath);
    return match ? match.id : null;
  });

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    const allTabs = [...topItems, ...bottomItems(theme, setShowLangMenu, dispatch, toggleTheme)];
    const match = allTabs.find((item) => item.page === currentPath);
    if (match) {
      setClickEffect(match.id);
      localStorage.setItem('activeTab', match.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, theme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAvatarMenu, showLangMenu]);

  const getButtonClass = (id) => {
    const base = 'relative p-2 rounded-xl overflow-hidden transition-transform duration-300 transform hover:scale-115 cursor-pointer';
    const common = 'hover:text-blue-600 dark:hover:text-[var(--text-color1)]';
    const isActive = clickEffect === id;
    if (isActive) {
      return theme === 'dark'
        ? `${base} invisible-animated-border text-[var(--text-color1)] ${common}`
        : `${base} text-blue-600 bg-blue-100 border border-blue-600 ${common}`;
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

  const bottomMenuItems = bottomItems(theme, setShowLangMenu, dispatch, toggleTheme);

  return (
    <div className="bg-[#f7f7ff] dark:bg-[var(--primary-color)] w-full">
      <div className="relative w-full h-full md:h-screen flex flex-col md:justify-between md:py-4 py-2 items-center shadow-md">

        {/* Logo (Only on Desktop) */}
        <div className="hidden md:flex justify-center">
          <img src="/Img/logo.jpg" alt="Logo" />
        </div>

        {/* Top Menu */}
        <ul className="flex md:flex-col flex-row items-center md:gap-4 gap-2 mt-2">
          {topItems.map(({ icon, title, page, id }) => (
            <li key={id} className="relative group">
              <button onClick={() => bghandleClick(id, page)} className={getButtonClass(id)}>
                {icon}
              </button>
              <div className="absolute left-12 -translate-y-1/2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md transition-opacity duration-300">
                {title}
              </div>
            </li>
          ))}

          {/* Avatar on Mobile */}
          <li className="relative md:hidden ml-2">
            <button onClick={() => { setShowAvatarMenu(prev => !prev); setShowLangMenu(false); }}
              className="w-9 h-9 rounded-full border-2 border-[#d2d2cf] dark:border-[var(--text-color)] shadow-md hover:scale-125 transition-transform">
              <img src={user?.profile_avatar || 'https://via.placeholder.com/100'} alt="User" className="w-full h-full object-cover rounded-full" />
            </button>
          </li>
        </ul>

        {/* Bottom Menu (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center relative mt-auto">
          <ul className="flex flex-col gap-3">
            {bottomMenuItems.map(({ id, icon, title, action, page }) => (
              <li key={id} className="relative group">
                <button onClick={() => {
                  if (action) action();
                  else if (page) {
                    navigate(`/${page}`);
                    setClickEffect(id);
                    localStorage.setItem('activeTab', id);
                  }
                  setShowAvatarMenu(false);
                }} className={getButtonClass(id)}>
                  {icon}
                </button>
                <div className="absolute left-12 top-1/2 -translate-y-1/2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md transition-opacity duration-300">
                  {title}
                </div>
              </li>
            ))}
          </ul>

          {/* Language Menu */}
          {showLangMenu && (
            <div ref={langMenuRef}
              className="absolute bottom-24 left-16 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
              <ul className="p-2">
                {languages.map((lang) => (
                  <li key={lang.code} onClick={() => { setShowLangMenu(false); }}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-md">
                    <span className={`fi fi-${lang.flag} w-5 h-5`}></span>
                    <span>{lang.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avatar Dropdown */}
          <div className="mt-8 relative">
            <button onClick={() => { setShowAvatarMenu(prev => !prev); setShowLangMenu(false); }}
              className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-[var(--text-color)] shadow-md hover:scale-125 transition-transform">
              <img src={user?.profile_avatar || 'https://via.placeholder.com/100'} alt="User" className="w-full h-full object-cover rounded-full" />
            </button>

            {showAvatarMenu && (
              <div className="absolute left-14 bottom-0 w-44 bg-white border border-blue-300 rounded-md shadow-lg z-50" ref={menuRef}>
                <ul className="p-2">
                  {avatarItems.map(({ icon, title, id, page }) => (
                    <li key={id} className="flex flex-col">
                      {title === 'Logout' && <hr className="border-gray-300 my-0" />}
                      <div onClick={() => {
                        if (title === 'Logout') {
                          dispatch(logout());
                          navigate('/login');
                        } else if (page) {
                          navigate(`/${page}`);
                        }
                        setShowAvatarMenu(false);
                      }} className="flex items-center gap-6 p-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700">
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
