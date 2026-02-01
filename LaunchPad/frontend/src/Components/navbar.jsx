"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaRocket,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaSearch,
  FaPlus,
  FaHome,
  FaInfoCircle,
  FaSignInAlt,
} from "react-icons/fa"
import API from "../api/axios"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isHome = location.pathname === "/"
  const isInvestor = location.pathname === "/investor-profile"
  const isFounder = location.pathname === "/founder-profile"
  const isAboutUs = location.pathname === "/about-us"

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await API.post("/logout")
      localStorage.clear()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleExploreStartups = () => {
    navigate("/explore-startups")
  }

  const handleAddStartup = () => {
    navigate("/add-startup")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-gray-900/90 backdrop-blur-lg shadow-lg py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg"
            >
              <FaRocket className="text-white text-xl" />
            </motion.div>
            <div className="text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Launch</span>
              <span className="text-white">Pad</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isHome && (
              <>
                <NavLink to="/about-us" icon={<FaInfoCircle />} label="About Us" />
                <NavLink to="/login" icon={<FaSignInAlt />} label="Login" isPrimary />
              </>
            )}

            {isInvestor && (
              <>
                <NavButton onClick={handleExploreStartups} icon={<FaSearch />} label="Explore Startups" />
                <NavButton onClick={handleLogout} icon={<FaSignOutAlt />} label="Logout" variant="danger" />
              </>
            )}

            {isFounder && (
              <>
                <NavButton onClick={handleAddStartup} icon={<FaPlus />} label="Add Startup" variant="purple" />
                <NavButton onClick={handleExploreStartups} icon={<FaSearch />} label="Explore Startups" />
                <NavButton onClick={handleLogout} icon={<FaSignOutAlt />} label="Logout" variant="danger" />
              </>
            )}

            {isAboutUs && (
              <>
                <NavLink to="/" icon={<FaHome />} label="Home" />
                <NavLink to="/login" icon={<FaSignInAlt />} label="Login" isPrimary />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[60px] left-0 w-full bg-gray-900/95 backdrop-blur-lg z-40 shadow-lg md:hidden"
          >
            <div className="container mx-auto py-6 px-4 flex flex-col gap-4">
              {isHome && (
                <>
                  <MobileNavLink to="/about-us" icon={<FaInfoCircle />} label="About Us" onClick={toggleMobileMenu} />
                  <MobileNavLink
                    to="/login"
                    icon={<FaSignInAlt />}
                    label="Login"
                    onClick={toggleMobileMenu}
                    isPrimary
                  />
                </>
              )}

              {isInvestor && (
                <>
                  <MobileNavButton
                    onClick={() => {
                      handleExploreStartups()
                      toggleMobileMenu()
                    }}
                    icon={<FaSearch />}
                    label="Explore Startups"
                  />
                  <MobileNavButton
                    onClick={() => {
                      handleLogout()
                      toggleMobileMenu()
                    }}
                    icon={<FaSignOutAlt />}
                    label="Logout"
                    variant="danger"
                  />
                </>
              )}

              {isFounder && (
                <>
                  <MobileNavButton
                    onClick={() => {
                      handleAddStartup()
                      toggleMobileMenu()
                    }}
                    icon={<FaPlus />}
                    label="Add Startup"
                    variant="purple"
                  />
                  <MobileNavButton
                    onClick={() => {
                      handleExploreStartups()
                      toggleMobileMenu()
                    }}
                    icon={<FaSearch />}
                    label="Explore Startups"
                  />
                  <MobileNavButton
                    onClick={() => {
                      handleLogout()
                      toggleMobileMenu()
                    }}
                    icon={<FaSignOutAlt />}
                    label="Logout"
                    variant="danger"
                  />
                </>
              )}

              {isAboutUs && (
                <>
                  <MobileNavLink to="/" icon={<FaHome />} label="Home" onClick={toggleMobileMenu} />
                  <MobileNavLink
                    to="/login"
                    icon={<FaSignInAlt />}
                    label="Login"
                    onClick={toggleMobileMenu}
                    isPrimary
                  />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Desktop Navigation Link Component
const NavLink = ({ to, icon, label, isPrimary = false }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isPrimary
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          : "text-gray-200 hover:bg-gray-800/50 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  </Link>
)

// Desktop Navigation Button Component
const NavButton = ({ onClick, icon, label, variant = "default" }) => {
  const variants = {
    default:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30",
    purple:
      "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30",
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${variants[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}

// Mobile Navigation Link Component
const MobileNavLink = ({ to, icon, label, onClick, isPrimary = false }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${
        isPrimary
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          : "text-gray-200 hover:bg-gray-800/50 hover:text-white"
      }`}
    >
      <div className="text-xl">{icon}</div>
      <span>{label}</span>
    </motion.div>
  </Link>
)

// Mobile Navigation Button Component
const MobileNavButton = ({ onClick, icon, label, variant = "default" }) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  }

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-3 p-3 rounded-lg font-medium w-full transition-all ${variants[variant]}`}
    >
      <div className="text-xl">{icon}</div>
      <span>{label}</span>
    </motion.button>
  )
}

export default Navbar
