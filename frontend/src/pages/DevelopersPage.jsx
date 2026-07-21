import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Dribbble, Server, Code, 
  Wand2, Database, Layers, Braces, Terminal, Cpu, Globe 
} from 'lucide-react';

// --- Animated Particle Background (Golden Embers) ---
const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Smaller, finer particles
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity})`; // Amber/Gold Color
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = (canvas.height * canvas.width) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) ** 2) + ((particles[a].y - particles[b].y) ** 2);
                    if (distance < (canvas.width / 9) * (canvas.height / 9)) {
                        let opacityValue = 1 - (distance / 15000);
                        if (opacityValue > 0) {
                            ctx.strokeStyle = `rgba(245, 158, 11, ${opacityValue * 0.2})`; // Faint Gold Lines
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(particles[a].x, particles[a].y);
                            ctx.lineTo(particles[b].x, particles[b].y);
                            ctx.stroke();
                        }
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };
        
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-60" />;
};

// --- Developer Data ---
const developers = [
    {
        name: 'Ben Carter',
        role: 'Backend Architect',
        bio: 'The structural engineer of RRiwaaz. Ben designed the scalable server architecture and database schemas that ensure our inventory and orders run with military precision.',
        avatarIcon: Server,
        skills: [
            { name: 'Node.js', icon: Terminal },
            { name: 'MongoDB', icon: Database },
            { name: 'Express', icon: Cpu },
            { name: 'API Security', icon: Layers },
        ],
        links: { github: '#', linkedin: '#' }
    },
    {
        name: 'Alex Johnson',
        role: 'Frontend Artisan',
        bio: 'The artist behind the interface. Alex translated traditional royal aesthetics into a modern digital experience, crafting every animation and interaction with pixel-perfect detail.',
        avatarIcon: Wand2,
        skills: [
            { name: 'React', icon: Code },
            { name: 'Tailwind', icon: Braces },
            { name: 'Framer Motion', icon: Layers },
            { name: 'UI/UX', icon: Globe },
        ],
        links: { github: '#', linkedin: '#', portfolio: '#' }
    }
];

// --- Components ---

const SkillBadge = ({ icon: Icon, name }) => (
    <div className="flex items-center gap-2 bg-[#1c1c1c] border border-amber-900/30 rounded-sm px-3 py-2 text-xs uppercase tracking-widest text-stone-400 hover:border-amber-700/50 hover:text-amber-500 transition-colors">
        <Icon size={14} />
        <span>{name}</span>
    </div>
);

const SocialLink = ({ href, icon: Icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center rounded-full border border-stone-700 text-stone-500 hover:border-amber-600 hover:text-amber-500 hover:bg-amber-900/10 transition-all duration-300"
    >
        <Icon size={18} />
    </a>
);

const DeveloperCreditsPage = () => {
    return (
        <div className="bg-[#0f0f0f] text-stone-200 min-h-screen font-montserrat relative overflow-hidden flex flex-col justify-center">
            
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-800/20 rounded-full blur-[100px] pointer-events-none"></div>
            <ParticleBackground />
            
            <div className="relative z-10 container mx-auto px-6 py-20">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-amber-600 font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Behind The Code</span>
                    <h1 className="font-marcellus text-5xl md:text-7xl text-white mb-6">The Architects</h1>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-6"></div>
                    <p className="text-stone-400 max-w-2xl mx-auto font-light text-lg leading-relaxed">
                        Crafting digital royalty requires more than just code. It requires vision, precision, and an unwavering commitment to excellence.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={dev.name}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            className="group relative bg-[#1c1c1c]/80 backdrop-blur-md border border-stone-800 p-8 md:p-12 rounded-sm hover:border-amber-900/50 transition-all duration-500"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="p-4 bg-stone-900 border border-stone-700 rounded-full text-amber-600 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/50">
                                        <dev.avatarIcon size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex gap-3">
                                        {dev.links.github && <SocialLink href={dev.links.github} icon={Github} />}
                                        {dev.links.linkedin && <SocialLink href={dev.links.linkedin} icon={Linkedin} />}
                                        {dev.links.portfolio && <SocialLink href={dev.links.portfolio} icon={Dribbble} />}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="font-marcellus text-3xl text-white mb-2 group-hover:text-amber-500 transition-colors">{dev.name}</h2>
                                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">{dev.role}</p>
                                </div>

                                <p className="text-stone-400 leading-7 font-light mb-8 flex-grow border-l-2 border-stone-800 pl-4 group-hover:border-amber-700 transition-colors">
                                    {dev.bio}
                                </p>

                                <div>
                                    <p className="text-xs text-stone-600 font-bold uppercase tracking-widest mb-4">Core Stack</p>
                                    <div className="flex flex-wrap gap-3">
                                        {dev.skills.map((skill) => (
                                            <SkillBadge key={skill.name} icon={skill.icon} name={skill.name} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.footer 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-center mt-24"
                >
                    <p className="font-marcellus text-stone-600 text-sm">
                        RRiwaaz &copy; 2025. Engineering meets Elegance.
                    </p>
                </motion.footer>

            </div>
        </div>
    );
};

export default DeveloperCreditsPage;