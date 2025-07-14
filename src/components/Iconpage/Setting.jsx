import { FaPencilAlt } from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CiEdit } from "react-icons/ci";
import { BsPersonGear } from "react-icons/bs";
import { MdOutlinePrivacyTip, MdSecurity, MdOutlinePolicy } from "react-icons/md";
import { TbHelpSquareRounded } from "react-icons/tb";
import { FaQuestion } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import { useSelector } from 'react-redux';

function Setting() {
  const [showAvailble, setShowAvailble] = useState(false);
  const [activeSection, setActiveSection] = useState("personalinfo");
  const [openMenuId, setOpenMenuId] = useState(null); // NEW

  const { userData: user } = useSelector((state) => state.loginuser);

  const toggleMenu = (menuId) => {
    setOpenMenuId(prev => (prev === menuId ? null : menuId));
  };

  const menuRef = useRef(null);

  const everyonemenu = [
    { id: 1, name: "Everyone" },
    { id: 2, name: "Selected" },
    { id: 3, name: "Nobody" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAvailbleMenu = () => {
    setShowAvailble(prev => !prev);
  };

  const handleToggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className='p-2 bg-[#f5f7fb] overflow-hidden'>

      {/* Title */}
      <div className='flex justify-between'>
        <div className='p-5 text-2xl font-bold'>Settings</div>
      </div>

      {/* Avatar */}
      <div className='mt-6 flex flex-col items-center'>
        <div className='relative w-28 h-28'>
          <img
            src={user?.profile_avatar || "https://via.placeholder.com/100"}
            alt="Avatar"
            className='rounded-full w-full h-full object-cover border-4 border-blue-500 bg-black'
          />
          <div className="absolute bottom-0 right-0">
            <div className='bg-gray-200 text-black rounded-full p-2 border-3 border-white'>
              <FaPencilAlt />
            </div>
          </div>
        </div>

        {/* Name & Status */}
        <div className='text-center mt-4'>
          <h2 className='text-lg font-semibold'>{user?.firstname} {user?.lastname}</h2>
          <div className='relative inline-block'>
            <div className='flex gap-2 items-center cursor-pointer' onClick={toggleAvailbleMenu}>
              <p className='text-base text-gray-600'>Available</p>
              <span className='text-gray-600'>
                {showAvailble ? <ChevronUp className="w-4 h-4 mt-1" /> : <ChevronDown className="w-4 h-4 mt-1" />}
              </span>
            </div>
            {showAvailble && (
              <div className='absolute top-full mt-2 left-0 w-32 bg-white rounded shadow-xl z-50'>
                <div className='px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-t-xl' onClick={() => setShowAvailble(false)}>Available</div>
                <div className='px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-b-xl' onClick={() => setShowAvailble(false)}>Busy</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-t-2 border-gray-200 mt-8" />

      {/* Sections */}
      <div className='overflow-auto h-[60vh] mx-2'>

        {/* Personal Info */}
        <div className="w-full bg-gray-200 rounded">
          <div className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3.5"
            onClick={() => handleToggleSection("personalinfo")}>
            <div className="flex items-center gap-2">
              <BsPersonGear className='w-5 h-5' />
              <span className="text-gray-700 font-medium">Personal Info</span>
            </div>
            {activeSection === "personalinfo" ? <ChevronUp /> : <ChevronDown />}
          </div>

          {activeSection === "personalinfo" && (
            <div className='bg-white'>
              <div className="mt-2 space-y-3 text-sm text-gray-800 px-4 py-2.5 max-h-[37vh] overflow-auto">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-semibold">{user?.firstname} {user?.lastname}</p>
                  </div>
                  <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-300 px-2 py-1 rounded text-sm text-black">
                    <CiEdit className="text-lg" />
                    <span>Edit</span>
                  </button>
                </div>
                <div><p className="text-gray-500 mt-6">Email</p><p>{user?.email}</p></div>
                <div><p className="text-gray-500 mt-6">Mobile No</p><p>{user?.mobile}</p></div>
                <div><p className="text-gray-500 mt-6">DOB</p><p>{user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</p></div>
                <div><p className="text-gray-500 mt-6">Gender</p><p>{user?.gender}</p></div>
                <div><p className="text-gray-500 mt-6">Time</p><p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
                <div><p className="text-gray-500 mt-6">Location</p><p>California, USA</p></div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy */}
        <div className='w-full bg-gray-200 rounded'>
          <div className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3"
            onClick={() => handleToggleSection("privacy")}>
            <div className="flex items-center gap-2">
              <MdOutlinePrivacyTip className='w-5 h-5' />
              <span className="text-gray-700 font-medium">Privacy</span>
            </div>
            {activeSection === "privacy" ? <ChevronUp /> : <ChevronDown />}
          </div>

          {activeSection === "privacy" && (
            <div className='bg-white'>
              <div className='my-4 mt-2 space-y-3 text-sm text-gray-800 px-4 py-2.5 max-h-[37vh] overflow-auto'>

                {/* Reusable dropdown */}
                {["profilephoto", "status", "groups"].map((key) => (
                  <div key={key} className='flex justify-between items-center relative'>
                    <p className='text-base capitalize'>{key.replace("profilephoto", "Profile photo").replace("status", "Status").replace("groups", "Groups")}</p>
                    <button onClick={() => toggleMenu(key)} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm text-black">
                      <span>Everyone</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openMenuId === key && (
                      <div ref={menuRef} className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
                        {everyonemenu.map(({ name, id }) => (
                          <button
                            key={id}
                            onClick={() => setOpenMenuId(null)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <hr className="border-t-2 border-gray-400 mt-2" />

                {/* Last Seen */}
                <div className='flex justify-between items-center'>
                  <p className='text-base'>Last seen</p>
                  <label className="relative inline-flex items-center w-8 h-4 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                    <span className="absolute left-0.5 w-3 h-3 bg-gray-500 rounded-full transition-all duration-300 peer-checked:left-4 peer-checked:bg-white top-1/2 -translate-y-1/2"></span>
                  </label>
                </div>

                <hr className="border-t-2 border-gray-400 mt-2" />

                {/* Read receipts */}
                <div className='flex justify-between items-center'>
                  <p className='text-base'>Read receipts</p>
                  <label className="relative inline-flex items-center w-8 h-4 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                    <span className="absolute left-0.5 w-3 h-3 bg-gray-500 rounded-full transition-all duration-300 peer-checked:left-4 peer-checked:bg-white top-1/2 -translate-y-1/2"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="w-full bg-gray-200 rounded">
          <div className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3.5"
            onClick={() => handleToggleSection("security")}>
            <div className="flex items-center gap-2">
              <MdSecurity className='w-5 h-5' />
              <span className="text-gray-700 font-medium">Security</span>
            </div>
            {activeSection === "security" ? <ChevronUp /> : <ChevronDown />}
          </div>

          {activeSection === "security" && (
            <div className='bg-white'>
              <div className="mt-2 space-y-3 text-sm text-gray-800 mb-4 px-4 py-2.5 max-h-[37vh] overflow-auto">
                <div className='flex justify-between items-center'>
                  <p className='text-base'>Show security notification</p>
                  <label className="relative inline-flex items-center w-8 h-4 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                    <span className="absolute left-0.5 w-3 h-3 bg-gray-500 rounded-full transition-all duration-300 peer-checked:left-4 peer-checked:bg-white top-1/2 -translate-y-1/2"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="w-full bg-gray-200 rounded">
          <div className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3.5"
            onClick={() => handleToggleSection("help")}>
            <div className="flex items-center gap-2">
              <TbHelpSquareRounded className='w-5 h-5' />
              <span className="text-gray-700 font-medium">Help</span>
            </div>
            {activeSection === "help" ? <ChevronUp /> : <ChevronDown />}
          </div>

          {activeSection === "help" && (
            <div className='bg-white'>
              <div className="mt-2 space-y-3 text-sm text-gray-800 mb-4 px-4 py-2.5">
                <div className='flex gap-1 items-center'><FaQuestion className='w-4 h-4' /><span>FAQs</span></div>
                <hr className="border-t-2 border-gray-400 mt-2" />
                <div className='flex gap-1 items-center'><IoIosContact className='w-5 h-5' /><span>Contact</span></div>
                <hr className="border-t-2 border-gray-400 mt-2" />
                <div className='flex gap-1 items-center'><MdOutlinePolicy className='w-5 h-5' /><span>Terms & Privacy policy</span></div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Setting;
