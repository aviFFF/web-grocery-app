import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center text-teal-600 sm:justify-start">
              <Image
                src={"/buzzat-logo.png"}
                alt="logo"
                width={100}
                height={100}
                className="object-contain rounded-2xl"
                priority
              />
            </div>
            <p className="mt-2 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left">
              Your one-stop destination for all your shopping needs! We offer a
              wide range of quality products, great deals, and a hassle-free
              shopping experience every time!
            </p>
            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {[
                { href: "https://www.facebook.com/people/Buzzat/61571924386565/", label: "Facebook", icon: FacebookIcon },
                { href: "https://www.instagram.com/buzzatstore/", label: "Instagram", icon: InstagramIcon },
                { href: "https://g.page/r/Cfjeg-Ua5eX8EAI/review", label: "Youtube", icon: YouTubeIcon },
              ].map(({ href, label, icon: Icon }, index) => (
                <li key={index}>
                  <Link
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                    className="text-teal-700 transition hover:text-teal-700/75"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <FooterColumn title="Helpful Links">
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/aboutus">About</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/vendor">Vendor</FooterLink>
            </FooterColumn>

            <FooterColumn title="Contact">
              <FooterLink href="/partner">Partner</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="#">FAQ</FooterLink>
              <FooterLink target="_blank" href="https://api.whatsapp.com/send?phone=+919236532569&text=Hello!%20I%20am%20having%20issue%20with%20my%20order.">Live Chat</FooterLink>
            </FooterColumn>

            <FooterColumn title="Categories">
              <FooterLink href="/products-category/Dairy%20and%20Breakfast">Dairy & Breakfast</FooterLink>
              <FooterLink href="/products-category/Fruits%20and%20Vegetables">Vegetables & Fruits</FooterLink>
              <FooterLink href="/products-category/Drinks%20and%20Juice">Drinks & Juices</FooterLink>
              <FooterLink href="/products-category/Dry%20Fruits%20and%20Instant%20Food">Instant & Frozen Food</FooterLink>
            </FooterColumn>

            <FooterColumn title="...">
              <FooterLink href="/products-category/Aataa%20Dal%20Rice">Atta, Rice & Dal</FooterLink>
              <FooterLink href="/products-category/Masala%20and%20Oils">Masala & Oils</FooterLink>
              <FooterLink href="/products-category/Tea%20and%20Coffee">Tea & Coffee</FooterLink>
              <FooterLink href="/products-category/Beauty%20and%20Cosmetics">Beauty & Cosmetics</FooterLink>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-500">
              <span className="block sm:inline">All rights reserved.</span>
              <Link
                href="/terms"
                className="text-black underline transition hover:text-primary"
              >
                Terms & Conditions
              </Link>
              &nbsp;and&nbsp;
              <Link
                href="/privacy"
                className="text-black underline transition hover:text-primary"
              >
                Privacy Policy
              </Link>
            </p>
            <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
              &copy; 2024 Buzzat Pvt Ltd
            </p>
          </div>
          <div className="mt-8 gap-8 flex justify-center sm:justify-start">
            <Image
              src="/salogo.png"
              width={75}
              height={75}
              alt="Swatchata Abhiyan"
              className="object-contain w-auto h-auto"
            />
            <Image
              src="/minindia.png"
              width={75}
              height={75}
              alt="Make in India"
              className="object-contain w-auto h-auto"
            />
            <Image
              src="/75year.png"
              width={75}
              height={75}
              alt="75 Years of Independence"
              className="object-contain w-auto h-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-xl font-medium text-gray-900">{title}</p>
      <ul className="mt-8 space-y-4 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-gray-700 transition hover:text-primary">
        {children}
      </Link>
    </li>
  );
}

function FacebookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#1877F2" d="M24 4C12.9 4 4 12.9 4 24c0 9.9 7.2 18.1 16.5 19.7V30.3h-5v-6.3h5v-4.7c0-5 2.9-7.7 7.3-7.7 2.1 0 4.3.4 4.3.4v4.7h-2.4c-2.4 0-3.2 1.5-3.2 3v3.3h5.5l-1 6.3h-4.5v13.4C36.8 42.1 44 33.9 44 24c0-11.1-8.9-20-20-20z"/>
  </svg>
  
  );
}

