
import React, { useState } from "react";
import { FaMobileAlt, FaPaypal, FaCopy, FaCheck } from "react-icons/fa";

const Contribute = () => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "0708432543";

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#F9F6EF] min-h-screen">
      {/* Hero */}
      <div className="px-4 sm:px-6 pt-16 pb-12 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-[#F2C94C] text-[#1B4D3E] px-4 py-1 rounded-full text-xl font-semibold mb-4">
          Every shilling counts
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#1B4D3E] mb-4">
          Help Us Change Lives, One Project at a Time
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
          JustAskAllan isn't just a channel. It's a bridge between people who
          want to help and communities across Kenya who need it. From
          stocking school libraries to supporting families after floods,
          your contribution goes directly into the ground, not overhead.
        </p>
      </div>

      {/* Impact stats */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
          <p className="text-3xl font-bold text-[#1B4D3E]">12+</p>
          <p className="text-gray-500 text-sm mt-1">Community projects supported</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
          <p className="text-3xl font-bold text-[#1B4D3E]">3,000+</p>
          <p className="text-gray-500 text-sm mt-1">Lives directly impacted</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
          <p className="text-3xl font-bold text-[#1B4D3E]">8</p>
          <p className="text-gray-500 text-sm mt-1">Counties reached across Kenya</p>
        </div>
      </div>

      {/* Why we contribute */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
        <h2 className="text-2xl font-bold font-serif text-[#1B4D3E] mb-4">
          Why We Do This
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Every video, article, and guide on this platform is free, but the
          real work happens off camera. A portion of what viewers give goes
          straight into projects like new library books for rural primary
          schools, emergency support for families rebuilding after
          disasters, and small grants for young entrepreneurs testing their
          first business idea.
        </p>
        <p className="text-gray-600 leading-relaxed">
          We believe knowledge and generosity should travel together. If
          something here has taught you, entertained you, or helped you,
          consider passing that forward to someone who needs it more.
        </p>
      </div>

      {/* Ways to give */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-bold font-serif text-[#1B4D3E] mb-6 text-center">
          Ways to Contribute
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* M-Pesa Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1B4D3E] flex items-center justify-center text-white">
                <FaMobileAlt />
              </div>
              <h3 className="text-lg font-semibold text-[#1B4D3E]">M-Pesa</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Send directly via M-Pesa using the number below. Go to M-Pesa,
              then Send Money, then enter the number.
            </p>
            <div className="flex items-center justify-between bg-[#F9F6EF] rounded-xl px-4 py-3">
              <span className="font-mono text-lg font-semibold text-[#1B4D3E]">
                {phoneNumber}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-sm bg-[#F2C94C] text-[#1B4D3E] px-3 py-1.5 rounded-full font-semibold hover:scale-105 transition"
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* PayPal Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1B4D3E] flex items-center justify-center text-white">
                <FaPaypal />
              </div>
              <h3 className="text-lg font-semibold text-[#1B4D3E]">PayPal</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Prefer PayPal? Give securely from anywhere in the world with
              one click.
            </p>
            <a
              href="https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block text-center bg-[#1B4D3E] text-white px-5 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              Give via PayPal
            </a>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          100% of contributions go toward active community projects. Thank
          you for being part of the mission.
        </p>
      </div>
    </div>
  );
};

export default Contribute;