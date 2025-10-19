import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import scholarCharacter from "../../public/images/Character_SFP/Happy.png";
import scholarProud from "../../public/images/Character_SFP/Proud.png";
import scholarLaptop from "../../public/images/Character_SFP/Working.png";
import scholarCurious from "../../public/images/Character_SFP/Curious.png";
import { Typewriter } from 'react-simple-typewriter';


const Home = () => {
  // ... (keep your features, testimonials, and stats arrays as they are)
  const features = [
    {
      icon: "🎓",
      title: "Student-Friendly",
      description: "Designed specifically for students to showcase their skills and earn while learning"
    },
    {
      icon: "💼",
      title: "Quality Projects",
      description: "Access to vetted projects from verified clients looking for fresh talent"
    },
    {
      icon: "⚡",
      title: "Quick Payments",
      description: "Secure and fast payment processing to ensure you get paid on time"
    },
    {
      icon: "🤝",
      title: "Mentorship",
      description: "Connect with experienced professionals for guidance and career growth"
    },
    {
      icon: "🛡️",
      title: "Secure Platform",
      description: "Advanced security measures to protect both students and clients"
    },
    {
      icon: "📈",
      title: "Skill Development",
      description: "Build your portfolio and gain real-world experience with every project"
    }
  ];

  const testimonials = [
    {
      name: "Yogesh S",
      role: "Computer Science Student, NIE Mysore",
      content: "This platform helped me land my first freelance project! The support from mentors was incredible and I earned ₹15,000 in my first month.",
      rating: 5
    },
    {
      name: "Shresth Juptimath",
      role: "Startup Founder, Bangalore",
      content: "Found amazing talent here. Students are eager, creative, and deliver quality work at fair prices. Perfect for Indian startups!",
      rating: 5
    },
    {
      name: "Sujeet Kulkarni",
      role: "Design Student, NIE Mysore",
      content: "I've completed 20+ projects and built an impressive portfolio. Now I earn ₹25,000+ monthly while studying. Highly recommend!",
      rating: 5
    }
  ];

  const stats = [
    { number: "5,000+", label: "Active Students" },
    { number: "1,200+", label: "Projects Completed" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "500+", label: "Companies Hiring" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - UPDATED */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 flex flex-col items-center">
              <img 
                src={scholarCharacter} 
                alt="Happy student scholar character" 
                className="w-full h-auto max-w-sm" 
              />

              <div className="font-cascadia mt-4 text-2xl font-semibold text-gray-700 h-8">
                <Typewriter
                  words={['Hi, I am Rajesh Koothrappali']}
                  loop={1}
                  cursor
                  cursorStyle='_'
                  typeSpeed={40}
                  delaySpeed={1000}
                />
              </div>
            </div>

            {/* Right Side: Text Content (Moved Down) */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Turn Your Student Skills Into
                <span className="bg-gradient-to-r text-yellow-500 bg-clip-text text-transparent block">
                  Real Income
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto md:mx-0">
                The first freelance platform designed exclusively for students. Connect with clients, build your portfolio, and earn money while gaining real-world experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  Start as a Student
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Hire Students
                </Link>
              </div>
            </div>
            {/* highlight-end */}

          </div>
        </div>
      </section>

      {/* ... (The rest of your page remains the same) ... */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the perfect ecosystem for students to thrive in the freelance world
            </p>
          </div>
          
          {/* Highlight-Start: Add relative positioning to the grid container */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative"> 
            
            {/* Highlight-Start: Add the absolutely positioned character */}
            <img
    src={scholarLaptop}
    alt="Student on laptop"
    className="absolute z-10 w-[200px] md:w-[250px] lg:w-[340px]"
    // highlight-start
    style={{
        top: 'calc(30% - 240px)', // Vertical position
        left: 'calc(75% - 10px)', // Horizontal position
        transform: 'translateY(-50%)',
    }}
    // highlight-end
/>
            {/* Highlight-End */}

            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          {/* Highlight-End */}

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Sign Up */}
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sign Up & Create Profile</h3>
              <p className="text-gray-600">
                Create your account, showcase your skills, and build an impressive profile that attracts clients.
              </p>
            </div>
            {/* Card 2: Browse & Apply */}
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Browse & Apply</h3>
              <p className="text-gray-600">
                Explore student-friendly projects, submit proposals, and connect with clients looking for fresh talent.
              </p>
            </div>

            {/* highlight-start */}
            {/* Card 3: Deliver & Earn (UPDATED) */}
            <div className="text-center relative pt-20 md:pt-0"> {/* Add relative and padding-top for space */}
              {/* Add the character image inside this card's container */}
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deliver & Earn</h3>
              <p className="text-gray-600">
                Complete projects, build your portfolio, earn money, and get valuable experience for your future career.
              </p>
            </div>
            {/* highlight-end */}
            
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main flex container for left column (text + image) and right column (testimonials) */}
          <div className="flex flex-col lg:flex-row gap-12 items-start"> 
            
            {/* Left Column: Title, Subtitle, and Character Image */}
            <div className="lg:w-1/2 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="mb-8"> {/* Added margin bottom for spacing */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 lg:ml-10">
                  Success Stories
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 lg:ml-10">
                  See what our community is saying
                </p>
              </div>
              {/* Character Image below the text */}
              <img 
                src={scholarProud} 
                alt="Proud student scholar with glasses" 
                className="w-full h-auto max-w-xs lg:max-w-none lg:self-start mt-4 lg:-ml-20" // Adjust size and alignment
              />
            </div>

            {/* Right Column: Testimonial Cards aligned vertically */}
            <div className="lg:w-2/3 w-full flex flex-col gap-8"> {/* Changed to flex-col for vertical alignment */}
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Ready to Start Your Freelance Journey?
          </h2>
          <p className="text-xl text-black mb-8">
            Join thousands of students who are already earning and learning on our platform
          </p>
          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Join Now - It's Free!
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;