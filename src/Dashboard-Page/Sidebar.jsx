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

  //theme Slice
  const theme = useSelector((state) => state.theme.mode);
  //Login User Data Slice
  const loginUserState = useSelector((state) => state.loginUser || {});
  const { userData: user, loading, error } = loginUserState;

  const [showLangMenu, setShowLangMenu] = useState(false);               //Languge Menu
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);           //Avatar Menu 
  const [hoveredItem, setHoveredItem] = useState(null);                  //Hover Effect 

  //clike to get icon id
  const [clickEffect, setClickEffect] = useState(() => {
    const currentPath = location.pathname.split('/')[1];
    const allTabs = [...topItems, ...bottomItems(theme, setShowLangMenu, dispatch, toggleTheme)];
    const match = allTabs.find((item) => item.page === currentPath);
    return match ? match.id : null;
  });

  //store in icon id(localhost)
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

  // cilck Event
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
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showAvatarMenu, showLangMenu]);

  //common button Css 
  const getButtonClass = (id) => {
    const base = 'relative p-2 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-110 cursor-pointer';
    const common = 'hover:text-blue-600 dark:hover:text-[#dfd0b8]';
    const isActive = clickEffect === id;

    if (isActive) {
      return theme === 'dark'
        ? `${base} border border-white text-blue-700  bg-[#3E4A56] px-3 py-2.5 ${common}`
        : `${base} text-blue-600 bg-blue-100 border border-blue-600 px-3 py-2.5 ${common}`;
    } else {
      return `${base} text-gray-500 dark:text-[var(--sidebar-text)] ${common}`;
    }
  };

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


  //clike in top iaon
  const handleTabClick = (id, page) => {
    setClickEffect(id);
    localStorage.setItem('activeTab', id);
    navigate(`/${page}`);
    setShowLangMenu(false);
    setShowAvatarMenu(false);
    setHoveredItem(null);
  };

  //avtar menu oncilke event
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
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid">Loadding...</div>
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>;

  const bottomMenuItems = bottomItems(theme, setShowLangMenu, dispatch, toggleTheme);

  return (
    <>
      <div className="bg-[#f7f7ff] dark:bg-[var(--sidebar-bg)] w-full h-full">
        <div className="relative md:h-screen flex flex-col md:justify-between md:py-4 py-2 items-center shadow-md">

          {/* Logo (Desktop only) */}
          <div className="hidden md:flex justify-center">
            <img src="/Img/logo.jpg" alt="Logo" />
          </div>

          {/* Top Menu */}
          <div>
            <ul className={`flex ${isMobile ? 'flex-row gap-4 mb-2 mt-1' : 'flex-col gap-4 mt-6'} items-center`}>
              {topItems.map(({ icon, lable, page, id }) => (
                <li key={id} className="relative">
                  <Tooltip text={lable} position="right" show={hoveredItem === `top-${id}` && !isMobile}>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
          </div>

          {/* Mobile Avatar Menu */}
          {isMobile && showAvatarMenu && (
            <div
              className="fixed top-113 right-13 w-40 bg-white border border-blue-300 rounded-md shadow-xl z-[9999] dark:bg-gray-800 dark:border-gray-600"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <ul className="p-1.5">
                {avatarItems.map(({ icon, title, id, page }) => (
                  <li key={id} className="flex flex-col">
                    {title === 'Logout' && <hr className="border-gray-300 dark:border-gray-600 my-1" />}
                    {/* use pointerdown on mobile so we catch the touch early and avoid outside-listener race */}
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

          {/* Bottom Menu (Desktop) */}
          <div className="hidden md:flex flex-col items-center relative mt-auto">
            <ul className="flex flex-col items-center gap-3 mt-4">
              {bottomMenuItems.map(({ id, icon, lable, action, page }) => (
                <li key={id} className="relative">
                  <Tooltip text={lable} position="right" show={hoveredItem === `bottom-${id}`}>
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
                  className="w-12 h-12 rounded-full border-3 border-gray-300 dark:border-[#d9d9d9] shadow-md hover:scale-125 transition-transform cursor-pointer"
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
                  className="absolute left-14 bottom-0 w-39 bg-white border border-blue-300 rounded-md shadow-lg z-10 dark:bg-gray-800 dark:border-gray-600"
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
    </>
  );
}

export default Sidebar;
