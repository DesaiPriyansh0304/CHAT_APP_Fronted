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

  const handleLanguageButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Language button clicked, current showLangMenu:', showLangMenu);
    setShowLangMenu(prev => {
      console.log('Setting showLangMenu to:', !prev);
      return !prev;
    });
    setShowAvatarMenu(false);
    setHoveredItem(null);
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
    <div className="md:w-full md:h-full bg-[#f7f7ff] dark:bg-[var(--sidebar-bg)] shadow-2xl">
      {!isMobile ? (
        /* Desktop layout here — unchanged */
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
        /* Mobile Layout */
        <div className="h-[64px] bg-white dark:bg-[var(--sidebar-bg)] shadow-2xl">
          <div className="flex flex-row items-center justify-between w-full h-full px-2">
            <div className='flex-1 flex justify-start overflow-x-auto'>
              <ul className="flex flex-row gap-1 items-center min-w-max">
                {!showBottomIconsMobile ? (
                  topItems.map(({ icon, page, id }) => (
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
                  bottomMenuItems.map(({ id, icon, lable, action, page }) => (
                    <li key={id} className="relative flex-shrink-0">
                      <button
                        data-lang-button={id === 103 || lable === 'Language' ? 'true' : 'false'}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Bottom menu item clicked:', id, lable);

                          // Language button specific handling
                          if (id === 103 || lable === 'Language') {
                            handleLanguageButtonClick(e);
                            return;
                          }

                          // અન્ય buttons માટે
                          if (action) {
                            action();
                          } else if (page) {
                            navigate(`/${page}`);
                            setClickEffect(id);
                            localStorage.setItem('activeTab', id);
                          }
                          setShowAvatarMenu(false);
                          setShowLangMenu(false);
                          setHoveredItem(null);
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        className={`${getButtonClass(id)} active:scale-95`}
                      >
                        {icon}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Toggle Button & Avatar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Toggle Bottom Icons Button */}
              <button
                onClick={() => {
                  setShowBottomIconsMobile(prev => !prev);
                  setShowLangMenu(false);
                  setShowAvatarMenu(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showBottomIconsMobile ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </>
                  )}
                </svg>
              </button>

              {/* Avatar Button */}
              <div className="relative flex-shrink-0">
                <button
                  data-avatar-button="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAvatarMenu(prev => !prev);
                    setShowLangMenu(false);
                  }}
                  className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform"
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

          {/* Mobile Language Menu - showLangMenu state પર આધારિત */}
          {showLangMenu && (
            <div
              ref={langMenuRef}
              className="fixed top-90 left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] dark:bg-gray-800 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">Select Language</div>
                <ul className="max-h-48 overflow-y-auto">
                  {languages.map((lang) => (
                    <li
                      key={lang.code}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Language selected:', lang.label);
                        setShowLangMenu(false);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-md transition-colors active:bg-gray-200 dark:active:bg-gray-600"
                    >
                      <span className={`fi fi-${lang.flag} w-4 h-4 flex-shrink-0`}></span>
                      <span className="truncate">{lang.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Mobile Avatar Menu */}
          {showAvatarMenu && (
            <div
              ref={menuRef}
              className="fixed top-116 right-4 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] dark:bg-gray-800 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2">

                <ul>
                  {avatarItems.map(({ id, icon, title, page }) => (
                    <li key={id}>
                      <button
                        onClick={() => handleAvatarMenuClick(title, page)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                      >
                        {icon}
                        <span>{title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


export default Sidebar;