function Boost() {
  return (
    <section className="bg-purple-900 bg-cover bg-center text-center py-20 px-6"
      style={{ backgroundImage: "url('/#')" }} // We'll replace with real SVG later
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        Boost your links today
      </h2>

      <button className="mt-6 bg-cyan-500 text-white px-10 py-3 rounded-full text-lg font-semibold">
        Get Started
      </button>
    </section>
  );
}

export default Boost;
