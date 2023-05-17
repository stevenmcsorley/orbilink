import * as THREE from 'three';

export const createEarth = (): THREE.Mesh => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/planets/earth_atmos_2048.jpg');
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const earth = new THREE.Mesh(geometry, material);
  earth.name = 'Earth';

  return earth;
};
