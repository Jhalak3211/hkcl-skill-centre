import { motion } from 'framer-motion';

const defaultEase = [0.22, 1, 0.36, 1];

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 20,
  className = '',
  as = 'div',
  viewport = { once: true, amount: 0.15 },
  ...props
}) {
  const Component = motion[as] || motion.div;

  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <Component
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{
        duration,
        delay,
        ease: defaultEase,
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FadeInStagger({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  className = '',
  as = 'div',
  viewport = { once: true, amount: 0.1 },
  ...props
}) {
  const Component = motion[as] || motion.div;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FadeInItem({
  children,
  distance = 18,
  duration = 0.5,
  className = '',
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  const itemVariants = {
    hidden: { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: defaultEase,
      },
    },
  };

  return (
    <Component variants={itemVariants} className={className} {...props}>
      {children}
    </Component>
  );
}
