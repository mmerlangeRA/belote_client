import * as THREE from 'three';

export class MouseManager{
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    onMouseOver(event: MouseEvent, camera: THREE.Camera, objects: Array<THREE.Object3D>): THREE.Object3D | null {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    return this.testRaycaster(camera, objects)
}

    onMouseDown(event: MouseEvent, camera: THREE.Camera, objects: Array<THREE.Object3D>): THREE.Object3D | null {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    return this.testRaycaster(camera,objects)
}
    
    testRaycaster(camera: THREE.Camera, objects: Array<THREE.Object3D>): THREE.Object3D | null{
        this.raycaster.setFromCamera(this.pointer, camera);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            return intersects[0].object;
            //intersects[0].object.material.color.set(0xff0000);
        }
        return null
    }
}