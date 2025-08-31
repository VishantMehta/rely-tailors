import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Dribbble, Server, Code, UserCircle, Wand2, Database, Layers, Braces, Terminal } from 'lucide-react';

// --- Animated Particle Background Component ---
// This creates a subtle, interactive particle effect on a canvas element.
const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            particles = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 1.5 + 1;
                let x = Math.random() * (window.innerWidth - size * 2) + size;
                let y = Math.random() * (window.innerHeight - size * 2) + size;
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(200, 200, 200, 0.6)';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(200, 200, 200, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        };
        
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};


// --- Mock Data ---
// Replace with actual developer information
const developers = [
    {
        name: 'Ben Carter',
        role: 'Lead Full-Stack Architect',
        bio: 'Ben engineered the robust and scalable architecture that powers the entire platform, from the server-side logic to critical frontend components. His work ensures that everything runs securely and efficiently, forming the unshakable bedrock of the application.',
        avatarIcon: Server,
        skills: [
            { name: 'Node.js', icon: Terminal },
            { name: 'React', icon: Code },
            { name: 'MongoDB', icon: Database },
            { name: 'Express.js', icon: Server },
        ],
        links: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
        }
    },
    {
        name: 'Alex Johnson',
        role: 'UI/UX & Frontend Specialist',
        bio: 'Alex was the visionary behind the seamless user experience and aesthetic of Rely Tailors. With a passion for intuitive design, he meticulously crafted every pixel and interaction on the frontend to bring the brand\'s digital vision to life.',
        avatarIcon: Wand2,
        skills: [
            { name: 'React', icon: Code },
            { name: 'Framer Motion', icon: Layers },
            { name: 'Tailwind CSS', icon: Terminal },
            { name: 'Redux Toolkit', icon: Braces },
        ],
        links: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            portfolio: 'https://dribbble.com',
        }
    }
];

// --- Sub-components ---
const SkillBadge = ({ icon: Icon, name }) => (
    <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-full px-3 py-1.5 text-sm text-slate-300">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span>{name}</span>
    </div>
);

const SocialLink = ({ href, icon: Icon, 'aria-label': ariaLabel }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="text-slate-400 hover:text-white transition-colors duration-300"
    >
        <Icon className="w-6 h-6" />
    </a>
);

// --- Main Page Component ---
const DeveloperCreditsPage = () => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: 0.4 + i * 0.2,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // A nice spring-like easing
            },
        }),
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans relative overflow-hidden">
            <ParticleBackground />
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20 md:py-28">
                {/* --- Header --- */}
                <motion.header
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <h1 className="font-marcellus text-5xl md:text-6xl text-white tracking-tight">
                        The Architects
                    </h1>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        Meet the minds behind the code. This platform is a testament to their passion, skill, and dedication to craftsmanship.
                    </p>
                </motion.header>

                {/* --- Developer Profiles --- */}
                <main className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {developers.map((dev, i) => (
                        <motion.div
                            key={dev.name}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl shadow-black/20 flex flex-col"
                        >
                            <div className="flex items-center gap-5 mb-6">
                                <div className="bg-slate-700 p-3 rounded-full border-2 border-slate-600">
                                    <dev.avatarIcon className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{dev.name}</h2>
                                    <p className="text-sm text-cyan-400 font-medium tracking-wide">{dev.role}</p>
                                </div>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-8 flex-grow">
                                {dev.bio}
                            </p>

                            <div className="mb-8">
                                <h3 className="text-slate-400 text-sm font-semibold mb-4 tracking-wider uppercase">Toolkit</h3>
                                <div className="flex flex-wrap gap-3">
                                    {dev.skills.map(skill => (
                                        <SkillBadge key={skill.name} name={skill.name} icon={skill.icon} />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto border-t border-slate-700 pt-6 flex justify-between items-center">
                                <p className="text-xs text-slate-500">Connect with {dev.name.split(' ')[0]}</p>
                                <div className="flex items-center gap-5">
                                    {dev.links.github && <SocialLink href={dev.links.github} icon={Github} aria-label={`${dev.name}'s Github`} />}
                                    {dev.links.linkedin && <SocialLink href={dev.links.linkedin} icon={Linkedin} aria-label={`${dev.name}'s LinkedIn`} />}
                                    {dev.links.portfolio && <SocialLink href={dev.links.portfolio} icon={Dribbble} aria-label={`${dev.name}'s Portfolio`} />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </main>

                {/* --- Footer --- */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="text-center mt-20"
                >
                    <p className="text-slate-500 text-sm">
                        Built with React & a passion for detail.
                    </p>
                </motion.footer>
            </div>
        </div>
    );
};

export default DeveloperCreditsPage;
