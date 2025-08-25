"use client";
import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 via-white to-blue-100">
      {/* Main Content */}
      <div className="flex-grow p-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
            Student Project Hub 🚀
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A place where students can explore, share, and build amazing projects
            together. Get inspired, learn new skills, and collaborate with peers!
          </p>
        </motion.div>

        {/* Project Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Web Development 🌐",
              color: "text-blue-600",
              desc: "Build websites, apps, and dashboards using React, Next.js, and backend frameworks.",
            },
            {
              title: "AI & Machine Learning 🤖",
              color: "text-green-600",
              desc: "Work on projects involving machine learning, deep learning, and AI models.",
            },
            {
              title: "Cybersecurity 🔐",
              color: "text-purple-600",
              desc: "Learn how to secure applications, detect vulnerabilities, and build tools.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow-lg cursor-pointer"
            >
              <h2 className={`text-xl font-semibold mb-2 ${item.color}`}>
                {item.title}
              </h2>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Collaboration Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-10 rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Collaborate & Share 💡</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Students can upload their project ideas, share resources, and connect
            with peers who have similar interests. Collaboration helps you grow
            and learn faster!
          </p>
        </motion.div>

        {/* Why Projects Matter */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Practical Learning 🎯",
              desc: "Apply theoretical knowledge into real-world practice.",
            },
            {
              title: "Portfolio Building 📂",
              desc: "Showcase your projects to recruiters with hands-on experience.",
            },
            {
              title: "Teamwork 🤝",
              desc: "Improve communication, collaboration, and leadership skills.",
            },
            {
              title: "Innovation 🚀",
              desc: "Explore new ideas and create impactful solutions.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="bg-gray-900 text-gray-300 py-10 mt-12"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <p className="text-sm">
              Student Project Hub is a platform for learners to explore, share,
              and collaborate on innovative projects that boost practical skills
              and career opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Projects</a></li>
              <li><a href="#" className="hover:text-white">Communities</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-sm">📧 support@studenthub.com</p>
            <p className="text-sm">📍 Bengaluru, India</p>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-white font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">🌐</a>
              <a href="#" className="hover:text-white">🐦</a>
              <a href="#" className="hover:text-white">📸</a>
              <a href="#" className="hover:text-white">💼</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Student Project Hub. All rights reserved.
        </div>
      </motion.footer>
    </div>
  );
};

export default Page;
