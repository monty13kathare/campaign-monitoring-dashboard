import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  ArrowLeft,
  Search,
  AlertTriangle,
  Compass,
  Navigation2,
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number }>
  >([]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Generate floating particles
    const newParticles = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-400 opacity-20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}

      {/* Space Nebula Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <div className="text-9xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            404
          </div>
          <div className="absolute -top-2 -right-2 animate-spin-slow">
            <Compass className="w-16 h-16 text-blue-400/50" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Page Not Found</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Lost in <span className="text-blue-300">Space</span>
          </h1>

          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            The page you're looking for has ventured beyond our known universe.
            Let's help you get back on track.
          </p>

          {/* Current Path */}
          <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Search className="w-4 h-4" />
              Attempted path:
            </div>
            <code className="text-sm font-mono bg-black/30 px-3 py-2 rounded-lg block truncate">
              {location.pathname}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="group flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Home Base
          </button>
        </div>

        {/* Navigation Help */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <Navigation2 className="w-4 h-4 animate-pulse" />
            <span>Need assistance?</span>
            <a
              href="/help"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              Get help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
