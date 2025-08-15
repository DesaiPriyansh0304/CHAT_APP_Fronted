import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../feature/Slice/Auth/AuthSlice';
import { toggleTheme } from '../feature/Slice/Theme/ThemeSlice';
import { topItems, bottomItems, avatarItems, languages } from '../Sidebar/icon';

function Sidebar({ isMobile }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLangMenu, setShowLangMenu] = useState(false);               //Language Menu
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);           //Avatar Menu 
  const [hoveredItem, setHoveredItem] = useState(null);                  //Hover Effect 
  const [showBottomIconsMobile, setShowBottomIconsMobile] = useState(false); // Bottom icons toggle for mobile 

  //theme Slice - Make sure we're getting the current theme
  const theme = useSelector((state) => state.theme.mode);
  //Login User Data Slice
  const loginUserState = useSelector((state) => state.loginUser || {});
  const { loading, error } = loginUserState;
  const user = loginUserState?.userData;

  // Apply theme to document on mount and theme change
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  //click to get icon id
  const [clickEffect, setClickEffect] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) return savedTab;
    const currentPath = location.pathname.split('/')[1];
    // Pass current theme to bottomItems to get the correct state
    const allTabs = [...topItems, ...bottomItems(theme, setShowLangMenu, dispatch, toggleTheme)];
    const match = allTabs.find((item) => item.page === currentPath);
    return match ? match.id : null;
  });

  //store in icon id(localStorage)
  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    // Make sure to pass the current theme here as well
    const allTabs = [...topItems, ...bottomItems(theme, setShowLangMenu, dispatch, toggleTheme)];
    const match = allTabs.find((item) => item.page === currentPath);
    if (match) {
      setClickEffect(match.id);
      localStorage.setItem('activeTab', match.id);
    }
  }, [location, theme, dispatch]); // Add dispatch as dependency

  // click Event
  const menuRef = useRef(null);       // avatar menu ref (mobile/desktop)
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAvatarMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
      if (showLangMenu && langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [showAvatarMenu, showLangMenu]);

  //Tooltip Component
  const Tooltip = ({ children, text, position = "right", show = false }) => {
    if (!text || !show) return children;

    const getTooltipClasses = () => {
      const baseClasses = "absolute z-[9999] px-3 py-2 text-sm font-medium text-white dark:text-black bg-gray-900 dark:bg-gray-400 rounded-lg shadow-lg transition-all duration-200 opacity-100 visible whitespace-nowrap";
      switch (position) {
        case 'right': return `${baseClasses} left-full ml-3 top-1/2 -translate-y-1/2`;
        case 'left': return `${baseClasses} right-full mr-3 top-1/2 -translate-y-1/2`;
        case 'top': return `${baseClasses} bottom-full mb-2 left-1/2 -translate-x-1/2`;
        case 'bottom': return `${baseClasses} top-full mt-2 left-1/2 -translate-x-1/2`;
        default: return `${baseClasses} left-full ml-3 top-1/2 -translate-y-1/2`;
      }
    };

    return (
      <div className="relative group">
        {children}
        <div className={getTooltipClasses()}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-400 rotate-45 ${position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' :
            position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
              position === 'top' ? 'left-1/2 -translate-x-1/2 -bottom-1' :
                'left-1/2 -translate-x-1/2 -top-1'
            }`}></div>
        </div>
      </div>
    );
  };

  //click in top icon
  const handleTabClick = (id, page) => {
    setClickEffect(id);
    localStorage.setItem('activeTab', id);
    navigate(`/${page}`);
    setShowLangMenu(false);
    setShowAvatarMenu(false);
    setHoveredItem(null);
    // Close bottom menu on mobile after navigation
    if (isMobile) {
      setShowBottomIconsMobile(false);
    }
  };

  //avatar menu onclick event
  const handleAvatarMenuClick = (title, page) => {
    if (title === 'Logout') {
      dispatch(logout());
      navigate('/login');
    } else if (page) {
      navigate(`/${page}`);
    }
    setShowAvatarMenu(false);
    setShowLangMenu(false);
    setHoveredItem(null);
    // Close bottom menu on mobile after action
    if (isMobile) {
      setShowBottomIconsMobile(false);
    }
  };

  //common button CSS 
  const getButtonClass = (id) => {
    const base = isMobile
      ? 'relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer border'
      : 'relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-110 cursor-pointer border';
    const common = 'hover:text-blue-600 dark:hover:text-[#dfd0b8]';
    const isActive = clickEffect === id;

    if (isActive) {
      return theme === 'dark'
        ? `${base} text-gray-300 bg-[#3E4A56] border border-gray-200  ${common}`
        : `${base} text-blue-600 bg-blue-100 border border-blue-600 ${common}`;
    } else {
      return `${base} border-transparent text-gray-500 dark:text-sky-400 ${common}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid">Loading...</div>
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>;

  // Get bottom menu items with current theme - this ensures the theme button shows correct state
  const bottomMenuItems = bottomItems(theme, setShowLangMenu, dispatch, toggleTheme);

  return (
    <>
      <div className="md:w-full md:h-full bg-[#f7f7ff] dark:bg-[var(--sidebar-bg)] shadow-2xl">

        {/* Desktop Layout */}
        {!isMobile ? (
          <div className="h-full py-2 flex flex-col">

            {/* Logo */}
            <div className="justify-center my-5">
              <img src="/Img/logo.jpg" alt="Logo" />
            </div>

            {/* Main content with justify-between */}
            <div className="flex flex-col justify-between flex-1">

              {/* Top Menu Icons */}
              <div className="flex flex-col items-center">
                <ul className='flex flex-col gap-2'>
                  {topItems.map(({ icon, lable, page, id }) => (
                    <li key={id} className="relative">
                      <Tooltip text={lable} position="right" show={hoveredItem === `top-${id}`}>
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
                </ul>
              </div>

              {/* Bottom Menu Icons */}
              <div className="flex flex-col items-center relative">

                {/* Bottom Menu Items */}
                <div className="flex flex-col items-center">
                  <ul className='flex flex-col gap-0.5'>
                    {bottomMenuItems.map(({ id, icon, lable, action, page }) => (
                      <li key={id} className="relative">
                        <Tooltip text={lable} position="right" show={hoveredItem === `bottom-${id}`}>
                          <button
                            onClick={() => {
                              if (action) {
                                action();
                              } else if (page) {
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
                </div>

                {/* Language Menu */}
                {showLangMenu && (
                  <div
                    ref={langMenuRef}
                    className="absolute bottom-36 left-16 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700"
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

                {/* Desktop Avatar */}
                <div className="relative mt-3 mb-1.5">
                  <button
                    onClick={() => {
                      setShowAvatarMenu(prev => !prev);
                      setShowLangMenu(false);
                      setHoveredItem(null);
                    }}
                    className="w-13 h-13 rounded-full border-2 border-gray-300 dark:border-[#d9d9d9] shadow-md hover:scale-115 transition-transform cursor-pointer"
                    onMouseEnter={() => setHoveredItem('avatar')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <img
                      src={user?.profile_avatar || 'https://via.placeholder.com/100'}
                      alt="User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>

                  {/*show avatar menu*/}
                  {showAvatarMenu && (
                    <div
                      className="absolute left-15 bottom-5 w-39 bg-white border border-blue-300 rounded-md shadow-lg z-10 dark:bg-gray-800 dark:border-gray-600"
                      ref={menuRef}
                    >
                      <ul className="p-1.5">
                        {avatarItems.map(({ icon, title, id, page }) => (
                          <li key={id} className="flex flex-col">
                            {title === 'Logout' && <hr className="border-gray-300 dark:border-gray-600 my-1" />}
                            <button
                              onClick={() => handleAvatarMenuClick(title, page)}
                              className="w-full flex items-center gap-6 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md "
                            >
                              <div className="text-blue-500 text-[15px]">{icon}</div>
                              <div className="text-base">{title}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Mobile Layout - FIXED */
          <div className="h-[64px] bg-white dark:bg-[var(--sidebar-bg)] shadow-2xl">
            <div className="flex flex-row items-center justify-between w-full h-full px-2">

              {/* Menu Items Container - Shows either top or bottom icons */}
              <div className='flex-1 flex justify-start overflow-x-auto'>
                <ul className="flex flex-row gap-1 items-center min-w-max">
                  {!showBottomIconsMobile ? (
                    // Show Top Icons
                    topItems.map(({ icon, page, id }) => ( // Limit to 4 items to prevent overflow
                      <li key={id} className="relative flex-shrink-0">
                        <button
                          onClick={() => handleTabClick(id, page)}
                          className={getButtonClass(id)}
                        >
                          {icon}
                        </button>
                      </li>
                    ))
                  ) : (
                    // Show Bottom Icons
                    bottomMenuItems.slice(0, 4).map(({ id, icon, action, page }) => ( // Limit to 4 items
                      <li key={id} className="relative flex-shrink-0">
                        <button
                          onClick={() => {
                            if (action) {
                              action();
                            } else if (page) {
                              navigate(`/${page}`);
                              setClickEffect(id);
                              localStorage.setItem('activeTab', id);
                            }
                            setShowAvatarMenu(false);
                            setHoveredItem(null);
                          }}
                          className={getButtonClass(id)}
                        >
                          {icon}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Right side container */}
              <div className="flex flex-row gap-2 items-center flex-shrink-0">

                {/* Toggle Button for Bottom Icons */}
                <button
                  onClick={() => setShowBottomIconsMobile(prev => !prev)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex-shrink-0"
                  title={showBottomIconsMobile ? "Show Main Menu" : "Show More Options"}
                >
                  {!showBottomIconsMobile ? (
                    // More options icon (3 dots)
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  ) : (
                    // Back/Close icon
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>

                {/* Mobile Avatar */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAvatarMenu(prev => !prev);
                      setShowLangMenu(false);
                      setHoveredItem(null);
                    }}
                    className="w-10 h-10 rounded-full border-2 border-[#d2d2cf] dark:border-[var(--text-color)] shadow-md hover:scale-110 transition-transform"
                  >
                    <img
                      src={user?.profile_avatar || 'https://via.placeholder.com/100'}
                      alt="User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Language Menu */}
            {showLangMenu && (
              <div
                ref={langMenuRef}
                className="absolute top-16 right-12 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700"
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

            {/* Mobile Avatar Menu */}
            {showAvatarMenu && (
              <div
                className="absolute top-16 right-2 w-40 bg-white border border-blue-300 rounded-md shadow-xl z-[9999] dark:bg-gray-800 dark:border-gray-600"
                ref={menuRef}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <ul className="p-1.5">
                  {avatarItems.map(({ icon, title, id, page }) => (
                    <li key={id} className="flex flex-col">
                      {title === 'Logout' && <hr className="border-gray-300 dark:border-gray-600 my-1" />}
                      <button
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAvatarMenuClick(title, page);
                        }}
                        className="w-full flex items-center gap-6 px-4 py-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md "
                      >
                        <div className="text-blue-500 text-[15px]">{icon}</div>
                        <div className="text-base">{title}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}

export default Sidebar;