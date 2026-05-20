import React from "react";
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiYoutube } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#211C24] text-gray-400 pt-12 pb-6 px-6 md:px-12 lg:px-20">

      {/* Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">
            Shop<span className="font-light">Sphere</span>
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            Your one-stop destination for quality products across every category. Shop smart, live better.
          </p>
          <div className="flex gap-3">
            {[
              { icon: <FiInstagram />, href: "#" },
              { icon: <FiTwitter />,   href: "#" },
              { icon: <FiFacebook />,  href: "#" },
              { icon: <FiYoutube />,   href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-white hover:text-white transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Products", "Categories", "Deals", "New Arrivals", "About Us"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-colors duration-200">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {["My Account", "Track Order", "Returns & Refunds", "FAQs", "Privacy Policy", "Terms & Conditions"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-colors duration-200">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FiMapPin className="mt-0.5 flex-shrink-0 text-gray-500" />
              <span>Kelavanidham, New India Colony, Nikol 382350</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="flex-shrink-0 text-gray-500" />
              <a href="tel:+911234567890" className="hover:text-white transition-colors">+91 98976 67890</a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="flex-shrink-0 text-gray-500" />
              <a href="mailto:support@shopsphere.com" className="hover:text-white transition-colors">support@shopsphere.com</a>
            </li>
          </ul>

          {/* Newsletter */}
          {/* <div className="mt-5">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Newsletter</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-[#2e2833] text-sm text-white placeholder-gray-600 px-3 py-2 rounded-l-lg border border-gray-700 focus:outline-none focus:border-gray-500"
              />
              <button className="bg-white text-[#211C24] text-xs font-bold px-3 py-2 rounded-r-lg hover:bg-[#EDEDED] transition-colors">
                Subscribe
              </button>
            </div>
          </div> */}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <p>© 2026 ShopSphere. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Sitemap</a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;