import { FaPencilAlt } from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CiEdit } from 'react-icons/ci';
import { BsPersonGear } from 'react-icons/bs';
import { MdOutlinePrivacyTip, MdSecurity, MdOutlinePolicy } from 'react-icons/md';
import { TbHelpSquareRounded } from 'react-icons/tb';
import { FaQuestion } from 'react-icons/fa6';
import { IoIosContact } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLastSeen, toggleReadReceipts, togglesecurityReceipts, setPrivacySetting, setUserStatus } from "../feature/Slice/Setting/settingsSlice";

function Setting() {

  const dispatch = useDispatch();

  const [showAvailble, setShowAvailble] = useState(false);
  const [activeSection, setActiveSection] = useState('personalinfo');    //section
  const [openMenuId, setOpenMenuId] = useState(null);                    // NEW
  const navigate = useNavigate(); // For navigation


  const { lastSeen, readReceipts, security, profilephoto, status, groups, userStatus } = useSelector((state) => state.settings);

  //Login user data Slice
  const { userData: user } = useSelector((state) => state.AuthUser);

  {/*menu open */ }
  const menuRef = useRef(null);

  //menu function
  const toggleMenu = (menuId) => {
    setOpenMenuId((prev) => (prev === menuId ? null : menuId));
  };

  //menu option
  const everyonemenu = [
    { id: 1, name: 'Everyone' },
    { id: 2, name: 'Selected' },
    { id: 3, name: 'Nobody' },
  ];

  // Handle user status selection
  const handleStatusSelection = (selectedStatus) => {
    dispatch(setUserStatus(selectedStatus));
    setShowAvailble(false);
  };

  // Handle privacy setting selection
  const handlePrivacySelection = (key, value) => {
    dispatch(setPrivacySetting({ key, value }));
    setOpenMenuId(null);
  };

  // Get current value for dropdown
  const getCurrentValue = (key) => {
    switch (key) {
      case 'profilephoto': return profilephoto;
      case 'status': return status;
      case 'groups': return groups;
      default: return 'Everyone';
    }
  };

  //clike event
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleAvailbleMenu = () => {
    setShowAvailble((prev) => !prev);
  };

  const handleToggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <>
      <div className="p-2">
        {/* Title */}
        <div className="flex justify-between">
          <div className="libertinus-sans-regular p-5 text-2xl font-bold dark:text-[var(--text-color3)]">Settings</div>
        </div>

        {/* Avatar */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative w-28 h-28">
            {/*image*/}

            <img
              src={user?.profile_avatar || 'https://via.placeholder.com/100'}
              alt="Avatar"
              className="rounded-full w-full h-full object-cover border-4 border-blue-500 bg-black"
            />

            {/*icon*/}
            <div className="absolute bottom-0 right-0">
              <div className="bg-gray-200 text-black rounded-full p-2 border-3 border-white">
                <FaPencilAlt />
              </div>
            </div>
          </div>

          {/* Name & Status */}
          <div className="text-center dark:text-[var(--text-color1)] mt-4">
            {/*user name*/}
            <div>
              <h2 className="text-lg font-semibold">
                {user?.firstname} {user?.lastname}
              </h2>
            </div>
            <div className="relative inline-block">
              <div className="flex gap-2 items-center cursor-pointer " onClick={toggleAvailbleMenu}>
                {/*menu Title*/}
                <div>
                  <p className="text-base text-gray-600 dark:text-[#90e0ef]">{userStatus}</p>
                </div>
                {/*menu open*/}
                <div>
                  <span className="text-gray-600">
                    {showAvailble ? (
                      <ChevronUp className="w-4 h-4 mt-1 dark:text-[var(--text-color1)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mt-1 dark:text-[var(--text-color)]" />
                    )}
                  </span>
                </div>
              </div>
              {/*show menu */}
              {showAvailble && (
                <div className="absolute top-full mt-2 left-0 w-32 bg-white rounded shadow-xl z-50">
                  <div
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-t-xl"
                    onClick={() => handleStatusSelection('Available')}
                  >
                    Available
                  </div>
                  <div
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-b-xl"
                    onClick={() => handleStatusSelection('Busy')}
                  >
                    Busy
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-gray-200 dark:border-[#64b5f6] mt-8" />

        {/*All Sections */}
        <div className="overflow-auto h-[60vh] mx-2">

          {/* Personal Info */}
          <div className="w-full bg-gradient-to-r from-sky-200 to-purple-200 dark:bg-[#495057] rounded">
            <div
              className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3.5"
              onClick={() => handleToggleSection('personalinfo')}
            >
              <div className="flex items-center gap-2">
                {/* Personal Info Icon*/}
                <div>
                  <BsPersonGear className="w-5 h-5 dark:text-[var(--text-color3)]" />
                </div>
                {/* Personal Info */}
                <div>
                  <span className="text-gray-700 dark:text-[var(--text-color3)] font-medium">
                    Personal Info
                  </span>
                </div>
              </div>
              {/* up And Down Ioon */}
              <div className="dark:text-[var(--text-color3)]">
                {activeSection === 'personalinfo' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {/* Personal Info open*/}
            <div>
              {activeSection === 'personalinfo' && (
                <div className="bg-blue-50 dark:bg-[#f8f9fa]">
                  <div className="mt-2 space-y-3 text-sm text-gray-800 px-4 py-2.5 max-h-[37vh] overflow-auto">
                    <div className="flex justify-between items-start">
                      {/*user name */}
                      <div>
                        <p className="text-gray-500 dark:text-[var(--text-color)] text-sm">Name</p>
                        <p className="font-semibold">
                          {user?.firstname} {user?.lastname}
                        </p>
                      </div>
                      {/*edit button */}
                      <div>
                        <button
                          onClick={() => navigate('/avtarpage')}
                          className="flex items-center gap-2 bg-blue-100 hover:bg-gray-300 px-2 py-1 rounded text-sm text-black cursor-pointer">
                          <CiEdit className="text-lg" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>

                    {/*user email */}
                    <div>
                      <p className="text-gray-500 dark:text-[var(--text-color)] mt-6">Email</p>
                      <p>{user?.email}</p>
                    </div>

                    {/*user mobilno */}
                    <div>
                      <p className="text-gray-500 dark:text-[var(--text-color)] mt-6">Mobile No</p>
                      <p>{user?.mobile}</p>
                    </div>

                    {/*user Dob */}
                    <div>
                      <p className="text-gray-500 dark:text-[var(--text-color)] mt-6">DOB</p>
                      <p>{user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    {/*user gender */}
                    <div>
                      <p className="text-gray-500 dark:text-[var(--text-color)] mt-6">Gender</p>
                      <p>{user?.gender}</p>
                    </div>

                    {/*user time */}
                    <div>
                      <p className="text-gray-500 dark:text-[var(--text-color)] mt-6">Time</p>
                      <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    {/*user location */}
                    <div>
                      <p className="text-gray-500 dark:text-[var(--text-color)] mt-6">Location</p>
                      <p>California, USA</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy section */}
          <div className="w-full bg-gradient-to-r from-sky-200 to-purple-200 dark:bg-[#495057] rounded">
            <div
              className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3"
              onClick={() => handleToggleSection('privacy')}
            >
              <div className="flex items-center gap-2">
                {/* Privacy Icon*/}
                <div>
                  <MdOutlinePrivacyTip className="w-5 h-5 dark:text-[#f8f9fa]" />
                </div>
                {/* Privacy */}
                <div>
                  <span className="text-gray-700 dark:text-[#f8f9fa] font-medium">
                    Privacy
                  </span>
                </div>
              </div>
              {/* up And Down Ioon */}
              <div className="dark:text-[#f8f9fa]">
                {activeSection === 'privacy' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {/* Privacy sction open*/}
            <div>
              {activeSection === 'privacy' && (
                <div className="bg-blue-50 dark:bg-[#f8f9fa]">
                  <div className="my-4 mt-2 space-y-3 text-sm text-gray-800 px-4 py-2.5 max-h-[37vh] overflow-auto">
                    {/* Reusable dropdown */}
                    {['profilephoto', 'status', 'groups'].map((key) => (
                      <div key={key} className="flex justify-between items-center relative">
                        <p className="text-base capitalize ">
                          {key
                            .replace('profilephoto', 'Profile photo')
                            .replace('status', 'Status')
                            .replace('groups', 'Groups')}
                        </p>
                        {/*dropdown button*/}
                        <div>
                          <button
                            onClick={() => toggleMenu(key)}
                            className="flex items-center  gap-2 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm text-black"
                          >
                            <span>{getCurrentValue(key)}</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        {/* menu open */}
                        {openMenuId === key && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10"
                          >
                            {everyonemenu.map(({ name, id }) => (
                              <button
                                key={id}
                                onClick={() => handlePrivacySelection(key, name)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <hr className="border-t-2 border-gray-400 dark:border-[var(--text-color)] mt-2" />

                    {/* Last Seen  */}
                    <div className="flex justify-between items-center">
                      {/* Last Seen  */}
                      <div>
                        <p className="text-base">Last seen</p>
                      </div>
                      {/* Last Seen toggel button */}
                      <div>
                        <label className="relative inline-flex items-center w-8 h-4 cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={lastSeen} onChange={() => dispatch(toggleLastSeen())} />
                          <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600   transition-colors duration-300"></div>
                          <span className="absolute left-0.5 w-3 h-3 bg-gray-500 rounded-full transition-all duration-300 peer-checked:left-4 peer-checked:bg-white top-1/2 -translate-y-1/2"></span>
                        </label>
                      </div>
                    </div>

                    <hr className="border-t-2 border-gray-400 dark:border-[var(--text-color3)] mt-2" />

                    {/* Read receipts  */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-base">Read receipts</p>
                      </div>
                      {/* Read receipts toggel button */}
                      <div>
                        <label className="relative inline-flex items-center w-8 h-4 cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={readReceipts} onChange={() => dispatch(toggleReadReceipts())} />
                          <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                          <span className="absolute left-0.5 w-3 h-3 bg-gray-500 rounded-full transition-all duration-300 peer-checked:left-4 peer-checked:bg-white top-1/2 -translate-y-1/2"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="w-full bg-gradient-to-r from-sky-200 to-purple-200 dark:bg-[#495057] rounded">
            <div
              className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3.5"
              onClick={() => handleToggleSection('security')}
            >
              <div className="flex items-center gap-2">
                {/*Security icon*/}
                <div>
                  <MdSecurity className="w-5 h-5 dark:text-[#f8f9fa] " />
                </div>
                {/*Security name*/}
                <div>
                  <span className="text-gray-700 dark:text-[#f8f9fa] font-medium">
                    Security
                  </span>
                </div>
              </div>
              <div className="dark:text-[#f8f9fa]">
                {activeSection === 'security' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {/* Security section open */}
            <div>
              {activeSection === 'security' && (
                <div className="bg-blue-50 dark:bg-[#f8f9fa]">
                  <div className="mt-2 space-y-3 text-sm text-gray-800 mb-4 px-4 py-2.5 max-h-[37vh] overflow-auto">
                    <div className="flex justify-between items-center">
                      {/*Show security*/}
                      <div>
                        <p className="text-base">Show security notification</p>
                      </div>
                      {/*Show toggle button*/}
                      <div>
                        <label className="relative inline-flex items-center w-8 h-4 cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={security} onChange={() => dispatch(togglesecurityReceipts())} />
                          <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                          <span className="absolute left-0.5 w-3 h-3 bg-gray-500 rounded-full transition-all duration-300 peer-checked:left-4 peer-checked:bg-white top-1/2 -translate-y-1/2"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="w-full bg-gradient-to-r from-sky-200 to-purple-200 dark:bg-[#495057] rounded">
            <div
              className="flex items-center justify-between cursor-pointer px-4 py-2.5 mt-3.5"
              onClick={() => handleToggleSection('help')}
            >
              <div className="flex items-center gap-2">
                {/*Help Icon*/}
                <div>
                  <TbHelpSquareRounded className="w-5 h-5 dark:text-[#f8f9fa]" />
                </div>
                {/*Help*/}
                <div>
                  <span className="text-gray-700 font-medium dark:text-[#f8f9fa]">Help</span>
                </div>
              </div>
              {/*UP And Down Icon*/}
              <div className="dark:text-[#f8f9fa]">
                {activeSection === 'help' ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {/* Help section open*/}
            <div>
              {activeSection === 'help' && (
                <div className="bg-blue-50 dark:bg-[#f8f9fa]">
                  <div className="mt-2 space-y-3 text-sm text-gray-800 mb-4 px-4 py-2.5">
                    {/* FAQs */}
                    <div className="flex gap-1 items-center">
                      <div>
                        <FaQuestion className="w-4 h-4" />
                      </div>
                      <div>
                        <span>FAQs</span>
                      </div>
                    </div>
                    <hr className="border-t-2 border-gray-400 dark:border-[var(--text-color)] mt-2" />
                    {/* Contact */}
                    <div className="flex gap-1 items-center">
                      <div>
                        <IoIosContact className="w-5 h-5" />
                      </div>
                      <div>
                        <span>Contact</span>
                      </div>
                    </div>
                    <hr className="border-t-2 border-gray-400 dark:border-[var(--text-color)] mt-2" />
                    {/* Terms & Privacy policy */}
                    <div className="flex gap-1 items-center">
                      <div>
                        <MdOutlinePolicy className="w-5 h-5" />
                      </div>
                      <div>
                        <span>Terms & Privacy policy</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Setting;