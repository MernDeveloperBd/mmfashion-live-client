import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBullseye, FaHeart, FaQuoteLeft, FaStar, FaHandshake, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import useravater from '../../assets/seller.png'
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  // Customize these extra
  const whatsappNumber = "8801749889595";
  const youtubeVideoId = "YOUR_VIDEO_ID"; // replace with your actual YouTube ID or leave empty
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  // extra end

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Rabeya Akter",
      rating: 5,
      comment: "MM Fashion World থেকে কেনা প্রতিটি পোশাকই অসাধারণ। হাতের কাজ এবং কোয়ালিটি দুটোই চমৎকার।",
      image: `${useravater}`
    },
    {
      id: 2,
      name: "Ratna Akter",
      rating: 5,
      comment: "দেশীয় পণ্যকে এতো সুন্দরভাবে উপস্থাপন করার জন্য ধন্যবাদ। সত্যিই গর্বিত বোধ করি।",
      image: `${useravater}`
    },
    {
      id: 3,
      name: "Ayub Ali",
      rating: 5,
      comment: "কাস্টমার সার্ভিস অসাধারণ। প্রতিটি পণ্যে যত্নের ছাপ স্পষ্ট।",
      image: "https://scontent.fjsr17-1.fna.fbcdn.net/v/t39.30808-6/480891681_522073967584461_5094177895453309352_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=cJRrLWv-iFkQ7kNvwEsEu9V&_nc_oc=AdlF_So0VgEDOAI9dhq9RkVpPASRrRNdSA8arOM_DWl1p4VTMPvRtLdaZMs63kHBnq0&_nc_zt=23&_nc_ht=scontent.fjsr17-1.fna&_nc_gid=gBUaV23lLa5aayn5nxFUKA&oh=00_AfaVBqttc4Miv2bkivdq-Z4KZK_EgZKaMfB0AJn1Z-THaQ&oe=68C305CD"
    }
  ];

  return (
    <div className="overflow-x-hidden my-2">
      <Header />
      {/* Hero Section with Parallax */}
      <section
        className="relative h-[40vh] md:h-[45vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dqokqca8p/image/upload/v1756018288/My%20Brand/Misam_Marifa_Fashion_World_jkz3o8.png')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <motion.div
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            MM Fashion World
          </h1>
          <p className="text-lg md:text-2xl font-light drop-shadow-md">
            Where Tradition Meets Trend
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-[2px] w-16 bg-white"></span>
            <span className="text-xl">❋</span>
            <span className="h-[2px] w-16 bg-white"></span>
          </div>
        </motion.div>
      </section>

      {/* Welcome Section */}
      <motion.section
        className="container mx-auto px-4 py-6 md:py-12"
        {...fadeInUp}
        viewport={{ once: true }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
            Welcomt to MM Fashion World
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            <span className="font-semibold text-[#c3192a]">The journey of MM Fashion World</span> began with a pure passion for fashion and a heartfelt mission to empower women towards self-reliance. Misam and Marifa — behind these two names lies a story of our faith, dreams, and boundless creativity.
          </p>
        </div>
      </motion.section>

      {/* Story Section with Image */}
      <section className="bg-gray-50 py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              {...fadeInLeft}
              viewport={{ once: true }}
            >
              <img
                src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png"
                alt="MM Fashion World Store"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              {...fadeInRight}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-green-800 flex items-center gap-3">
                <FaHeart className="text-[#c3192a]" />
                Our Story
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Every design of our products is crafted with love, care, and artistry.
                Combining traditional craftsmanship, modern style, and premium materials, we create outfits that not only make you look beautiful but also keep you comfortable.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#c3192a]">1200+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#c3192a]">500+</div>
                  <div className="text-sm text-gray-600">Unique Designs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#c3192a]">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-center text-green-800 mb-12"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          Our Core Values
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-gradient-to-br from-[#ceb1cf67] to-[#d8b6da33] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            {...fadeInLeft}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#c3192a] text-white p-3 rounded-full">
                <FaBullseye className="text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-700">Our Mission</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c3192a] mt-1">✓</span>
                    Showcasing Local Fashion on the Global Stage.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c3192a] mt-1">✓</span>
                   Creating a Platform for Women to Express Their Own Identity.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c3192a] mt-1">✓</span>
                    Giving Top Priority to Quality and Customer Satisfaction.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#ceb1cf67] to-[#d8b6da33] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            {...fadeInRight}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#c3192a] text-white p-3 rounded-full">
                <FaHandshake className="text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-700">Our Joy</h3>
                <p className="text-gray-700 leading-relaxed">
                  We don’t just sell clothes — we celebrate confidence, elegance, and the creative power of women.
Everything you see on our website carries a story — a story as unique and inspiring as you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Behind the Seams / Video */}
      <section className="my-6 md:my-12">
        <motion.h2
          className="text-3xl font-bold text-center text-green-800 mb-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Behind the Seams
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          {youtubeVideoId ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="MM Fashion World - Behind the Seams"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                YouTube video, please provide the YouTube Video ID.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="container mx-auto px-4 py-6 md:py-12">
        <motion.h2
          className="text-3xl font-bold text-center text-green-800 mb-12"
          {...fadeInUp}
          viewport={{ once: true }}
        >
          What Our Customers Say
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FaQuoteLeft className="text-3xl text-[#c3192a] mb-4 opacity-20" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-[#a14bf1] to-[#a858f3b2] text-white py-6 md:py-12"
        {...fadeInUp}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-lg mb-6 opacity-90">
            Contact us, connect with us, and be a part of <span className="font-bold text-pink-800">MM Fashion World's</span> journey.
          </p>
          <p className="mb-8 text-xl font-light italic">
            "Dream big, live with style."
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/shop">
              <button className="inline-flex items-center gap-2 bg-[#108ac7] text-white px-4 py-3 rounded-full shadow hover:bg-[#0372aa] transition cursor-pointer">
                Shop Now
              </button>
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "হ্যালো MM Fashion World! আমি অর্ডার করতে চাই।"
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-3 rounded-full shadow hover:bg-green-800 transition"
              aria-label="Contact on WhatsApp"
            >
              <FaWhatsapp />
              <span className="hidden sm:inline">Contact us on WhatsApp.</span>
            </a>
          </div>
        </div>
      </motion.section>
      <Footer />
    </div>
  );
};

export default AboutUs;