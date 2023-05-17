import * as THREE from 'three';

export const createRenderer = (canvas: HTMLCanvasElement, width: number, height: number): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height);

  return renderer;
};
