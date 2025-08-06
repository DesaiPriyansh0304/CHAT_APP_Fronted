import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, User, Clock } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-right { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-up-delay { animation: slide-up 0.8s ease-out 0.2s both; }
        .animate-slide-left { animation: slide-left 0.8s ease-out 0.3s both; }
        .animate-slide-right { animation: slide-right 0.8s ease-out 0.4s both; }
        .animate-fade-in-delay { animation: fade-in 1s ease-out 0.6s both; }
        .hover-scale:hover { transform: scale(1.02); transition: transform 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `
            }} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl font-bold text-slate-800 mb-4 animate-slide-up">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-slide-up-delay">
                        Have a question or want to work together? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2 gap-5">
                        <div className="bg-white rounded-3xl shadow-xl p-8 hover-scale animate-slide-left border border-slate-100">
                            <h2 className="text-3xl font-semibold text-slate-800 mb-8 flex items-center">
                                <MessageCircle className="mr-3 text-blue-600" />
                                Send us a message
                            </h2>

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                        <div className="relative">

                                            <User className="absolute mt-[5px]'> left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none hover:border-slate-300 transition-all duration-300"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block  text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                        <div className="relative">

                                            <Mail className="absolute mt-[5px] left-3 top-3 h-5 w-5 text-slate-400" />

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none hover:border-slate-300 transition-all duration-300"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none hover:border-slate-300 transition-all duration-300"
                                        placeholder="What's this about?"
                                        required
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="6"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none hover:border-slate-300 resize-none transition-all duration-300"
                                        placeholder="Tell us more about your project or inquiry..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl hover-scale hover:shadow-xl focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className='bg-white rounded-3xl flex gap-5.5 shadow-xl p-8 hover-scale animate-slide-left border border-slate-100 mt-3.5 h-[243px]'>

                            <div className=' bg-red-200 w-[240px]  '>
                                <div className='flex'>
                                    <div className='bg-black rounded-full h-12 w-12 m-2'>
                                        <img src="#" alt="rgreg" />
                                    </div>
                                    <div className='mt-2'>
                                        <p>Name</p>
                                        <p>Email</p>
                                    </div>
                                </div>
                                <div>
                                    RIview
                                </div>
                            </div>
                            <div className=' bg-red-200 w-[240px]  '>
                                <div className='flex'>
                                    <div className='bg-black rounded-full h-12 w-12 m-2'>
                                        <img src="#" alt="rgreg" />
                                    </div>
                                    <div className='mt-2'>
                                        <p>Name</p>
                                        <p>Email</p>
                                    </div>
                                </div>
                                <div>
                                    RIview
                                </div>
                            </div>
                            <div className=' bg-red-200 w-[240px]  '>
                                <div className='flex'>
                                    <div className='bg-black rounded-full h-12 w-12 m-2'>
                                        <img src="#" alt="rgreg" />
                                    </div>
                                    <div className='mt-2'>
                                        <p>Name</p>
                                        <p>Email</p>
                                    </div>
                                </div>
                                <div>
                                    RIview
                                </div>
                            </div>




                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 animate-slide-right">
                        {/* Contact Cards */}
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-full pulse-glow">
                                        <Mail className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Email</h3>
                                        <p className="text-slate-600">vibetalk@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-green-100 p-3 rounded-full pulse-glow">
                                        <Phone className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Phone</h3>
                                        <p className="text-slate-600">+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-purple-100 p-3 rounded-full pulse-glow">
                                        <MapPin className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Location</h3>
                                        <p className="text-slate-600">Surat, Gujarat</p>
                                    </div>
                                </div>
                            </div>

                            {/* Response Time */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-orange-100 p-3 rounded-full pulse-glow">
                                        <Clock className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Response Time</h3>
                                        <p className="text-slate-600">Within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Map */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover-scale border border-slate-100">
                            <h3 className="text-slate-800 font-semibold mb-4">Find Us</h3>
                            <div className="rounded-xl overflow-hidden w-full h-48 mb-4">
                                <iframe
                                    title="Surat Map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.405429439583!2d72.83106007521314!3d21.21514538047554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e9b3f99d8b3%3A0xa17bb132b0ff410!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1691412345678"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>

                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-slate-700 mb-2">Visit Us Anytime</h4>
                                <p className="text-slate-500 text-sm mb-4">
                                    Our Surat office is open Monday to Saturday, 10am–6pm.
                                </p>
                                <a
                                    href="https://www.google.com/maps/dir//Surat,+Gujarat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trusted Companies Section */}
                <div className="mt-16 animate-fade-in-delay">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-semibold text-slate-700 mb-2">Trusted by Leading Companies</h3>
                        <p className="text-slate-500">Join the companies that trust us with their projects</p>
                    </div>

                    <div className="flex justify-center items-center">
                        <div className="flex max-w-md lg:max-w-none w-auto lg:w-full flex-wrap items-center justify-center lg:justify-between px-5">
                            <div className="m-4 lg:mx-0 w-28 flex items-center justify-center">
                                <svg
                                    width="85"
                                    height="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label="Netflix"
                                    className="fill-current"
                                >
                                    <path d="M11.7 22.4c-1.3.3-2.6.3-4 .5l-4-12.5v13L0 24V0h3.4l4.7 13.6V0h3.6v22.4zm7-13.6h4.9v3.7h-4.9v5.6l6.4-.4v3.6l-10 .8V0h10v3.8h-6.3v5zm19.8-5h-3.8V21h-3.6V3.7h-3.7V0h11v3.8zm5.8 4.7h4.9v3.8h-5v8.5h-3.4V0h10v3.8h-6.5v4.7zm12.3 9l6.1.3v3.7L53 21V0h3.6v17.5zm9.2 4.3l3.5.3V0h-3.6v21.8zM85 0l-4.5 11.4L85 24l-4-.7-2.6-7-2.6 6.4-3.9-.5 4.6-11L72.3 0h4l2.3 6.3L81 0H85z"></path>
                                </svg>
                            </div>
                            <div className="m-4 lg:mx-0 w-28 flex items-center justify-center">
                                <svg
                                    width="105"
                                    viewBox="0 0 93 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label="Meta"
                                    className="fill-current"
                                >
                                    <g clip-path="url(#clip0_761_32520)">
                                        <path
                                            d="M20.9618 -0.000389189C24.1191 0.674046 25.8307 2.84579 26.9732 5.53815C28.1301 8.26386 28.4865 11.1014 27.9286 14.0208C27.8721 14.3166 27.7747 14.6081 27.6728 14.8931C26.6012 17.8802 23.0597 18.9408 20.4127 17.0638C19.2613 16.2474 18.4421 15.1437 17.6937 13.9993C16.6896 12.4643 15.7408 10.8971 14.7666 9.34382C14.6149 9.1018 14.4566 8.86408 14.2496 8.54461C14.1057 8.75866 13.9949 8.90926 13.8975 9.06845C12.8226 10.8325 11.8107 12.6364 10.6527 14.3478C10.0051 15.304 9.2135 16.2183 8.31455 16.9551C6.00409 18.8451 2.4371 18.0588 1.07097 15.4482C0.358018 14.0842 0.226277 12.6213 0.28938 11.1283C0.392338 8.67154 0.979086 6.33629 2.22565 4.1796C3.40911 2.12941 5.02765 0.576162 7.47207 -0.000389189H9.13047C11.5206 0.437402 13.1325 1.9616 14.5596 3.69771C14.6437 3.65684 14.6835 3.64823 14.7068 3.62457C14.781 3.54604 14.8507 3.46429 14.9182 3.38039C16.1681 1.8336 17.5597 0.469672 19.6355 -0.00146484H20.9629L20.9618 -0.000389189ZM25.6115 11.635C25.4997 9.59767 25.0657 7.50553 24.2996 5.84472C23.8047 4.77444 23.1626 3.80528 22.1939 3.07598C20.83 2.04981 19.2702 2.06702 18.0324 3.21582C17.3483 3.85153 16.7859 4.61309 16.2036 5.34346C16.1084 5.46286 16.1183 5.75974 16.2069 5.89957C17.6804 8.22084 19.155 10.541 20.6772 12.8332C21.1001 13.47 21.6083 14.0875 22.195 14.5823C23.2246 15.4503 24.7158 15.0598 25.1642 13.8132C25.4133 13.1215 25.4698 12.3643 25.6126 11.636L25.6115 11.635ZM8.65553 2.9781C7.2108 2.96627 6.40153 3.56003 5.73507 4.35924C4.4398 5.91356 3.80766 7.74325 3.49104 9.6848C3.27848 10.9896 3.12349 12.3051 3.58735 13.5927C4.12539 15.0857 5.71625 15.5062 6.94843 14.4618C7.44218 14.0434 7.90162 13.5593 8.26584 13.0333C9.73271 10.9207 11.1608 8.7834 12.5834 6.64285C12.672 6.50947 12.6698 6.20936 12.5735 6.09104C11.9934 5.38003 11.4133 4.66257 10.7557 4.02041C10.1102 3.39007 9.31645 2.97057 8.65553 2.97702V2.9781Z"
                                            fill="current"
                                        ></path>
                                        <path
                                            d="M49.8056 4.94991C49.5576 5.37909 49.3097 5.8072 49.0628 6.23639C47.7299 8.5555 46.3892 10.8703 45.0729 13.198C44.867 13.5616 44.6256 13.7111 44.2016 13.6842C43.6879 13.652 43.1687 13.652 42.655 13.6842C42.2288 13.7111 41.9908 13.5584 41.7849 13.1959C40.3147 10.6035 38.8235 8.02305 37.3378 5.4404C37.2426 5.27475 37.1363 5.11448 36.9304 4.96819V5.52753C36.9304 9.35901 36.9204 13.1894 36.9425 17.0209C36.9459 17.5351 36.8042 17.7147 36.2661 17.6749C35.6617 17.6308 35.0506 17.6512 34.4428 17.6695C34.104 17.6792 33.9667 17.5533 33.9999 17.2328C34.0088 17.1446 33.9999 17.0542 33.9999 16.966C33.9999 11.7276 33.9999 6.48809 33.9999 1.24966C33.9999 0.782104 34.2431 0.547611 34.7295 0.546177C35.5033 0.545101 36.2783 0.563388 37.051 0.538648C37.4352 0.526815 37.6433 0.66665 37.8271 0.990422C39.5353 4.00441 41.2601 7.00871 42.9805 10.0162C43.1289 10.2755 43.2783 10.5336 43.4676 10.8617C44.2072 9.57092 44.9035 8.35866 45.5965 7.14639C46.7634 5.1048 47.9369 3.06644 49.0893 1.01731C49.2787 0.680634 49.4956 0.522513 49.9064 0.536496C50.7156 0.564463 51.5282 0.555858 52.3386 0.540799C52.7095 0.533269 52.86 0.64944 52.8589 1.03022C52.8501 6.41172 52.8501 11.7932 52.8589 17.1736C52.8589 17.5329 52.7615 17.6878 52.3619 17.6706C51.7186 17.6437 51.0721 17.6469 50.4278 17.6706C50.047 17.6846 49.9097 17.5641 49.9152 17.1866C49.934 15.9926 49.9219 14.7986 49.9219 13.6046C49.9219 10.7369 49.9219 7.86816 49.9219 5.00046L49.8056 4.94991V4.94991Z"
                                            fill="current"
                                        ></path>
                                        <path
                                            d="M89.4751 6.26349C89.5017 6.1172 89.5205 6.05051 89.5238 5.98382C89.5607 5.26026 89.9471 4.89849 90.6829 4.89849C91.1435 4.89849 91.604 4.90171 92.0646 4.90709C92.1177 4.90709 92.1697 4.9286 92.2749 4.95119V17.659C91.4557 17.659 90.6342 17.6719 89.8139 17.6428C89.7154 17.6396 89.5604 17.4191 89.5438 17.2857C89.505 16.9533 89.5305 16.6134 89.5305 16.2036C89.3932 16.2778 89.3046 16.2993 89.257 16.3542C87.3872 18.5324 82.8736 18.7852 80.582 15.6658C78.514 12.8508 78.8948 8.30401 81.3691 6.0645C83.4991 4.13692 87.2853 4.05302 89.2382 6.08708C89.2858 6.13764 89.3511 6.17206 89.474 6.26349H89.4751ZM89.4962 11.29C89.4962 10.7737 89.5072 10.2574 89.4906 9.74216C89.484 9.53456 89.4607 9.30652 89.3655 9.12581C88.6714 7.79522 87.5256 7.10896 86 7.08852C84.4966 7.06808 83.3253 7.6769 82.6445 9.01609C82.1153 10.0573 82.0577 11.1609 82.226 12.2979C82.5913 14.7569 84.7911 16.0745 87.2167 15.2678C88.7267 14.7655 89.4962 13.7285 89.4962 12.1979C89.4962 11.8956 89.4962 11.5923 89.4962 11.29V11.29Z"
                                            fill="current"
                                        ></path>
                                        <path
                                            d="M58.2322 12.317C58.4403 13.5519 58.9684 14.5479 60.0732 15.0804C62.2453 16.1259 64.2126 15.5644 66.0348 14.1209C66.5463 14.7286 67.0422 15.3181 67.6002 15.9807C67.0755 16.3378 66.626 16.7057 66.1212 16.9767C64.2568 17.9771 62.2663 18.2342 60.1917 17.777C58.4491 17.393 57.0708 16.4572 56.2416 14.9287C54.8312 12.3299 54.8932 9.70208 56.5106 7.21087C57.8712 5.11549 60.505 4.16784 63.1453 4.72395C65.7193 5.26501 67.0622 6.98713 67.6124 9.3525C67.7962 10.142 67.7696 10.9767 67.8581 11.7889C67.9046 12.2223 67.712 12.3267 67.2902 12.3245C64.5093 12.3095 61.7272 12.317 58.9462 12.317C58.7292 12.317 58.5111 12.317 58.231 12.317H58.2322ZM64.9742 10.2087C64.9421 8.30373 63.5594 6.95809 61.705 6.97638C59.9171 6.99359 58.3207 8.48659 58.2864 10.2087H64.9731H64.9742Z"
                                            fill="current"
                                        ></path>
                                        <path
                                            d="M68.6025 4.91012H71.2274V2.68352C71.2274 1.67169 71.7407 1.16577 72.7673 1.16577C73.6212 1.16577 74.0482 1.57739 74.0482 2.40062V4.89722C74.4268 4.89722 74.7667 4.89722 75.1077 4.89722C75.8815 4.89722 76.6576 4.92733 77.4281 4.88646C77.9362 4.85957 78.0757 5.04351 78.0359 5.49851C78.0016 5.88789 77.9982 6.28481 78.0359 6.67312C78.0846 7.16362 77.8654 7.28194 77.3982 7.26903C76.4406 7.24214 75.4819 7.27119 74.5242 7.2572C74.1711 7.25182 74.0393 7.36477 74.0416 7.71758C74.0582 9.57093 74.0515 11.4232 74.0626 13.2766C74.0637 13.5057 74.1102 13.7369 74.1545 13.9639C74.3493 14.9675 74.9106 15.4472 75.9723 15.4849C76.6277 15.5085 77.2853 15.4892 78.0193 15.4892C78.0193 16.1002 78.0337 16.7714 78.0038 17.4415C77.9993 17.5437 77.8089 17.6964 77.6794 17.7265C76.4262 18.0191 75.1652 18.0966 73.9153 17.7179C72.3123 17.2317 71.3193 15.899 71.265 14.0284C71.2063 11.9987 71.2141 9.96677 71.2384 7.93594C71.2451 7.38951 71.0868 7.20342 70.5255 7.25075C70.014 7.29485 69.4937 7.27656 68.98 7.24429C68.8483 7.23569 68.6224 7.07542 68.618 6.97646C68.5859 6.30632 68.6014 5.63404 68.6014 4.90905L68.6025 4.91012Z"
                                            fill="current"
                                        ></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_761_32520">
                                            <rect
                                                width="92"
                                                height="18"
                                                fill="white"
                                                transform="translate(0.275391)"
                                            ></rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="m-4 lg:mx-0 w-28 flex items-center justify-center">
                                <svg
                                    width="36"
                                    height="43"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label="Apple"
                                    className="fill-current"
                                >
                                    <path d="M35.3 33.5a23.4 23.4 0 01-2.3 4.1 21.1 21.1 0 01-3 3.6 5.7 5.7 0 01-3.8 1.7c-1 0-2.2-.3-3.5-.8a10 10 0 00-3.8-.9c-1.2 0-2.5.3-4 .9-1.3.5-2.4.8-3.3.9-1.3 0-2.6-.6-3.9-1.8a22 22 0 01-3-3.7A25.8 25.8 0 011.3 31 24 24 0 010 23.2c0-2.9.6-5.4 1.9-7.5a11 11 0 013.9-4 10.4 10.4 0 015.2-1.4c1 0 2.4.3 4 1 1.8.6 2.8.9 3.3.9.4 0 1.6-.4 3.6-1.1 2-.7 3.5-1 4.9-.9 3.6.3 6.3 1.7 8 4.3a9 9 0 00-4.7 8.2 9.1 9.1 0 003 6.8 9.7 9.7 0 002.9 2 32.3 32.3 0 01-.8 2zM27 .9a9.2 9.2 0 01-2.3 6c-2 2.2-4.2 3.5-6.6 3.2a6.7 6.7 0 01-.1-.8c0-2 .9-4.2 2.5-6 .8-1 1.8-1.7 3-2.3a9 9 0 013.4-1l.1.9z"></path>
                                </svg>
                            </div>
                            <div className="m-4 lg:mx-0 w-28 flex items-center justify-center">
                                <svg
                                    width="97"
                                    height="32"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label="Google"
                                    className="fill-current"
                                >
                                    <path d="M41.6 16.8a7.8 7.8 0 01-8 7.9c-4.4 0-8-3.4-8-8 0-4.5 3.6-7.8 8-7.8s8 3.3 8 7.9zm-3.5 0c0-2.9-2-4.8-4.5-4.8-2.4 0-4.5 2-4.5 4.8s2 4.8 4.5 4.8 4.5-2 4.5-4.8zm20.7 0c0 4.5-3.6 7.9-8 7.9s-8-3.4-8-8a7.8 7.8 0 018-7.8c4.4 0 8 3.3 8 7.9zm-3.5 0c0-2.9-2-4.8-4.5-4.8-2.4 0-4.5 2-4.5 4.8s2.1 4.8 4.5 4.8 4.5-2 4.5-4.8zm20-7.4v14.1c0 5.8-3.4 8.2-7.5 8.2a7.6 7.6 0 01-7-4.6l3-1.3a4.4 4.4 0 004 2.8c2.6 0 4.2-1.6 4.2-4.6v-1.1c-.9 1-2.4 1.8-4.3 1.8a7.8 7.8 0 01-7.6-7.9c0-4.5 3.6-8 7.6-8 2 0 3.4 1 4.2 1.8h.1V9.4h3.4zm-3 7.4c0-2.8-1.9-4.8-4.3-4.8s-4.4 2-4.4 4.8c0 2.7 2 4.7 4.4 4.7 2.4 0 4.3-2 4.3-4.7zm8.5-15.7v23h-3.4v-23zm13.3 18.3l2.8 1.8a8 8 0 01-6.7 3.5 7.8 7.8 0 01-7.9-8c0-4.6 3.4-7.8 7.5-7.8s6.2 3.2 6.8 5l.4.9-10.7 4.4a4 4 0 004 2.4c1.7 0 3-1 3.8-2.2zm-8.3-2.9l7-2.9c-.3-1-1.5-1.7-2.9-1.7a4.3 4.3 0 00-4.1 4.6zm-73.1-1.8v-3.3H24l.1 2a11 11 0 01-2.9 7.8c-2.2 2.3-5 3.5-8.6 3.5C5.9 24.7 0 19.2 0 12.4S6 .2 12.7.2c3.8 0 6.4 1.4 8.5 3.3L18.8 6a8.7 8.7 0 00-6.1-2.4 8.8 8.8 0 00-8.9 9c0 4.8 3.9 8.8 8.9 8.8a8.3 8.3 0 006.2-2.4 6.9 6.9 0 001.9-4.2h-8.1z"></path>
                                </svg>
                            </div>
                            <div className="m-4 lg:mx-0 w-28 flex items-center justify-center">
                                <svg
                                    width="81"
                                    height="25"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label="Amazon"
                                    className="fill-current"
                                >
                                    <g fill-rule="evenodd">
                                        <path d="M50.3 19.5A30.3 30.3 0 0132.9 25a31.1 31.1 0 01-21.3-8.4c-.4-.4 0-1 .5-.6a42 42 0 0021.2 5.8c5.3 0 11-1.1 16.3-3.4.8-.4 1.4.5.7 1.1"></path>
                                        <path d="M52.2 17.2c-.6-.8-4-.4-5.5-.2-.5 0-.5-.3-.1-.6 2.7-2 7.1-1.4 7.6-.7.5.6-.1 5.1-2.7 7.3-.3.3-.7.1-.5-.3.5-1.4 1.8-4.7 1.2-5.5M46.8 2.7V.8a.5.5 0 01.5-.4h8.2c.3 0 .5.2.5.4v1.6c0 .3-.2.7-.6 1.2L51 10a9 9 0 014.7 1c.3.2.4.5.5.7v2c0 .3-.3.6-.6.5a9.3 9.3 0 00-8.8 0c-.3.1-.6-.2-.6-.4v-2c0-.3 0-.8.3-1.3l5-7.2h-4.3a.5.5 0 01-.5-.5m-30 11.8h-2.5a.5.5 0 01-.5-.5V1c0-.3.2-.5.5-.5h2.3c.3 0 .5.2.5.4v1.8C17.7.9 19 0 20.4 0c1.6 0 2.6.8 3.3 2.5A3.6 3.6 0 0127 0c1.1 0 2.2.5 3 1.5.7 1 .6 2.7.6 4V14a.5.5 0 01-.5.5h-2.5a.5.5 0 01-.5-.5V7 4.5c-.2-.8-.8-1-1.5-1-.6 0-1.3.3-1.5 1-.3.7-.2 1.8-.2 2.5v7a.5.5 0 01-.5.5H21a.5.5 0 01-.5-.5V7c0-1.5.3-3.6-1.5-3.6s-1.8 2-1.8 3.6v7a.5.5 0 01-.4.5M63 0c3.7 0 5.7 3.3 5.7 7.4 0 4-2.2 7.2-5.7 7.2-3.7 0-5.7-3.2-5.7-7.3s2-7.3 5.7-7.3m0 2.7c-1.8 0-2 2.6-2 4.2s0 5 2 5 2-2.7 2-4.4c0-1.1 0-2.5-.3-3.5s-.9-1.3-1.7-1.3m10.5 11.7h-2.5a.5.5 0 01-.4-.5V.8a.5.5 0 01.5-.4h2.3a.5.5 0 01.4.4v2h.1C74.7 1 75.7 0 77.4 0c1.1 0 2.2.4 3 1.6.6 1 .6 2.8.6 4V14a.5.5 0 01-.5.5H78a.5.5 0 01-.4-.5V7c0-1.4.1-3.5-1.6-3.5-.6 0-1.2.4-1.5 1a6 6 0 00-.4 2.5v7a.5.5 0 01-.4.6M40.3 8.2c0 1 0 1.8-.5 2.7-.4.7-1 1.2-1.7 1.2-1 0-1.6-.8-1.6-1.9 0-2.2 2-2.6 3.8-2.6v.6m2.5 6.2a.5.5 0 01-.6 0c-.8-.6-1-1-1.4-1.6-1.4 1.4-2.4 1.8-4.2 1.8-2.1 0-3.7-1.3-3.7-4 0-2 1-3.4 2.6-4.1 1.4-.6 3.3-.8 4.8-1v-.3c0-.6 0-1.3-.3-1.8s-1-.7-1.5-.7c-1 0-1.8.5-2 1.6 0 .2-.2.4-.4.4l-2.4-.2c-.2 0-.5-.3-.4-.6.5-3 3.2-3.9 5.6-3.9 1.2 0 2.8.3 3.8 1.3 1.2 1.1 1 2.7 1 4.4v4c0 1.2.6 1.7 1 2.4.2.2.2.5 0 .6l-2 1.7M7.5 8.2c0 1 0 1.8-.5 2.7-.4.7-1 1.2-1.7 1.2-1 0-1.5-.8-1.5-1.9 0-2.2 1.9-2.6 3.7-2.6v.6m2.5 6.2a.5.5 0 01-.6 0c-.8-.6-1-1-1.4-1.6-1.4 1.4-2.4 1.8-4.1 1.8-2.1 0-3.8-1.3-3.8-4 0-2 1.1-3.4 2.7-4.1 1.3-.6 3.2-.8 4.7-1v-.3c0-.6 0-1.3-.3-1.8s-1-.7-1.4-.7c-1 0-1.8.5-2 1.6 0 .2-.2.4-.5.4L.8 4.5c-.2-.1-.4-.3-.4-.6C1 1 3.6 0 6 0c1.3 0 2.8.3 3.8 1.3C11 2.4 10.9 4 10.9 5.7v4c0 1.2.5 1.7 1 2.4v.6l-2 1.7"></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center animate-fade-in-delay">
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover-scale border border-slate-100">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-slate-600 mb-2">Made with ❤️ by</p>
                        <p className="text-2xl font-bold text-slate-800 mb-1">Desai Priyansh</p>
                        <p className="text-slate-500 mb-4">Chat App Developer</p>
                        <div className="flex justify-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}