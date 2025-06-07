import React, { useEffect, useRef, useState } from 'react';

// 🎯 ANIMATIONS SPÉCIALISÉES JUTRANS

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function pour une animation fluide
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          updateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={countRef} className={className}>
      {prefix}{count.toLocaleString('fr-FR')}{suffix}
    </span>
  );
};

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

interface FadeInViewProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransformClasses = () => {
    if (!isVisible) {
      switch (direction) {
        case 'down': return 'translate-y-[-30px]';
        case 'left': return 'translate-x-[30px]';
        case 'right': return 'translate-x-[-30px]';
        default: return 'translate-y-[30px]';
      }
    }
    return 'translate-y-0 translate-x-0';
  };

  return (
    <div
      ref={ref}
      className={`
        transition-all ease-out opacity-0
        ${isVisible ? 'opacity-100' : ''}
        ${getTransformClasses()}
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`
      }}
    >
      {children}
    </div>
  );
};

interface PulseProps {
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  color = 'blue',
  size = 'md',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-2 h-2';
      case 'lg': return 'w-6 h-6';
      default: return 'w-4 h-4';
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {children}
      <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
        <span
          className={`
            animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
            ${color === 'blue' ? 'bg-blue-400' : ''}
            ${color === 'red' ? 'bg-red-400' : ''}
            ${color === 'green' ? 'bg-green-400' : ''}
            ${color === 'yellow' ? 'bg-yellow-400' : ''}
          `}
        ></span>
        <span
          className={`
            relative inline-flex rounded-full ${getSizeClasses()}
            ${color === 'blue' ? 'bg-blue-500' : ''}
            ${color === 'red' ? 'bg-red-500' : ''}
            ${color === 'green' ? 'bg-green-500' : ''}
            ${color === 'yellow' ? 'bg-yellow-500' : ''}
          `}
        ></span>
      </span>
    </div>
  );
};

interface FloatingProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  className?: string;
}

export const Floating: React.FC<FloatingProps> = ({
  children,
  amplitude = 10,
  duration = 3,
  className = ''
}) => {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animationDuration: `${duration}s`,
        '--float-amplitude': `${amplitude}px`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface GlowProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const Glow: React.FC<GlowProps> = ({
  children,
  color = 'blue',
  intensity = 'medium',
  className = ''
}) => {
  const getGlowClasses = () => {
    const colorMap = {
      blue: 'shadow-blue-500/50',
      green: 'shadow-green-500/50',
      red: 'shadow-red-500/50',
      yellow: 'shadow-yellow-500/50',
      purple: 'shadow-purple-500/50'
    };

    const intensityMap = {
      low: 'shadow-lg',
      medium: 'shadow-xl',
      high: 'shadow-2xl'
    };

    return `${intensityMap[intensity]} ${colorMap[color]}`;
  };

  return (
    <div className={`transition-all duration-300 hover:${getGlowClasses()} ${className}`}>
      {children}
    </div>
  );
};

interface ShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`
        relative overflow-hidden
        before:absolute before:inset-0
        before:-translate-x-full
        before:animate-[shimmer_2s_infinite]
        before:bg-gradient-to-r
        before:from-transparent before:via-white/20 before:to-transparent
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface MorphingProps {
  shapes: React.ReactNode[];
  interval?: number;
  className?: string;
}

export const Morphing: React.FC<MorphingProps> = ({
  shapes,
  interval = 3000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shapes.length);
    }, interval);

    return () => clearInterval(timer);
  }, [shapes.length, interval]);

  return (
    <div className={`relative ${className}`}>
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`
            absolute inset-0 transition-all duration-1000 ease-in-out
            ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          {shape}
        </div>
      ))}
    </div>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  delay?: number;
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  delay = 100,
  className = ''
}) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          children.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * delay);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [children, delay]);

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`
            transition-all duration-500 ease-out
            ${visibleItems[index] 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
            }
          `}
        >
          {child}
        </div>
      ))}
    </div>
  );
};