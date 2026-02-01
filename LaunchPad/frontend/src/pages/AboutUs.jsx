"use client"
import { motion } from "framer-motion"
import {
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaStar,
  FaCheckCircle,
  FaGraduationCap,
} from "react-icons/fa"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6 lg:px-24">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3"></div>
          <div className="p-10">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaRocket className="text-blue-600 text-4xl" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
              About <span className="text-blue-600">LaunchPad</span>
            </h1>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>

            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 mb-6 leading-relaxed text-center max-w-2xl mx-auto"
            >
              Welcome to <span className="font-semibold text-blue-600">LaunchPad</span>, your gateway to the startup
              ecosystem! We are a platform built to <span className="font-medium">empower founders</span> and connect
              them with potential investors, mentors, and early adopters.
            </motion.p>
          </div>
        </div>

        {/* Mission Section */}
        <motion.div variants={fadeIn} className="bg-white shadow-lg rounded-2xl p-8 mb-10 border-l-4 border-blue-600">
          <div className="flex items-center mb-4">
            <FaStar className="text-yellow-500 text-2xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-700 pl-9 leading-relaxed">
            To bridge the gap between visionary founders and forward-thinking investors by providing a streamlined,
            transparent, and opportunity-rich environment where ideas transform into thriving ventures.
          </p>
        </motion.div>

        {/* What We Do Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-lg rounded-2xl p-8 mb-10"
        >
          <div className="flex items-center mb-6">
            <FaLightbulb className="text-blue-600 text-2xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">What We Do</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pl-2">
            <motion.div variants={fadeIn} className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                <FaCheckCircle className="text-blue-600 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Showcase Startups</h3>
                <p className="text-gray-600 text-sm">Detailed profiles and video pitches</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                <FaCheckCircle className="text-blue-600 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Investor Exploration</h3>
                <p className="text-gray-600 text-sm">Help investors find high-potential startups</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                <FaCheckCircle className="text-blue-600 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Smart Matchmaking</h3>
                <p className="text-gray-600 text-sm">Connect startups with the right investors</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4 mt-1">
                <FaCheckCircle className="text-blue-600 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Full-Stage Support</h3>
                <p className="text-gray-600 text-sm">From idea to revenue generation</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Who We Serve Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-lg rounded-2xl p-8 mb-10"
        >
          <div className="flex items-center mb-6">
            <FaUsers className="text-blue-600 text-2xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Who We Serve</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              variants={fadeIn}
              className="bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 p-3 rounded-full inline-flex justify-center items-center mb-4">
                <FaRocket className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Founders</h3>
              <p className="text-gray-600 text-sm">Students, professionals, and innovative thinkers</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 p-3 rounded-full inline-flex justify-center items-center mb-4">
                <FaChartLine className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Investors</h3>
              <p className="text-gray-600 text-sm">Angels, VCs, and investment institutions</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 p-3 rounded-full inline-flex justify-center items-center mb-4">
                <FaGraduationCap className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Mentors & Incubators</h3>
              <p className="text-gray-600 text-sm">Guides and supporters for growing startups</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={fadeIn}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center text-white"
        >
          <FaHandshake className="text-white text-3xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Join us in shaping the future of innovation</h2>
          <p className="mb-6 opacity-90">Let's build, back, and bring ideas to life.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AboutUs
