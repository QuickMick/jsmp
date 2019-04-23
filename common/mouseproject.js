const THREE = require('three');

class Projector {
  constructor() {
    this.m_vPos = new THREE.Vector3();
    this.m_vDir = new THREE.Vector3();
  }

  Compute(nMouseX, nMouseY, Camera, vOutPos) {
    let vPos = this.m_vPos;
    let vDir = this.m_vDir;

    vPos.set(
      nMouseX,
      nMouseY,
      0.5
    ).unproject(Camera);

    // Calculate a unit vector from the camera to the projected position
    vDir.copy(vPos).sub(Camera.position).normalize();

    // Project onto z=0
    let flDistance = -Camera.position.z / vDir.z;
    vOutPos.copy(Camera.position).add(vDir.multiplyScalar(flDistance));
  }
}
module.exports = Projector;