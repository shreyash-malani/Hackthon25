"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  FaRocket,
  FaFileUpload,
  FaVideo,
  FaMapMarkerAlt,
  FaLaptopCode,
  FaGraduationCap,
  FaBuilding,
  FaLeaf,
  FaHeartbeat,
  FaLightbulb,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa"

// Assuming you're using Next.js with App Router
// If using React Router, uncomment this and the navigate references
// import { useRouter } from 'next/navigation'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const AddStartup = () => {
  // For Next.js App Router
  // const router = useRouter()

  // For React Router
  // const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    domain: "tech",
    stage: "Idea",
    location: "",
    description: "",
    startupPdf: null,
    pitch: null,
  })

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState("basic")

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")

    try {
      // Simulate API call for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success message
      setSuccessMessage("Startup submitted successfully!")

      // Redirect after success
      setTimeout(() => {
        // For Next.js App Router
        // router.push('/founder-profile')

        // For React Router
        // navigate('/founder-profile')

        console.log("Redirecting to founder profile...")
      }, 1200)

      // Uncomment below for actual API implementation
      /*
      const payload = new FormData()
      Object.entries(formData).forEach(([key, val]) => {
        if (val != null) payload.append(key, val)
      })

      const res = await API.post('/startup', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage('Startup submitted successfully!')
        setTimeout(() => navigate('/founder-profile'), 1200)
      } else {
        setError('Something went wrong!')
      }
      */
    } catch (err) {
      setError(err?.response?.data?.message || "Error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDomainIcon = (domain) => {
    switch (domain) {
      case "tech":
        return <FaLaptopCode className="text-blue-500" />
      case "education":
        return <FaGraduationCap className="text-green-500" />
      case "medical":
        return <FaHeartbeat className="text-red-500" />
      case "agriculture":
        return <FaLeaf className="text-green-600" />
      default:
        return <FaBuilding className="text-gray-500" />
    }
  }

  const getStageIcon = (stage) => {
    switch (stage) {
      case "Idea":
        return <FaLightbulb className="text-yellow-500" />
      case "Prototype":
        return <FaRocket className="text-orange-500" />
      case "MVP":
        return <FaRocket className="text-blue-500" />
      case "Revenue":
        return <FaChartLine className="text-green-500" />
      default:
        return <FaLightbulb className="text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-center">
          <FaRocket className="text-white text-3xl mr-3" />
          <h2 className="text-3xl font-bold text-white">Add Your Startup</h2>
        </div>

        {/* Progress Tabs */}
        <div className="flex border-b border-white/20">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => setActiveSection("basic")}
            className={`flex-1 py-4 px-4 text-center text-white font-medium flex items-center justify-center ${
              activeSection === "basic" ? "bg-white/10 border-b-2 border-blue-400" : ""
            }`}
          >
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">
              1
            </span>
            Basic Info
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => setActiveSection("details")}
            className={`flex-1 py-4 px-4 text-center text-white font-medium flex items-center justify-center ${
              activeSection === "details" ? "bg-white/10 border-b-2 border-blue-400" : ""
            }`}
          >
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">
              2
            </span>
            Details
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={() => setActiveSection("uploads")}
            className={`flex-1 py-4 px-4 text-center text-white font-medium flex items-center justify-center ${
              activeSection === "uploads" ? "bg-white/10 border-b-2 border-blue-400" : ""
            }`}
          >
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">
              3
            </span>
            Uploads
          </motion.button>
        </div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-6 bg-red-500/20 text-red-200 border border-red-300/30 px-4 py-3 rounded-lg flex items-center"
          >
            <FaExclamationTriangle className="text-red-300 mr-2" />
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-6 bg-green-500/20 text-green-200 border border-green-300/30 px-4 py-3 rounded-lg flex items-center"
          >
            <FaCheckCircle className="text-green-300 mr-2" />
            {successMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="p-6 text-white">
          {/* Basic Info Section */}
          {activeSection === "basic" && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
              <motion.div variants={fadeIn}>
                <label className="block mb-2 font-medium">Startup Title</label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter your startup name"
                  />
                  <FaRocket className="absolute left-3 top-3.5 text-blue-400" />
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Domain</label>
                  <div className="relative">
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none px-4 py-3 pl-10 rounded-lg bg-white/10 border border-white/30 text-white outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                      <option className="bg-gray-800 text-white" value="medical">
                        Medical
                      </option>
                      <option className="bg-gray-800 text-white" value="agriculture">
                        Agriculture
                      </option>
                      <option className="bg-gray-800 text-white" value="tech">
                        Tech
                      </option>
                      <option className="bg-gray-800 text-white" value="education">
                        Education
                      </option>
                    </select>
                    <div className="absolute left-3 top-3.5 pointer-events-none">{getDomainIcon(formData.domain)}</div>
                    <div className="absolute right-3 top-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-white/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Stage</label>
                  <div className="relative">
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none px-4 py-3 pl-10 rounded-lg bg-white/10 border border-white/30 text-white outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                      <option className="bg-gray-800 text-white" value="Idea">
                        Idea
                      </option>
                      <option className="bg-gray-800 text-white" value="Prototype">
                        Prototype
                      </option>
                      <option className="bg-gray-800 text-white" value="MVP">
                        MVP
                      </option>
                      <option className="bg-gray-800 text-white" value="Revenue">
                        Revenue
                      </option>
                    </select>
                    <div className="absolute left-3 top-3.5 pointer-events-none">{getStageIcon(formData.stage)}</div>
                    <div className="absolute right-3 top-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-white/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="mt-6">
                <label className="block mb-2 font-medium">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="City, Country"
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-3.5 text-red-400" />
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setActiveSection("details")}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg flex items-center"
                >
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Details Section */}
          {activeSection === "details" && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
              <motion.div variants={fadeIn}>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  placeholder="Describe your startup, its mission, and vision..."
                />
                <p className="text-xs text-white/70 mt-2">
                  Provide a compelling description that highlights your startup's unique value proposition.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setActiveSection("basic")}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/30 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setActiveSection("uploads")}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg flex items-center"
                >
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Uploads Section */}
          {activeSection === "uploads" && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
              <motion.div variants={fadeIn}>
                <label className="block mb-2 font-medium">Startup PDF</label>
                <div className="relative">
                  <div className="w-full px-4 py-8 rounded-lg bg-white/10 border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/15 transition-all">
                    <FaFileUpload className="text-blue-400 text-3xl mb-2" />
                    <p className="text-white/80 mb-1">Drag and drop your PDF here or click to browse</p>
                    <p className="text-xs text-white/60">Business plan, pitch deck, or detailed proposal</p>
                    <input
                      type="file"
                      name="startupPdf"
                      onChange={handleChange}
                      accept="application/pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {formData.startupPdf && (
                    <div className="mt-2 text-sm text-white/80 flex items-center">
                      <FaCheckCircle className="text-green-400 mr-2" />
                      {formData.startupPdf.name}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <label className="block mb-2 font-medium">Pitch Video</label>
                <div className="relative">
                  <div className="w-full px-4 py-8 rounded-lg bg-white/10 border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/15 transition-all">
                    <FaVideo className="text-purple-400 text-3xl mb-2" />
                    <p className="text-white/80 mb-1">Upload your pitch video (max 100MB)</p>
                    <p className="text-xs text-white/60">MP4, MOV, or AVI formats accepted</p>
                    <input
                      type="file"
                      name="pitch"
                      onChange={handleChange}
                      accept="video/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {formData.pitch && (
                    <div className="mt-2 text-sm text-white/80 flex items-center">
                      <FaCheckCircle className="text-green-400 mr-2" />
                      {formData.pitch.name}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setActiveSection("details")}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/30 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#3b82f6" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg flex items-center disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Startup
                      <FaRocket className="ml-2" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  )
}

export default AddStartup
