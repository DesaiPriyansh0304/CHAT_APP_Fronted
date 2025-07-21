import React from 'react';
import { IoSend } from 'react-icons/io5';
import { MdOutlineEmojiEmotions, MdAttachFile, MdImage } from 'react-icons/md';
import EmojiPicker from 'emoji-picker-react';

function Inputside({
  message,
  setMessage,
  handleTyping,
  handleSendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  setFile,
  setImage,
  setEmoji,
  setFileName,
  file,
  image,
  fileName,
}) {
  const onInputChange = (e) => {
    setMessage(e.target.value);
    handleTyping(e);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setImage(images);
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ data: reader.result, name: file.name });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((filesData) => {
      setFile(filesData.map((f) => f.data));
      setFileName(filesData.map((f) => f.name));
    });
  };

  return (
    <>
      {/* 👇 Preview ABOVE input box */}
      {(image.length > 0 || file.length > 0) && (
        <div className="w-full p-3 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2e2e2e] transition-colors duration-300">
          {image.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-2 justify-start">
              {image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`preview-${index}`}
                  className="h-32 w-32 rounded-md object-cover border shadow-sm"
                />
              ))}
              <button onClick={() => setImage([])} className="text-sm text-red-500 underline mt-2">
                Clear Images
              </button>
            </div>
          )}

          {file.length > 0 && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {fileName.map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  📄 <span>{name}</span>
                </div>
              ))}
              <button
                onClick={() => {
                  setFile([]);
                  setFileName([]);
                }}
                className="text-sm text-red-500 underline mt-2"
              >
                Clear Files
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-[#f3f3f6] dark:bg-[#1e1e1e] relative transition-colors duration-300">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter message..."
            value={message}
            onChange={onInputChange}
            className="flex-1 rounded-md py-2 px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
            autoComplete="off"
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            hidden
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="text-2xl text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            <MdImage />
          </label>

          {/* File Upload */}
          <input type="file" onChange={handleFileUpload} multiple hidden id="upload-file" />
          <label
            htmlFor="upload-file"
            className="text-2xl text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            <MdAttachFile />
          </label>

          {/* Emoji Picker Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            title="Emoji"
          >
            <MdOutlineEmojiEmotions />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            className="flex items-center justify-center bg-[#7269EF] text-white rounded-md p-2 hover:bg-[#564cd1] disabled:opacity-50"
            title="Send Message"
            disabled={!message.trim() && image.length === 0 && file.length === 0}
          >
            <IoSend size={20} />
          </button>
        </form>

        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 z-50 bg-white dark:bg-[#2a2a2a] dark:text-white p-2 rounded-md shadow-md">
            <EmojiPicker onEmojiClick={(e) => setEmoji(e.emoji)} />
          </div>
        )}
      </div>
    </>
  );
}

export default Inputside;
