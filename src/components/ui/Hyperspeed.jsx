import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './Hyperspeed.css';

// Ultra-optimized preset for GRIND LAB (70% menos recursos)
const optimizedPreset = {
    onSpeedUp: () => { },
    onSlowDown: () => { },
    fov: 90,
    fovSpeedUp: 120, // Reducido de 150
    speedUp: 1.5, // Reducido de 2
    totalLights: 15, // Reducido de 40
    totalSticks: 10, // Reducido de 20
    roadSegments: 30, // Reducido de 100
    colors: {
        roadColor: 0x080808,
        background: 0x0B0B0F,
        lights: [0x5227FF, 0x6B42FF, 0xFF9FFC], // Purple/Pink
        sticks: 0x5227FF
    }
};

const Hyperspeed = ({ className = '' }) => {
    const containerRef = useRef(null);
    const rafRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const clockRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // Intersection Observer para lazy load
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || !containerRef.current) return;

        const container = containerRef.current;
        const isMobile = window.innerWidth < 768;
        const targetFPS = isMobile ? 30 : 60; // FPS reducido en mobile
        const frameTime = 1000 / targetFPS;
        let lastFrameTime = 0;

        // Renderer setup - OPTIMIZADO
        const renderer = new THREE.WebGLRenderer({
            antialias: false, // Disabled para performance
            alpha: true,
            powerPreference: 'low-power', // Cambiado de high-performance
            precision: 'lowp' // Low precision
        });
        renderer.setSize(container.offsetWidth, container.offsetHeight, false);
        renderer.setPixelRatio(1); // FIJO A 1 (no devicePixelRatio)
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null;
        scene.fog = new THREE.Fog(optimizedPreset.colors.background, 100, 400);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            optimizedPreset.fov,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, -3);
        cameraRef.current = camera;

        // Clock
        const clock = new THREE.Clock();
        clockRef.current = clock;

        // Road (simplificado)
        const roadGeometry = new THREE.PlaneGeometry(
            10,
            200,
            10, // Reducido de 20
            optimizedPreset.roadSegments
        );
        const roadMaterial = new THREE.MeshBasicMaterial({
            color: optimizedPreset.colors.roadColor,
            transparent: true,
            opacity: 0.6
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.z = -100;
        scene.add(road);

        // Lights (reducidos 70%)
        const lightsGroup = new THREE.Group();
        for (let i = 0; i < optimizedPreset.totalLights; i++) {
            const color = optimizedPreset.colors.lights[i % optimizedPreset.colors.lights.length];
            const geometry = new THREE.SphereGeometry(0.15, 4, 4); // Segments reducidos
            const material = new THREE.MeshBasicMaterial({ color });
            const light = new THREE.Mesh(geometry, material);

            light.position.x = (Math.random() - 0.5) * 8;
            light.position.y = 0.3;
            light.position.z = -Math.random() * 150;
            light.userData = {
                speed: 0.3 + Math.random() * 0.2,
                initialZ: light.position.z
            };

            lightsGroup.add(light);
        }
        scene.add(lightsGroup);

        // Side sticks (reducidos 50%)
        const sticksGroup = new THREE.Group();
        for (let i = 0; i < optimizedPreset.totalSticks; i++) {
            const geometry = new THREE.PlaneGeometry(0.2, 1.5);
            const material = new THREE.MeshBasicMaterial({
                color: optimizedPreset.colors.sticks,
                transparent: true,
                opacity: 0.4
            });
            const stick = new THREE.Mesh(geometry, material);

            stick.position.x = -6;
            stick.position.y = 0.75;
            stick.position.z = -(i * 15);
            sticksGroup.add(stick);
        }
        scene.add(sticksGroup);

        // Interaction state
        let fovTarget = optimizedPreset.fov;
        let speedMultiplier = 1;

        const onInteractStart = () => {
            fovTarget = optimizedPreset.fovSpeedUp;
            speedMultiplier = optimizedPreset.speedUp;
        };

        const onInteractEnd = () => {
            fovTarget = optimizedPreset.fov;
            speedMultiplier = 1;
        };

        container.addEventListener('mousedown', onInteractStart);
        container.addEventListener('mouseup', onInteractEnd);
        container.addEventListener('mouseleave', onInteractEnd);
        container.addEventListener('touchstart', onInteractStart, { passive: true });
        container.addEventListener('touchend', onInteractEnd, { passive: true });

        // Animation loop - THROTTLED
        const animate = (currentTime) => {
            if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

            // FPS throttle
            const deltaTime = currentTime - lastFrameTime;
            if (deltaTime < frameTime) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = currentTime - (deltaTime % frameTime);

            const time = clockRef.current.getElapsedTime();

            // Update lights positions
            lightsGroup.children.forEach(light => {
                light.position.z += light.userData.speed * speedMultiplier;
                if (light.position.z > 5) {
                    light.position.z = light.userData.initialZ;
                }
            });

            // Update sticks positions
            sticksGroup.children.forEach((stick, i) => {
                stick.position.z += 0.4 * speedMultiplier;
                if (stick.position.z > 5) {
                    stick.position.z = -(optimizedPreset.totalSticks * 15);
                }
            });

            // Smooth FOV transition
            const fovDelta = (fovTarget - camera.fov) * 0.05;
            if (Math.abs(fovDelta) > 0.01) {
                camera.fov += fovDelta;
                camera.updateProjectionMatrix();
            }

            // Simple camera sway
            camera.position.x = Math.sin(time * 0.3) * 0.5;
            camera.lookAt(0, 0, -50);

            renderer.render(scene, camera);
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        // Resize handler - DEBOUNCED
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!rendererRef.current || !cameraRef.current || !containerRef.current) return;
                const width = containerRef.current.offsetWidth;
                const height = containerRef.current.offsetHeight;
                rendererRef.current.setSize(width, height, false);
                cameraRef.current.aspect = width / height;
                cameraRef.current.updateProjectionMatrix();
            }, 150);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousedown', onInteractStart);
            container.removeEventListener('mouseup', onInteractEnd);
            container.removeEventListener('mouseleave', onInteractEnd);
            container.removeEventListener('touchstart', onInteractStart);
            container.removeEventListener('touchend', onInteractEnd);

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
                if (container.contains(rendererRef.current.domElement)) {
                    container.removeChild(rendererRef.current.domElement);
                }
            }
            if (sceneRef.current) {
                sceneRef.current.traverse(object => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) object.material.dispose();
                });
                sceneRef.current.clear();
            }

            rendererRef.current = null;
            sceneRef.current = null;
            cameraRef.current = null;
            clockRef.current = null;
            rafRef.current = null;
        };
    }, [isVisible]);

    return (
        <div
            ref={containerRef}
            className={`hyperspeed-container ${className}`}
            style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}
        />
    );
};

export default Hyperspeed;
