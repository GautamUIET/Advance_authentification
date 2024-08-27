import { motion } from "framer-motion";

const FloatingShape = ({ color, size, top, left, animationType, delay }) => {
  let animationProps;

  switch (animationType) {
    case "pulse":
      animationProps = {
        scale: [1, 1.5, 1],
      };
      break;

    case "bounce":
      animationProps = {
        y: ["0%", "-20%", "0%"],
      };
      break;

    case "swirl":
      animationProps = {
        rotate: [0, 360],
      };
      break;

    case "wave":
      animationProps = {
        x: ["0%", "15%", "-15%", "0%"],
        y: ["0%", "15%", "-15%", "0%"],
      };
      break;

    default:
      animationProps = {
        x: ["0%", "100%", "0%"],
      };
  }

  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-3xl`}
      style={{ top, left }}
      animate={animationProps}
      transition={{
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
