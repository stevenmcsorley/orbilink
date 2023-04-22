import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as sgp4 from 'satellite.js';
import type { SatelliteData } from './App'; // Import the SatelliteData type from App.tsx

type EarthVisualizationProps = {
    width: number;
    height: number;
    satellites: SatelliteData[];
};



const EarthVisualization: React.FC<EarthVisualizationProps> = ({ width, height, satellites }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create a scene
        const scene = new THREE.Scene();

        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Create a WebGLRenderer
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(width, height);

        // Load Earth texture
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/planets/earth_atmos_2048.jpg');

        // Create Earth geometry and material
        const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
        const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });

        // Create Earth mesh and add it to the scene
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Create an OrbitControls object and attach it to the camera
        const controls = new OrbitControls(camera, canvasRef.current);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        // Animation loop
        const animate = () => {
            const secondsInEarthDay = 23.93 * 60 * 60;
            const rotationPerSecond = 2 * Math.PI / secondsInEarthDay;
            const rotationPerFrame = rotationPerSecond / 60;


            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            // Rotate the Earth
            // earth.rotation.y += 0.001;
            earth.rotation.y += rotationPerFrame;

            // Update satellite positions
            satellites.forEach((satellite) => {
                const satelliteMesh = scene.getObjectByName(satellite.name);

                if (satelliteMesh) {
                    const position = getSatellitePosition(satellite.tle1, satellite.tle2, new Date());

                    if (position) {
                        // Convert latitude, longitude, and altitude to 3D coordinates
                        const radius = 1 + position.alt / 6371;
                        const phi = (90 - position.lat) * (Math.PI / 180);
                        const theta = (position.lon + 180) * (Math.PI / 180);

                        satelliteMesh.position.set(
                            -radius * Math.sin(phi) * Math.cos(theta),
                            radius * Math.cos(phi),
                            radius * Math.sin(phi) * Math.sin(theta)
                        );

                        // Rotate the satellite mesh to face the Earth
                        satelliteMesh.lookAt(earth.position);
                    }
                }
            });
        };


        animate();

        // service this out to a separate file
        const dateToJday = (date: Date) => {
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();
            const hour = date.getUTCHours();
            const minute = date.getUTCMinutes();
            const second = date.getUTCSeconds();

            const M = month <= 2 ? -1 : 0;
            const A = Math.floor(year / 100);
            const B = 2 - A + Math.floor(A / 4);

            const jd = Math.floor(365.25 * (year + 4716)) +
                Math.floor(30.6001 * (month + 1 + M * 12)) +
                day +
                B -
                1524.5 +
                hour / 24 +
                minute / (24 * 60) +
                second / (24 * 60 * 60);

            return jd;
        };


        // Function to get satellite position
        const getSatellitePosition = (tle1: string, tle2: string, time: Date) => {
            const satrec = sgp4.twoline2satrec(tle1, tle2);
            const jday = dateToJday(time);
            const gmst = sgp4.gstime(jday);

            const positionAndVelocity = sgp4.propagate(satrec, time);
            if (!positionAndVelocity || typeof positionAndVelocity.position === 'boolean' || typeof positionAndVelocity.velocity === 'boolean') {
                console.error("Error in satellite propagation: position or velocity is missing");
                return null;
            }

            const positionGd = sgp4.eciToGeodetic(positionAndVelocity.position, gmst);
            return { lat: sgp4.degreesLat(positionGd.latitude), lon: sgp4.degreesLong(positionGd.longitude), alt: positionGd.height };
        };





        // Create satellite objects and add them to the scene
        satellites.forEach((satellite) => {
            const position = getSatellitePosition(satellite.tle1, satellite.tle2, new Date());

            const satelliteGeometry = new THREE.SphereGeometry(0.02, 16, 16);
            const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const satelliteMesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
            satelliteMesh.name = satellite.name;

            if (position) {
                // Convert latitude, longitude, and altitude to 3D coordinates
                const radius = 1 + position.alt / 6371;
                const phi = (90 - position.lat) * (Math.PI / 180);
                const theta = (position.lon + 180) * (Math.PI / 180);

                satelliteMesh.position.set(
                    -radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.cos(phi),
                    radius * Math.sin(phi) * Math.sin(theta)
                );
            }

            scene.add(satelliteMesh);
        });


    }, [width, height, satellites]);

    return <canvas ref={canvasRef} />;
};

export default EarthVisualization;
