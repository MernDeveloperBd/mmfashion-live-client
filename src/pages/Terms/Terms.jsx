import { useState } from 'react';
import {
  CheckCircle, FileText, Truck, RotateCw, Shield, Scale,
  AlertTriangle, CreditCard, UserCheck, Copyright,
  Phone, Mail, MapPin, Calendar, ChevronDown, ChevronUp,
  Globe, BookOpen, ShieldCheck, Package
} from "lucide-react";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function Terms({
  companyName = "MM Fashion World",
  contactEmail = "marifamisam@gmail.com",
  anotherContactEmail = "support@mmfashionworld.com",
  contactPhone = "+8801749 889595",
  address = "Dhaka, Bangladesh",
  lastUpdated = "July 15, 2025"
}) {
  const [expandedSections, setExpandedSections] = useState({});
  const [language, setLanguage] = useState('en'); // bn for Bengali, en for English

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const sections = [
    {
      title: language === 'bn' ? "গ্রহণযোগ্যতা" : "Acceptance",
      icon: CheckCircle,
      color: "from-green-400 to-green-600",
      shortText: language === 'bn'
        ? "এই ওয়েবসাইট ব্যবহার করে বা আমাদের কাছ থেকে পণ্য অর্ডার করে আপনি এই Terms & Conditions-এর সাথে সম্মত হচ্ছেন।"
        : "By using this website or ordering products from us, you agree to these Terms & Conditions.",
      fullText: language === 'bn'
        ? "এই শর্তাবলী MM Fashion World এবং এর গ্রাহকদের মধ্যে একটি আইনগত চুক্তি গঠন করে। ওয়েবসাইট ব্যবহার করার পূর্বে এই শর্তাবলী সম্পূর্ণভাবে পড়ুন এবং বুঝুন। যদি আপনি এই শর্তাবলীর সাথে একমত না হন, তাহলে দয়া করে আমাদের সেবা ব্যবহার করবেন না।"
        : "These terms constitute a legal agreement between MM Fashion World and its customers. Please read and understand these terms completely before using the website. If you do not agree with these terms, please do not use our services."
    },
    {
      title: language === 'bn' ? "পণ্যের বিবরণ ও মূল্য" : "Product Description & Pricing",
      icon: FileText,
      color: "from-blue-400 to-blue-600",
      shortText: language === 'bn'
        ? "আমরা পণ্যের বিবরণ সঠিকভাবে প্রদর্শনের চেষ্টা করি, তবে কিছু পার্থক্য থাকতে পারে।"
        : "We strive to display product descriptions accurately, but some variations may occur.",
      fullText: language === 'bn'
        ? "• পণ্যের রঙ মনিটর সেটিংসের কারণে ভিন্ন দেখাতে পারে\n• সকল পণ্যের মূল্য বাংলাদেশী টাকায় প্রদর্শিত\n• মূল্য পরিবর্তন সাপেক্ষে\n• ছবি এবং বাস্তব পণ্যে সামান্য পার্থক্য থাকতে পারে\n• স্টক শেষ হয়ে গেলে অর্ডার বাতিল হতে পারে"
        : "• Product colors may appear different due to monitor settings\n• All product prices are displayed in Bangladeshi Taka\n• Prices are subject to change\n• Slight differences may exist between images and actual products\n• Orders may be cancelled if stock runs out"
    },
    {
      title: language === 'bn' ? "পেমেন্ট পদ্ধতি" : "Payment Methods",
      icon: CreditCard,
      color: "from-purple-400 to-purple-600",
      shortText: language === 'bn'
        ? "আমরা বিভিন্ন সুবিধাজনক পেমেন্ট অপশন গ্রহণ করি।"
        : "We accept various convenient payment options.",
      fullText: language === 'bn'
        ? "• ক্যাশ অন ডেলিভারি (COD)\n• বিকাশ/নগদ/রকেট\n• ব্যাংক ট্রান্সফার\n• অনলাইন পেমেন্ট গেটওয়ে\n• সকল লেনদেন সুরক্ষিত এবং এনক্রিপ্টেড\n• পেমেন্ট নিশ্চিত হওয়ার পর অর্ডার প্রসেসিং শুরু হবে"
        : "• Cash on Delivery (COD)\n• Bkash/Nagad/Rocket\n• Bank Transfer\n• Online Payment Gateway\n• All transactions are secure and encrypted\n• Order processing begins after payment confirmation"
    },
    {
      title: language === 'bn' ? "শিপিং ও ডেলিভারি" : "Shipping & Delivery",
      icon: Truck,
      color: "from-yellow-400 to-orange-500",
      shortText: language === 'bn'
        ? "ডেলিভারি সময় সাধারণত ২–৭ কার্যদিবস হতে পারে।"
        : "Delivery time is typically 2-7 business days.",
      fullText: language === 'bn'
        ? "• ঢাকার ভিতর: ২-৩ কার্যদিবস\n• ঢাকার বাইরে: ৪-৭ কার্যদিবস\n• ডেলিভারি চার্জ এলাকা ভেদে ভিন্ন হবে\n• অর্ডার ট্র্যাকিং সুবিধা উপলব্ধ\n• ডেলিভারির সময় পণ্য চেক করে নিন\n• জরুরী ডেলিভারির জন্য অতিরিক্ত চার্জ প্রযোজ্য"
        : "• Inside Dhaka: 2-3 business days\n• Outside Dhaka: 4-7 business days\n• Delivery charges vary by area\n• Order tracking facility available\n• Check products during delivery\n• Additional charges apply for urgent delivery"
    },
    {
      title: language === 'bn' ? "রিটার্ন ও রিফান্ড" : "Return & Refund",
      icon: RotateCw,
      color: "from-red-400 to-red-600",
      shortText: language === 'bn'
        ? "ডেলিভারি ম্যান উপস্থিত থাকা অবস্থায় পণ্য রিটার্ন গ্রহণ করা হবে নির্দিষ্ট শর্তে।"
        : "Products can be returned while delivery person is present under specific conditions.",
      fullText: language === 'bn'
        ? "• ডেলিভারির সময় পণ্যে সমস্যা থাকলে সাথে সাথে রিটার্ন করুন\n• ভুল পণ্য/সাইজ/রঙ পেলে রিটার্ন গ্রহণযোগ্য\n• ব্যবহৃত পণ্য রিটার্ন করা যাবে না\n• রিফান্ড ৭-১০ কার্যদিবসের মধ্যে প্রদান করা হবে\n• কাস্টম/পার্সোনালাইজড পণ্য রিটার্নযোগ্য নয়"
        : "• Return immediately if product has issues during delivery\n• Returns accepted for wrong product/size/color\n• Used products cannot be returned\n• Refunds processed within 7-10 business days\n• Custom/personalized products are non-returnable"
    },
    {
      title: language === 'bn' ? "গোপনীয়তা ও তথ্য সুরক্ষা" : "Privacy & Data Protection",
      icon: Shield,
      color: "from-indigo-400 to-indigo-600",
      shortText: language === 'bn'
        ? "আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখা আমাদের দায়িত্ব।"
        : "Protecting your personal information is our responsibility.",
      fullText: language === 'bn'
        ? "• আমরা SSL এনক্রিপশন ব্যবহার করি\n• তৃতীয় পক্ষের সাথে তথ্য শেয়ার করা হয় না\n• শুধুমাত্র অর্ডার প্রসেসিংয়ের জন্য তথ্য ব্যবহার করা হয়\n• আপনি যেকোনো সময় আপনার তথ্য মুছে ফেলার অনুরোধ করতে পারেন\n• কুকিজ ব্যবহার করে ভাল সেবা প্রদান করা হয়"
        : "• We use SSL encryption\n• Information not shared with third parties\n• Data used only for order processing\n• You can request data deletion anytime\n• Cookies used to provide better service"
    },
    {
      title: language === 'bn' ? "ব্যবহারকারীর দায়িত্ব" : "User Responsibilities",
      icon: UserCheck,
      color: "from-teal-400 to-teal-600",
      shortText: language === 'bn'
        ? "ওয়েবসাইট ব্যবহারের সময় কিছু নিয়ম মেনে চলতে হবে।"
        : "Certain rules must be followed while using the website.",
      fullText: language === 'bn'
        ? "• সঠিক তথ্য প্রদান করুন\n• অন্যের অ্যাকাউন্ট ব্যবহার করবেন না\n• প্রতারণামূলক কার্যকলাপ নিষিদ্ধ\n• স্প্যাম বা অবৈধ কন্টেন্ট পোস্ট করবেন না\n• ওয়েবসাইটের নিরাপত্তা ভঙ্গ করার চেষ্টা করবেন না"
        : "• Provide accurate information\n• Do not use others' accounts\n• Fraudulent activities prohibited\n• Do not post spam or illegal content\n• Do not attempt to breach website security"
    },
    {
      title: language === 'bn' ? "মেধা সম্পত্তি" : "Intellectual Property",
      icon: Copyright,
      color: "from-pink-400 to-pink-600",
      shortText: language === 'bn'
        ? "সকল কন্টেন্ট MM Fashion World এর সম্পত্তি।"
        : "All content is property of MM Fashion World.",
      fullText: language === 'bn'
        ? "• লোগো, ডিজাইন, ছবি সব কপিরাইট সংরক্ষিত\n• অনুমতি ছাড়া ব্যবহার নিষিদ্ধ\n• পণ্যের ছবি শুধুমাত্র ব্যক্তিগত ব্যবহারের জন্য\n• বাণিজ্যিক ব্যবহার কঠোরভাবে নিষিদ্ধ"
        : "• Logo, designs, images all copyrighted\n• Use without permission prohibited\n• Product images for personal use only\n• Commercial use strictly prohibited"
    },
    {
      title: language === 'bn' ? "বিধি ও ব্যাখ্যা" : "Rules & Interpretation",
      icon: Scale,
      color: "from-gray-400 to-gray-600",
      shortText: language === 'bn'
        ? "এই Terms & Conditions বাংলাদেশের আইন দ্বারা নিয়ন্ত্রিত হবে।"
        : "These Terms & Conditions are governed by the laws of Bangladesh.",
      fullText: language === 'bn'
        ? "• বাংলাদেশের প্রচলিত আইন প্রযোজ্য\n• বিরোধের ক্ষেত্রে ঢাকার আদালতের এখতিয়ার\n• আমরা যেকোনো সময় শর্তাবলী পরিবর্তনের অধিকার রাখি\n• পরিবর্তন ওয়েবসাইটে প্রকাশের সাথে সাথে কার্যকর হবে"
        : "• Laws of Bangladesh apply\n• Dhaka courts have jurisdiction in disputes\n• We reserve the right to change terms anytime\n• Changes effective upon publication on website"
    },
    {
      title: language === 'bn' ? "দায় অস্বীকার" : "Disclaimer",
      icon: AlertTriangle,
      color: "from-amber-400 to-amber-600",
      shortText: language === 'bn'
        ? "আমাদের প্ল্যাটফর্মে অন্যান্য ব্যবসায়ীরা তাদের পণ্য বিক্রি করতে পারেন।"
        : "Other merchants may sell their products on our platform.",
      fullText: language === 'bn'
        ? "• তৃতীয় পক্ষের পণ্যের জন্য MM Fashion World দায়ী নয়\n• বিক্রেতার পণ্যের গুণমান তাদের দায়িত্ব\n• আমরা শুধুমাত্র প্ল্যাটফর্ম সেবা প্রদান করি\n• সরাসরি বিক্রেতার সাথে যোগাযোগ করুন সমস্যার জন্য\n• আমরা মধ্যস্থতাকারী হিসেবে সহায়তা করতে পারি"
        : "• MM Fashion World not responsible for third-party products\n• Product quality is seller's responsibility\n• We only provide platform services\n• Contact seller directly for issues\n• We can assist as mediator"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header/>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#c3192a] via-[#a01322] to-[#8B1538] text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                {companyName}
              </h1>
              <p className="text-base mt-2 opacity-90">
                Terms & Conditions — নিয়মাবলী এবং শর্তাবলী
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm opacity-80">
                <Calendar className="w-4 h-4" />
                Last Updated: {lastUpdated}
              </div>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {address}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${contactEmail}`} className="hover:underline">
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${anotherContactEmail}`} className="hover:underline">
                  {anotherContactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${contactPhone}`} className="hover:underline">
                  {contactPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="mt-6 flex items-center gap-3">
            <Globe className="w-5 h-5" />
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-all"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </header>

      {/* Quick Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap">
            <span className="font-medium text-gray-600">Quick Links:</span>
            {sections.slice(0, 5).map((section, idx) => (
              <button
                key={idx}
                onClick={() => document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors "
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, idx) => (
            <div
              key={idx}
              id={`section-${idx}`}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${section.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur p-2 rounded-lg">
                      <section.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold">{section.title}</h2>
                  </div>
                  <button
                    onClick={() => toggleSection(idx)}
                    className="bg-white/20 backdrop-blur p-1.5 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {expandedSections[idx] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {section.shortText}
                </p>

                {expandedSections[idx] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
                      {section.fullText}
                    </pre>
                  </div>
                )}

                {!expandedSections[idx] && (
                  <button
                    onClick={() => toggleSection(idx)}
                    className="mt-4 text-sm font-medium bg-gradient-to-r from-[#c3192a] to-[#8B1538] bg-clip-text text-transparent hover:from-[#a01322] hover:to-[#7A122E] transition-all"
                  >
                    Read More →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-gradient-to-r from-[#c3192a] to-[#8B1538] rounded-2xl shadow-xl text-white p-8">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">
              {language === 'bn' ? 'আপনার বিশ্বাস, আমাদের দায়িত্ব' : 'Your Trust, Our Responsibility'}
            </h3>
            <p className="text-lg opacity-90 leading-relaxed">
              {language === 'bn'
                ? 'MM Fashion World এ আমরা গ্রাহক সন্তুষ্টিকে সর্বোচ্চ অগ্রাধিকার দিই। আমাদের প্রতিটি নীতি এবং শর্ত আপনার স্বার্থ রক্ষা করার জন্য ডিজাইন করা হয়েছে।'
                : 'At MM Fashion World, we prioritize customer satisfaction above all. Every policy and condition is designed to protect your interests.'}
            </p>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-[#c3192a] mb-4" />
          <h3 className="text-xl font-bold mb-3">
            {language === 'bn' ? 'প্রশ্ন আছে?' : 'Have Questions?'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'bn'
              ? 'আমাদের কাস্টমার সাপোর্ট টিম সবসময় আপনার সেবায় নিয়োজিত'
              : 'Our customer support team is always here to help you'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c3192a] to-[#8B1538] text-white rounded-full hover:shadow-lg transition-all"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
            <a
              href={`tel:${contactPhone}`}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#c3192a] text-[#c3192a] rounded-full hover:bg-[#c3192a] hover:text-white transition-all"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              const text = `${companyName} Terms & Conditions: ${window.location.href}`;
              navigator.clipboard?.writeText(text);
              alert(language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link copied!');
            }}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg transition-all"
          >
            📋 Copy Link
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
          >
            🖨️ Print
          </button>
          <button
            onClick={() => { document.documentElement.scrollTop = 0; }}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all"
          >
            ⬆️ Back to Top
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}