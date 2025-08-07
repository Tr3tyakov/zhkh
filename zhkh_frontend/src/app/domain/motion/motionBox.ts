import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const defaultMotionConfig = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3, delay: 0.05 },
};

const MotionBox = motion.create(Box);

export { MotionBox, defaultMotionConfig };
