 function Features() {
  return (
    <section className="px-6 md:px-20 text-center mb-32">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
        Advanced Statistics
      </h2>
      <p className="text-gray-500 max-w-xl mx-auto mt-4">
        Track how your links are performing across the web with our 
        advanced statistics dashboard.
      </p>

      {/* Cards Container */}
      <div className="relative mt-20 flex flex-col md:flex-row gap-16 md:gap-8">

        {/* Connecting Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 bg-cyan-500 md:hidden"></div>
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-cyan-500 hidden md:block"></div>

        {/* Card 1 */}
        <div className="bg-white p-8 rounded-lg shadow-lg relative md:w-1/3">
          <div className="bg-purple-900 w-20 h-20 rounded-full flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
            <span className="text-white text-3xl">📊</span>
          </div>
          <h3 className="text-xl font-bold mt-12">Brand Recognition</h3>
          <p className="text-gray-500 mt-3">
            Boost your brand recognition with each click. Generic links don’t 
            mean a thing. Branded links help instil confidence in your content.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 rounded-lg shadow-lg relative md:w-1/3 md:mt-10">
          <div className="bg-purple-900 w-20 h-20 rounded-full flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
            <span className="text-white text-3xl">📈</span>
          </div>
          <h3 className="text-xl font-bold mt-12">Detailed Records</h3>
          <p className="text-gray-500 mt-3">
            Gain insights into who is clicking your links. Knowing when and 
            where people engage with your content helps inform better decisions.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-8 rounded-lg shadow-lg relative md:w-1/3 md:mt-20">
          <div className="bg-purple-900 w-20 h-20 rounded-full flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
            <span className="text-white text-3xl">⚙️</span>
          </div>
          <h3 className="text-xl font-bold mt-12">Fully Customizable</h3>
          <p className="text-gray-500 mt-3">
            Improve brand awareness and content discoverability through 
            customizable links, supercharging audience engagement.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Features;
