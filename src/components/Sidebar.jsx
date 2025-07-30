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
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Active tab tracking
  const [clickEffect, setClickEffect] = useState(() => {
    const currentPath = location.pathname.split('/')[1];
    const allTabs = [...topItems, ...bottomItems(theme, setShowLangMenu, dispatch, toggleTheme)];
    const match = allTabs.find((item) => item.page === currentPath);
    return match ? match.id : null;
  });

  // Active tab update
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

  // Dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const menuRef = useRef();
  const langMenuRef = useRef();

  // Click outside handler
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
    const base = 'relative p-2 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-110 cursor-pointer';
    const common = 'hover:text-blue-600 dark:hover:text-[var(--text-color1)]';
    const isActive = clickEffect === id;

    if (isActive) {
      return theme === 'dark'
        ? `${base} invisible-animated-border text-[var(--text-color1)] ${common}`
        : `${base} text-blue-600 bg-blue-100 border border-blue-600 px-3 py-2.5 ${common}`;
    } else {
      return `${base} text-gray-500 dark:text-[var(--text-color)] ${common}`;
    }
  };

  // Tooltip component
  const Tooltip = ({ children, text, position = "right", show = false }) => {
    if (!text || !show) return children;

    const getTooltipClasses = () => {
      const baseClasses = "absolute z-[9999] px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg transition-all duration-200 opacity-100 visible whitespace-nowrap";

      switch (position) {
        case 'right':
          return `${baseClasses} left-full ml-3 top-1/2 -translate-y-1/2`;
        case 'left':
          return `${baseClasses} right-full mr-3 top-1/2 -translate-y-1/2`;
        case 'top':
          return `${baseClasses} bottom-full mb-2 left-1/2 -translate-x-1/2`;
        case 'bottom':
          return `${baseClasses} top-full mt-2 left-1/2 -translate-x-1/2`;
        default:
          return `${baseClasses} left-full ml-3 top-1/2 -translate-y-1/2`;
      }
    };

    return (
      <div className="relative group">
        {children}
        <div className={getTooltipClasses()}>
          {text}
          {/* Tooltip arrow */}
          <div className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 ${position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' :
            position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
              position === 'top' ? 'left-1/2 -translate-x-1/2 -bottom-1' :
                'left-1/2 -translate-x-1/2 -top-1'
            }`}></div>
        </div>
      </div>
    );
  };

  // Tab click handler
  const handleTabClick = (id, page) => {
    setClickEffect(id);
    localStorage.setItem('activeTab', id);
    navigate(`/${page}`);
    setShowLangMenu(false);
    setShowAvatarMenu(false);
    setHoveredItem(null);
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
        <ul className={`flex ${isMobile ? 'flex-row gap-4 mb-2 mt-1' : 'flex-col gap-4 mt-6'} items-center`}>
          {topItems.map(({ icon, lable, page, id }) => (
            <li key={id} className="relative">
              <Tooltip
                text={lable}
                position="right"
                show={hoveredItem === `top-${id}` && !isMobile}
              >
                <button
                  onClick={() => handleTabClick(id, page)}
                  className={getButtonClass(id)}
                  onMouseEnter={() => setHoveredItem(`top-${id}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {icon}
                </button>
              </Tooltip>
            </li>
          ))}

          {/* Avatar on Mobile */}
          {isMobile && (
            <li className="relative ml-2">
              <button
                onClick={() => {
                  console.log('Avatar clicked, current state:', showAvatarMenu); // Debug log
                  setShowAvatarMenu(prev => !prev);
                  setShowLangMenu(false);
                  setHoveredItem(null);
                }}
                className="w-11 h-11 rounded-full border-2 border-[#d2d2cf] dark:border-[var(--text-color)] shadow-md hover:scale-125 transition-transform"
              >
                <img
                  src={user?.profile_avatar || 'https://via.placeholder.com/100'}
                  alt="User"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>
            </li>
          )}
        </ul>

        {/* Mobile Avatar Menu - Positioned outside the ul to avoid overflow issues */}
        {isMobile && showAvatarMenu && (
          <div
            className="fixed top-110 right-4 w-48 bg-white border border-blue-300 rounded-md shadow-xl z-[9999] dark:bg-gray-800 dark:border-gray-600"
            ref={menuRef}
          >
            <ul className="p-1.5">
              {avatarItems.map(({ icon, title, id, page }) => (
                <li key={id} className="flex flex-col">
                  {title === 'Logout' && <hr className="border-gray-300 dark:border-gray-600 my-1" />}
                  <div
                    onClick={() => {
                      if (title === 'Logout') {
                        dispatch(logout());
                        navigate('/login');
                      } else if (page) {
                        navigate(`/${page}`);
                      }
                      setShowAvatarMenu(false);
                    }}
                    className="w-full flex items-center gap-6 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                  >
                    <div className="text-blue-500 text-[15px]">{icon}</div>
                    <div className="text-base">{title}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Menu */}
        <ul className={`flex ${isMobile ? 'flex-row gap-4 mb-2 mt-1' : 'flex-col gap-4 mt-6'} items-center`}>
        </ul>

        {/* Bottom Menu (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center relative mt-auto">
          <ul className="flex flex-col items-center gap-3 mt-4">
            {bottomMenuItems.map(({ id, icon, lable, action, page }) => (
              <li key={id} className="relative">
                <Tooltip
                  text={lable}
                  position="right"
                  show={hoveredItem === `bottom-${id}`}
                >
                  <button
                    onClick={() => {
                      if (action) action();
                      else if (page) {
                        navigate(`/${page}`);
                        setClickEffect(id);
                        localStorage.setItem('activeTab', id);
                      }
                      setShowAvatarMenu(false);
                      setHoveredItem(null);
                    }}
                    className={getButtonClass(id)}
                    onMouseEnter={() => setHoveredItem(`bottom-${id}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {icon}
                  </button>
                </Tooltip>
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
                    onClick={() => setShowLangMenu(false)}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                  >
                    <span className={`fi fi-${lang.flag} w-5 h-5`}></span>
                    <span>{lang.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Desktop Avatar Dropdown */}
          <div className="mt-4 relative">
            <div>
              <button
                onClick={() => {
                  setShowAvatarMenu(prev => !prev);
                  setShowLangMenu(false);
                  setHoveredItem(null);
                }}
                className="w-12 h-12 rounded-full border-3 border-gray-300 dark:border-[var(--text-color)] shadow-md hover:scale-125 transition-transform cursor-pointer"
                onMouseEnter={() => setHoveredItem('avatar')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img
                  src={user?.profile_avatar || 'https://via.placeholder.com/100'}
                  alt="User"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>
            </div>

            {showAvatarMenu && (
              <div
                className="absolute left-14 bottom-0 w-40 bg-white border border-blue-300 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-600"
                ref={menuRef}
              >
                <ul className="p-1.5">
                  {avatarItems.map(({ icon, title, id, page }) => (
                    <li key={id} className="flex flex-col">
                      {title === 'Logout' && <hr className="border-gray-300 dark:border-gray-600 my-1" />}
                      <div
                        onClick={() => {
                          if (title === 'Logout') {
                            dispatch(logout());
                            navigate('/login');
                          } else if (page) {
                            navigate(`/${page}`);
                          }
                          setShowAvatarMenu(false);
                        }}
                        className="w-full flex items-center gap-6 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                      >
                        <div className="text-blue-500 text-[15px]">{icon}</div>
                        <div className="text-base">{title}</div>
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