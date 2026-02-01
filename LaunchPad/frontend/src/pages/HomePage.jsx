"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { FaUsers, FaBriefcase, FaRocket, FaChartLine, FaHandshake } from "react-icons/fa"
import { useInView } from "react-intersection-observer"
import API from "../api/axios"

// Stats Counter Animation
function CounterAnimation({ target, duration = 2 }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    let startTime
    let animationFrame

    if (inView) {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * target))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step)
        }
      }

      animationFrame = requestAnimationFrame(step)
    }

    return () => cancelAnimationFrame(animationFrame)
  }, [inView, target, duration])

  return <span ref={ref}>{count}</span>
}

export default function HomePage() {
  const [stats, setStats] = useState({
    TotalFounders: 0,
    TotalInvestors: 0,
    TotalStartups: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { scrollYProgress } = useScroll()
  const mainRef = useRef(null)

  // Transform scroll progress to missile position values
  const missileY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const missileX = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const missileRotate = useTransform(scrollYProgress, [0, 1], [0, 15])
  const missileScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.8, 1])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await API.get("/stats")

        if (response.data.success) {
          setStats(response.data.data)
        } else {
          throw new Error(response.data.message)
        }
      } catch (err) {
        console.error("Stats fetch error:", err)
        setError(err.message || "Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      value: stats.TotalFounders,
      label: "Visionary Founders",
      icon: <FaRocket />,
      description: "Entrepreneurs building the future",
    },
    {
      value: stats.TotalInvestors,
      label: "Strategic Investors",
      icon: <FaHandshake />,
      description: "Partners fueling innovation",
    },
    {
      value: stats.TotalStartups,
      label: "Breakthrough Startups",
      icon: <FaChartLine />,
      description: "Ideas transforming industries",
    },
  ]

  const pitches = [
    {
      title: "EcoDrive",
      desc: "Revolutionary AI-powered route optimization reducing carbon emissions by 40% for delivery fleets while cutting operational costs.",
      image:
        "https://img.freepik.com/free-photo/close-up-smartphone-screen-showing-location-map-with-navigation_1150-12650.jpg",
      color: "#4ade80",
      category: "Sustainability",
    },
    {
      title: "HealthSync",
      desc: "Telehealth platform bridging healthcare gaps by connecting rural clinics with specialists worldwide through secure, low-bandwidth video consultations.",
      image: "https://img.freepik.com/free-photo/doctor-using-laptop-computer-video-call-with-patient_1150-14989.jpg",
      color: "#60a5fa",
      category: "Healthcare",
    },
    {
      title: "EduVerse",
      desc: "Immersive VR classrooms transforming education with interactive 3D models and collaborative learning environments for K-12 and higher education.",
      image: "https://img.freepik.com/free-photo/virtual-reality-headset-with-virtual-screen_1150-12649.jpg",
      color: "#f472b6",
      category: "Education",
    },
    {
      title: "SmartFit",
      desc: "AI-driven personal training app with real-time motion tracking that provides instant form correction and personalized workout plans.",
      image: "https://img.freepik.com/free-photo/smartwatch-with-fitness-tracking-app_1150-12648.jpg",
      color: "#fb923c",
      category: "Fitness",
    },
    {
      title: "AgriTech",
      desc: "Smart farming solutions using IoT sensors and predictive analytics to optimize crop yields while reducing water usage by up to 30%.",
      image: "https://img.freepik.com/free-photo/drone-monitoring-crops-in-field_1150-12647.jpg",
      color: "#a3e635",
      category: "Agriculture",
    },
    {
      title: "FitTrack",
      desc: "Wearable tech with advanced biometric sensors that monitor health markers and provide early detection of potential health issues.",
      image: "https://img.freepik.com/free-photo/fitness-tracker-on-wrist_1150-12646.jpg",
      color: "#c084fc",
      category: "Health Tech",
    },
  ]

  return (
    <div
      ref={mainRef}
      className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white relative overflow-hidden"
    >
      {/* Animated Missile (CSS-based instead of Three.js) */}
      <motion.div
        className="fixed bottom-0 right-0 z-10 pointer-events-none"
        style={{
          y: missileY,
          x: missileX,
          rotate: missileRotate,
          scale: missileScale,
        }}
      >
        <div className="relative">
          <FaRocket className="text-blue-500 text-5xl" />
          <div className="absolute -bottom-6 -left-1 w-8 h-12 bg-gradient-to-t from-blue-500/80 to-transparent rounded-full blur-md"></div>
        </div>
      </motion.div>

      {/* Hero Section - Enhanced */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://img.freepik.com/free-photo/group-diverse-people-having-business-meeting_53876-25060.jpg?t=st=1744815699~exp=1744819299~hmac=2bf550ce03c25fce2d1227360dfe78012b01b2fc90416c9a5d1dc6b76d25e161&w=1380"
            alt="Hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        </div>

        <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-left mb-10 md:mb-0"
          >
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30">
              <span className="text-blue-300 font-medium">Transforming Ideas into Reality</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Elevate Your Vision
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold max-w-2xl mb-8 leading-relaxed text-gray-200">
              We connect groundbreaking innovations with strategic investors and industry experts who can transform your
              concept into a market-leading reality.
            </h2>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-lg font-bold shadow-lg hover:shadow-blue-500/20 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>Launch Your Journey</span>
              <FaRocket className="text-sm" />
            </motion.a>
          </motion.div>

          <div className="md:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-64 h-64 md:w-80 md:h-80"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
              <div
                className="absolute inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaRocket className="text-7xl md:text-8xl text-white" />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>

      {/* Stats Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30">
              <span className="text-blue-300 font-medium">Our Impact</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Driving Innovation Forward
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">
              Our platform has become the catalyst for groundbreaking collaborations between visionaries and investors,
              creating a thriving ecosystem of innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm hover:from-gray-800 hover:to-gray-800 transition-all duration-300 rounded-xl shadow-xl p-8 text-center border border-blue-500/10 group"
              >
                <div className="text-5xl text-blue-400 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  {loading ? "..." : <CounterAnimation target={stat.value} />}
                </div>
                <div className="text-xl text-blue-200 font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>

          {error && <div className="text-red-500 text-center mt-6 text-lg font-medium">{error}</div>}
        </div>
      </section>

      {/* Founders vs Investors Section - Enhanced */}
      <section className="min-h-[600px] flex flex-col justify-center items-center px-6 py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30">
            <span className="text-blue-300 font-medium">Join Our Ecosystem</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Connect & Collaborate
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg">
            Whether you're building the next big thing or looking to invest in tomorrow's innovations, our platform
            brings together the perfect partners.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl relative z-10">
          {/* Founder Box */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1)" }}
            className="h-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-10 rounded-2xl shadow-xl border border-blue-500/20 text-center transition-all duration-300"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <FaUsers className="text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Visionary Founders</h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              I'm an entrepreneur with groundbreaking ideas seeking strategic investment and expert mentorship to
              transform my vision into market-leading reality.
            </p>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center h-12 px-6 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20"
            >
              Start Your Journey
            </motion.a>
          </motion.div>

          {/* Investor Box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1)" }}
            className="h-full bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-10 rounded-2xl shadow-xl border border-purple-500/20 text-center transition-all duration-300"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <FaBriefcase className="text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Strategic Investors</h2>
            <p className="text-purple-100 mb-8 leading-relaxed">
              I have the capital, industry connections, and expertise to fuel promising startups, helping them scale
              rapidly while providing valuable strategic guidance.
            </p>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center h-12 px-6 font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-full hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-600/20"
            >
              Discover Opportunities
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Sample Pitches Section - Enhanced */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-900 to-gray-800 relative">
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto relative z-10"
        >
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30">
              <span className="text-blue-300 font-medium">Innovation Showcase</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              Breakthrough Startup Ventures
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Explore revolutionary ideas that are reshaping industries and creating new market opportunities. These
              innovative startups are tackling real-world challenges with cutting-edge solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pitches.map((pitch, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: `0 20px 25px -5px ${pitch.color}22` }}
                className="group h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden relative transition-all duration-300"
              >
                <div
                  className="absolute -right-10 -top-10 w-24 h-24 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                  style={{ background: `${pitch.color}33` }}
                ></div>

                <div className="relative p-6">
                  <div
                    className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full"
                    style={{ backgroundColor: `${pitch.color}22`, color: pitch.color }}
                  >
                    {pitch.category}
                  </div>

                  <div className="overflow-hidden rounded-xl mb-5">
                    <img
                      src={pitch.image || "/placeholder.svg"}
                      alt={pitch.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">
                    {pitch.title}
                  </h3>

                  <p className="text-gray-400">{pitch.desc}</p>

                  <div className="mt-6 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      Learn more →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section - Enhanced */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Vision Into Reality?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join our thriving ecosystem of innovators, investors, and industry experts to accelerate your journey from
              concept to market leadership.
            </p>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-900 rounded-full text-lg font-bold shadow-xl hover:shadow-white/20 transition-all duration-300 inline-flex items-center gap-2"
            >
              <span>Begin Your Journey</span>
              <FaRocket className="text-sm" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      
    </div>
  )
}
