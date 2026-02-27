 function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        {/* Logo */}
        <h2 className="text-3xl font-bold text-center md:text-left">Shortly</h2>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-12 text-center md:text-left">

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/#">Link Shortening</a></li>
              <li><a href="/#">Branded Links</a></li>
              <li><a href="/#">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/#">Blog</a></li>
              <li><a href="/#">Developers</a></li>
              <li><a href="/#">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/#">About</a></li>
              <li><a href="/#">Our Team</a></li>
              <li><a href="/#">Careers</a></li>
              <li><a href="/#">Contact</a></li>
            </ul>
          </div>

        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-start gap-6 text-2xl">
          <a href="/#">📘</a>
          <a href="/#">🐦</a>
          <a href="/#">📌</a>
          <a href="/#">📸</a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
