import * as THREE from 'three';

export const createSatelliteMesh = (name: string): THREE.Mesh => {
  const geometry = new THREE.SphereGeometry(0.02, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);

  // Assign name to the mesh
  mesh.name = name;

  return mesh;
};
