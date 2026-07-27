import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#1B4D3E]/10 text-[#1B4D3E] px-5 py-2 rounded-full font-semibold">
            About Allan
          </span>

          <h1 className="text-5xl font-bold text-[#1B4D3E] mt-6">
            Allan Kipruto
          </h1>

          <p className="text-xl text-gray-600 mt-4">
            Grade 6 Student • Kipusi Primary School
          </p>
        </div>

        {/* About */}
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-[#1B4D3E] mb-6">
            Who I Am
          </h2>

          <p className="text-gray-700 leading-8 mb-6">
            Hello! I'm <strong>Allan Kipruto</strong>, a Grade 6 student at
            <strong> Kipusi Primary School</strong>. I enjoy learning new
            things every day and sharing knowledge with others. I believe that
            learning becomes more meaningful when we help one another grow.
          </p>

          <p className="text-gray-700 leading-8 mb-6">
            I created <strong>Just Ask Allan</strong> to share educational
            articles, useful guides, and learning resources with students and
            anyone interested in gaining new knowledge. My goal is to make
            learning simple, enjoyable, and accessible to everyone.
          </p>

          <p className="text-gray-700 leading-8">
            I am passionate about teaching people, inspiring others to keep
            learning, and making a positive impact in my community. I hope this
            platform encourages curiosity, creativity, and a love for lifelong
            learning.
          </p>
        </div>

        {/* Interests */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-[#1B4D3E] mb-4">
              My Interests
            </h3>

            <ul className="space-y-3 text-gray-700">
              <li>📚 Learning new things</li>
              <li>👨‍🏫 Teaching and helping others</li>
              <li>🌍 Making a positive impact</li>
              <li>💻 Technology and educational content</li>
              <li>📖 Reading and personal growth</li>
            </ul>
          </div>

          <div className="bg-[#1B4D3E] rounded-2xl shadow-md p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              My Vision
            </h3>

            <p className="leading-8">
              To inspire students to love learning, share knowledge with
              others, and use education to make a positive difference in the
              world. Every small step in learning today creates a brighter
              future tomorrow.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
