import * as THREE from 'three';

export const createCamera = (
  aspectRatio: number,
  position: THREE.Vector3 = new THREE.Vector3(0, 0, 2)
): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.copy(position);

  return camera;
};
