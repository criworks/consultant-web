import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let initialized = false;

export function initLenis() {
        if (initialized || typeof window === 'undefined') return;
        
        const lenis = new Lenis({
                autoRaf: false,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
        
        initialized = true;
        return lenis;
}
