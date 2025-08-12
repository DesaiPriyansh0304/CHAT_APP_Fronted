import React, { useEffect, useRef, useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IoPersonOutline } from 'react-icons/io5';
import { MdAttachFile } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);             //dot menu
  const [activeSection, setActiveSection] = useState('about');     //active action section

  //loginUser Slice
  const loginUserState = useSelector((state) => state.loginUser || {});
  const { userData: user } = loginUserState;

  const navigate = useNavigate();

  //dot section
  const dotmenuRef = useRef();
  //dot function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  //dot menu icon
  const dotMenu = [
    { id: 1, name: 'Edit', page: 'avtarpage' },
    { id: 2, name: 'Action' },
    { id: 3, name: 'Another action' },
  ];
  //click event
  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (isMenuOpen && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickAnywhere);
    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, [isMenuOpen]);

  //section function(about,attach file)
  const handleToggleSection = (section) => {
    switch (section) {
      case 'about':
      case 'attachfile':
        setActiveSection(activeSection === section ? null : section);
        break;
      default:
        setActiveSection(null);
    }
  };

  return (
    <>
      {/*main div*/}
      <div className="h-screen w-full">
        {/*Header*/}
        <div className="p-2 relative">

          {/*my profile and dot icon*/}
          <div className="flex justify-between">

            {/*My Profile*/}
            <div className="p-5 text-2xl font-semibold dark:text-[var(--Chatcontainer-text)]">
              My Profile
            </div>

            {/*dot section*/}
            <div className="p-5 relative text-semibold">
              {/*dot menu open icon*/}
              <button onClick={toggleMenu}>
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-500  dark:text-[var(--Chatcontainer-text)] cursor-pointer" />
              </button>

              {/*menu code*/}
              {isMenuOpen && (
                <div
                  className="absolute right-5 top-12 w-40 bg-white rounded-md shadow-md z-10"
                  ref={dotmenuRef}
                >
                  {/*dot menu */}
                  {dotMenu.map(({ name, id }) => (
                    <div key={id}>
                      {name === 'Another action' && (
                        <hr className="border-gray-300  dark:border-blue-300  mx-2" />
                      )}
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (name === 'Edit') {
                            navigate('/avtarpage');
                          }
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-md "
                      >
                        {name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/*Avtar + Active user*/}
          <div className="mt-3 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              {/*Profile Image*/}
              <div>
                <img
                  src={user?.profile_avatar || 'https://via.placeholder.com/100'}
                  alt="Avatar"
                  className="rounded-full w-24 h-24 border-4 border-gray-300 object-cover"
                />
              </div>

              {/*User name*/}
              <div>
                <h5 className="text-black mt-4 font-semibold text-lg dark:text-[var(--text-color3)]">
                  {user?.firstname} {user?.lastname}
                </h5>
              </div>

              {/*online user*/}
              <div className="flex items-center space-x-1 mt-1.5">
                <span className="w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                <p className="text-md text-gray-700 dark:text-[#90e0ef] ">Active</p>
              </div>

            </div>
          </div>
        </div>

        <hr className="border-t-1 border-blue-100 dark:border-[#64b5f6] mt-3.5 mx-2.5" />

        {/*End Section*/}
        <div className="m-4">
          {/*bio*/}
          <div className="mb-6 dark:text-[var(--Chatcontainer-text)]">
            <p>{user?.bio || 'No bio available.'}</p>
          </div>

          {/*All Section*/}
          <div className="overflow-auto h-[50vh] mx-2">

            {/*About section*/}
            <div className="w-full bg-gray-100 dark:bg-[#495057] rounded-md">
              <div
                className="flex items-center justify-between cursor-pointe  px-4 py-2.5 cursor-pointer "
                onClick={() => handleToggleSection('about')}
              >
                {/*section name and icon*/}
                <div className="flex items-center dark:text-[var(--Chatcontainer-text)] gap-2">
                  <div className='font-semibold'>
                    <IoPersonOutline />
                  </div>
                  <span className="text-gray-700 dark:text-[var(--Chatcontainer-text)]  font-medium">
                    About
                  </span>
                </div>
                {/*Up and Down Icon*/}
                <div>
                  {activeSection === 'about' ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-[var(--Chatcontainer-text)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-[var(--Chatcontainer-text)]" />
                  )}
                </div>
              </div>

              {/* About inside section detail*/}
              <div>
                {activeSection === 'about' && (
                  <div className="bg-white dark:bg-[#262E35] ">
                    <div className="mt-0.5 px-4 py-2.5 space-y-3 text-sm text-gray-800 h-[36vh] overflow-auto">

                      {/*User Name*/}
                      <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-2">Name</p>
                        <p className="font-medium dark:text-[var(--Chatcontainer-text)]">
                          {user?.firstname} {user?.lastname}
                        </p>
                      </div>

                      {/*User Email*/}
                      <div>
                        <p className="text-gray-500  dark:text-[#7f94d2] mt-6">Email</p>
                        <p className="font-medium dark:text-[var(--Chatcontainer-text)]">{user?.email}</p>
                      </div>

                      {/*User mobileno*/}
                      <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-6">Mobile No</p>
                        <p className="font-medium capitalize dark:text-[var(--Chatcontainer-text)]">{user?.mobile}</p>
                      </div>

                      {/*User DOB*/}
                      <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-6">DOB</p>
                        <p className="font-semibold dark:text-[var(--Chatcontainer-text)]">
                          {user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>

                      {/*User Gender*/}
                      <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-6">Gender</p>
                        <p className="font-medium capitalize dark:text-[var(--Chatcontainer-text)]">{user?.gender}</p>
                      </div>

                      {/*User time*/}
                      <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-6">Time</p>
                        <p className="font-semibold dark:text-[var(--Chatcontainer-text)]">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/*User Location*/}
                      {/* <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-6">Location</p>
                        <p className="font-medium dark:text-[var(--Chatcontainer-text)]">California, USA</p>
                      </div> */}

                    </div>
                  </div>
                )}
              </div>
            </div>

            {/*Attached Files Section*/}
            <div className="w-full  bg-gray-100  dark:bg-[#495057]  mt-2 rounded cursor-pointer">

              <div
                className="flex items-center justify-between cursor-pointer px-4 py-2.5"
                onClick={() => handleToggleSection('attachfile')}
              >
                {/*section name and icon*/}
                <div className="flex items-center  dark:text-[var(--Chatcontainer-text)] gap-2">
                  <div className='font-semibold'>
                    <MdAttachFile size={20} />
                  </div>
                  <span className="text-gray-700  dark:text-[var(--Chatcontainer-text)] font-medium">
                    Attached Files
                  </span>
                </div>
                {/*Up and Down Icon*/}
                <div>
                  {activeSection === 'attachfile' ? (
                    <ChevronUp className="w-5 h-5 dark:text-[var(--Chatcontainer-text)] text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 dark:text-[var(--Chatcontainer-text)] text-gray-600" />
                  )}
                </div>
              </div>

              {/*Attached Files inside section detail*/}
              <div>
                {activeSection === 'attachfile' && (
                  <div className="bg-white dark:bg-[#262E35]">
                    <div className="mt-1 px-4 py-2.5 space-y-3 text-sm text-gray-800 max-h-[37vh] overflow-auto">

                      {/*User uploader*/}
                      <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-2">
                          Uploaded by
                        </p>
                        <p className="font-semibold dark:text-[var(--Chatcontainer-text)]">
                          {user?.firstname} {user?.lastname}
                        </p>
                      </div>

                      {/*User Name*/}
                      {/* <div>
                        <p className="text-gray-500 dark:text-[#7f94d2] mt-6">Name</p>
                        <p className="font-semibold dark:text-[var(--Chatcontainer-text)]"> {user?.firstname} {user?.lastname}</p>
                      </div> */}

                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
