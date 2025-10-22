import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Database, LineChart, Shield } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Database,
      title: "Automated Data Analysis",
      description: "Upload your CSV files and get instant insights powered by AI",
    },
    {
      icon: Bot,
      title: "AI-Powered Insights",
      description: "Ask questions in plain English and get intelligent answers",
    },
    {
      icon: LineChart,
      title: "Predictive Modeling",
      description: "Forecast trends and patterns without any coding",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with enterprise-grade security",
    },
  ];

  const floatingShapes = [
    { size: 200, delay: 0, duration: 20 },
    { size: 150, delay: 2, duration: 25 },
    { size: 180, delay: 4, duration: 22 },
    { size: 120, delay: 1, duration: 18 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingShapes.map((shape, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              width: shape.size,
              height: shape.size,
              background: "linear-gradient(135deg, hsl(245 58% 51% / 0.1), hsl(189 97% 43% / 0.1))",
              filter: "blur(40px)",
              left: `${(index + 1) * 20}%`,
              top: `${(index + 1) * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* 3D Animated Title */}
          <motion.h1
            className="text-7xl md:text-9xl font-bold mb-6 gradient-text transform-3d"
            initial={{ scale: 0.5, rotateX: -30 }}
            animate={{ scale: 1, rotateX: 0 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 100,
            }}
          >
            AI4U
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-foreground/90 mb-4 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your AI-Powered Data Science Hub
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            No Knowledge Required
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Upload your CSV files and let our AI handle the rest. From data analysis to
            predictive modeling, we provide intelligent solutions for everyone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 glow bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="h-full"
            >
              <Card className="glass p-6 h-full border-border/50 hover:border-primary/50 transition-smooth">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info section */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="glass-strong rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Transform Your Data Today
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Join thousands of users who are making data-driven decisions without needing
              any technical expertise. Our AI does the heavy lifting.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-glow" />
                <span>No Coding Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-glow" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-glow" />
                <span>Real-time Analysis</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
