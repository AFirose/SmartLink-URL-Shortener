 // Boost backgrounds
import boostDesktop from "../assets/images/bg-boost-desktop.svg";
import boostMobile from "../assets/images/bg-boost-mobile.svg";

// Shorten backgrounds
import shortenDesktop from "../assets/images/bg-shorten-desktop.svg";
import shortenMobile from "../assets/images/bg-shorten-mobile.svg";

// Icons & logos
import favicon32 from "../assets/images/favicon-32x32.png";
import iconBrand from "../assets/images/icon-brand-recognition.svg";
import iconRecords from "../assets/images/icon-detailed-records.svg";
import iconFacebook from "../assets/images/icon-facebook.svg";
import iconCustomize from "../assets/images/icon-fully-customizable.svg";
import iconInstagram from "../assets/images/icon-instagram.svg";
import iconPinterest from "../assets/images/icon-pinterest.svg";
import iconTwitter from "../assets/images/icon-twitter.svg";
import illustrationWorking from "../assets/images/illustration-working.svg";
import logo from "../assets/images/logo.svg";

 function Hero() {
  return (
    <section className="px-6 md:px-20 py-10 md:py-20 flex flex-col-reverse md:flex-row">

      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-slate-800">
          More than just shorter links
        </h1>
        <p className="text-gray-500 text-base md:text-lg">
          Build your brand’s recognition and get detailed insights
          on how your links are performing.
        </p>
        <button className="bg-cyan-500 text-white px-8 py-3 rounded-full text-lg font-medium">
          Get Started
        </button>
      </div>

      <div className="md:w-1/2 flex justify-center">
        <img src={boostDesktop} alt="Boost background" className="w-full" />
      </div>

    </section>
  );
}

export default Hero;
