import React, { useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createScene } from './services/scene';
import { createCamera } from './services/camera';
import { createRenderer } from './services/renderer';
import { createEarth } from './services/Earth';
import { createSatelliteMesh } from './services/satellite';
import { getSatellitePosition } from './services/getSatellitePosition';
import { MeshBasicMaterial, Scene } from 'three';

type SatelliteData = {
    name: string;
    tle1: string;
    tle2: string;
  };

type EarthVisualizationProps = {
    width: number;
    height: number;
    satellites: SatelliteData[];
    selectedSatellite: string | null;
    onSatellitePositionsUpdate: (positions: { [name: string]: { lat: number; lon: number, alt: number } }) => void;
};

const EarthVisualization: React.FC<EarthVisualizationProps> = ({
    width,
    height,
    satellites,
    selectedSatellite,
    onSatellitePositionsUpdate,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<Scene>();

    useEffect(() => {
        if (!canvasRef.current) return;

        const satellitePositions: { [name: string]: { lat: number; lon: number, alt: number } } = {};

        const scene = createScene();
        sceneRef.current = scene;
        const aspectRatio = width / height;
        const camera = createCamera(aspectRatio);
        const renderer = createRenderer(canvasRef.current, width, height);
        const earth = createEarth();
        scene.add(earth);
        camera.lookAt(earth.position);
        const controls = new OrbitControls(camera, canvasRef.current);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        satellites.forEach((satellite) => {
            const satelliteMesh = createSatelliteMesh(satellite.name);
            scene.add(satelliteMesh);
        });

        const animate = () => {
            const secondsInEarthDay = 23.93 * 60 * 60;
            const rotationPerSecond = 2 * Math.PI / secondsInEarthDay;
            const rotationPerFrame = rotationPerSecond / 60;
            const updatedSatellitePositions = { ...satellitePositions };
            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            if (selectedSatellite) {
                const satelliteData = satellites.find((sat) => sat.name === selectedSatellite);
                if (satelliteData) {
                    const position = getSatellitePosition(satelliteData.tle1, satelliteData.tle2);
                    if (position) {
                        const rotationRadians = -position.lon * (Math.PI / 180);
                        earth.rotation.y = rotationRadians;
                    }
                }
            } else {
                earth.rotation.y += rotationPerFrame;
            }

            satellites.forEach((satellite) => {
                const satelliteMesh = scene.getObjectByName(satellite.name);

                if (satelliteMesh) {
                    const position = getSatellitePosition(satellite.tle1, satellite.tle2);

                    if (position) {
                        satellitePositions[satellite.name] = { lat: position.lat, lon: position.lon, alt: position.alt };
                        updatedSatellitePositions[satellite.name] = { lat: position.lat, lon: position.lon, alt: position.alt };
                        const radius = 1 + position.alt / 6371;
                        const phi = (90 - position.lat) * (Math.PI / 180);
                        const theta = (position.lon + 180) * (Math.PI / 180);

                        satelliteMesh.position.set(
                            -radius * Math.sin(phi) * Math.cos(theta),
                            radius * Math.cos(phi),
                            radius * Math.sin(phi) * Math.sin(theta)
                        );

                        satelliteMesh.lookAt(earth.position);
                    }
                }
            });
            onSatellitePositionsUpdate(updatedSatellitePositions);
        };

        animate();
    }, [width, height, satellites, selectedSatellite, onSatellitePositionsUpdate]);

    useEffect(() => {
        if (!sceneRef.current) return;

        const scene = sceneRef.current;
        satellites.forEach((satellite) => {
            const satelliteMesh = scene.getObjectByName(satellite.name) as THREE.Mesh;

            if (satelliteMesh) {
                if (satellite.name === selectedSatellite) {
                    if (satelliteMesh.material instanceof MeshBasicMaterial) {
                        (satelliteMesh.material as MeshBasicMaterial).color.set(0xff0000);
                    } else if (Array.isArray(satelliteMesh.material)) {
                        satelliteMesh.material.forEach((material) => (material as MeshBasicMaterial).color.set(0xff0000));
                    }
                } else {
                    if (satelliteMesh.material instanceof MeshBasicMaterial) {
                        (satelliteMesh.material as MeshBasicMaterial).color.set(0xffffff);
                    } else if (Array.isArray(satelliteMesh.material)) {
                        satelliteMesh.material.forEach((material) => (material as MeshBasicMaterial).color.set(0xffffff));
                    }
                }

            }
        });
    }, [satellites, selectedSatellite]);

    return <canvas ref={canvasRef} />;
};

export default EarthVisualization;  