function InstagramIcon() {
  return (
<svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#feda75"/>
      <stop offset="25%" stopColor="#fa7e1e"/>
      <stop offset="50%" stopColor="#d62976"/>
      <stop offset="75%" stopColor="#962fbf"/>
      <stop offset="100%" stopColor="#4f5bd5"/>
    </linearGradient>
  </defs>
  <path fill="url(#instaGradient)" d="M12,2.2c3.2,0,3.6,0,4.9,0.1c1.2,0.1,1.9,0.3,2.4,0.5c0.6,0.2,1.1,0.5,1.6,1s0.8,1,1,1.6 c0.2,0.5,0.4,1.2,0.5,2.4c0.1,1.3,0.1,1.7,0.1,4.9s0,3.6-0.1,4.9c-0.1,1.2-0.3,1.9-0.5,2.4c-0.2,0.6-0.5,1.1-1,1.6s-1,0.8-1.6,1 c-0.5,0.2-1.2,0.4-2.4,0.5c-1.3,0.1-1.7,0.1-4.9,0.1s-3.6,0-4.9-0.1c-1.2-0.1-1.9-0.3-2.4-0.5c-0.6-0.2-1.1-0.5-1.6-1 s-0.8-1-1-1.6c-0.2-0.5-0.4-1.2-0.5-2.4c-0.1-1.3-0.1-1.7-0.1-4.9s0-3.6,0.1-4.9c0.1-1.2,0.3-1.9,0.5-2.4c0.2-0.6,0.5-1.1,1-1.6 s1-0.8,1.6-1c0.5-0.2,1.2-0.4,2.4-0.5C8.4,2.2,8.8,2.2,12,2.2 M12,0C8.7,0,8.3,0,7,0.1C5.7,0.2,4.7,0.4,3.9,0.7 c-0.9,0.3-1.6,0.7-2.3,1.3c-0.7,0.7-1,1.4-1.3,2.3C0.1,5.7-0.1,6.7,0,7.9C0,9.3,0,9.7,0,12s0,2.7,0.1,4.1c0.1,1.2,0.3,2.2,0.6,3 c0.3,0.9,0.7,1.6,1.3,2.3c0.7,0.7,1.4,1,2.3,1.3c0.9,0.3,1.8,0.5,3,0.6C8.3,24,8.7,24,12,24s3.7,0,5.1-0.1c1.2-0.1,2.2-0.3,3-0.6 c0.9-0.3,1.6-0.7,2.3-1.3c0.7-0.7,1-1.4,1.3-2.3c0.3-0.9,0.5-1.8,0.6-3C24,14.7,24,14.3,24,12s0-2.7-0.1-4.1 c-0.1-1.2-0.3-2.2-0.6-3c-0.3-0.9-0.7-1.6-1.3-2.3c-0.7-0.7-1.4-1-2.3-1.3c-0.9-0.3-1.8-0.5-3-0.6C15.7,0,15.3,0,12,0L12,0z"/>
  <path fill="orange" d="M12,5.8c-3.5,0-6.2,2.8-6.2,6.2s2.8,6.2,6.2,6.2s6.2-2.8,6.2-6.2S15.5,5.8,12,5.8z M12,15.4 c-1.9,0-3.4-1.5-3.4-3.4S10.1,8.6,12,8.6s3.4,1.5,3.4,3.4S13.9,15.4,12,15.4z"/>
  <circle fill="white" cx="18.4" cy="5.6" r="1.4"/>
</svg>

  
  );
}


function YouTubeIcon() {
  return (
    <Image
      src="/googlepng.png"
      alt="googleReview"
      width={25}
      height={25}
      className="text-primary"
    />
  );
}

export default Footer;
