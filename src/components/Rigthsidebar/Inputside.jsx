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
    selectUser,
    selectGroup,
    setFile,
    setImage,
    setEmoji,
    setFileName
}) {
    const onInputChange = (e) => {
        setMessage(e.target.value);
        handleTyping(e);
    };

    // const handleImageUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImage(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const imagePromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then((images) => {
            setImage(images); // 👈 array of base64 images
        });
    };


    // const handleFileUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setFile(reader.result);
    //             setFileName(file.name);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const filePromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve({ data: reader.result, name: file.name });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then((filesData) => {
            setFile(filesData.map(f => f.data));
            setFileName(filesData.map(f => f.name));
        });
    };

    return (
        <div className="p-4 border-t border-gray-200 bg-[#f3f3f6] relative">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Enter message..."
                    value={message}
                    onChange={onInputChange}
                    className="w-full rounded-md py-2 px-4 border border-gray-300 focus:outline-none focus:border-blue-600"
                    autoComplete="off"
                />

                <input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden id="upload-image" />
                <label htmlFor="upload-image" className="text-2xl text-gray-600 cursor-pointer">
                    <MdImage />
                </label>

                <input type="file" onChange={handleFileUpload} multiple hidden id="upload-file" />
                <label htmlFor="upload-file" className="text-2xl text-gray-600 cursor-pointer">
                    <MdAttachFile />
                </label>

                <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="text-2xl text-gray-600 hover:text-gray-800"
                    title="Emoji"
                >
                    <MdOutlineEmojiEmotions />
                </button>

                <button
                    type="submit"
                    className="flex items-center justify-center bg-[#7269EF] text-white rounded-md px-3 py-2 hover:bg-[#564cd1]"
                    title="Send Message"
                    disabled={!message.trim() && !selectUser && !selectGroup}
                >
                    <IoSend size={20} />
                </button>
            </form>

            {showEmojiPicker && (
                <div className="absolute bottom-16 right-4 z-50">
                    <EmojiPicker onEmojiClick={(e) => setEmoji(e.emoji)} />
                </div>
            )}
        </div>
    );
}

export default Inputside;
