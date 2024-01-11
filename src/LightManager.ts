import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class LightManager{
    scene: THREE.Scene 
    private pmremGenerator: THREE.PMREMGenerator;
    renderer: THREE.WebGLRenderer;
    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.scene = scene
        this.renderer = renderer
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    }
    setLights(): void {
        console.log("setLights")
        
        const textureEncoding = THREE.SRGBColorSpace
        const ambientIntensity = 0.3
        const ambientColor = 0xFFFFFF
        const directIntensity = 0.8 * Math.PI
        const directColor = 0xFFFFFF
        const bgColor1 = '#ffffff'
        const bgColor2 = '#353535'
        const hdrPath = 'https://api.bear2b.com/media/91390368260cc978f160e39.01687452.hdr'

        const light1 = new THREE.AmbientLight(ambientColor, ambientIntensity);
            light1.name = 'ambient_light';
            this.scene.add(light1);

            const light2 = new THREE.DirectionalLight(directColor, directIntensity);
            //light2.position.set(0.5, 0, 0.866); // ~60º
            light2.position.set(200, -200, 600);
            this.setCubeMapTexture(hdrPath)
        this.updateTextureEncoding(textureEncoding)
        this.scene.add(light2)
        }

        private setCubeMapTexture(hdrmapUrl: string): Promise < any > {
        // no envmap
        if(!hdrmapUrl) return Promise.resolve({ envMap: null });
        return new Promise((resolve, reject) => {
            new RGBELoader()
                .setDataType(THREE.HalfFloatType)
                .load(hdrmapUrl, (texture) => {
                    console.log("hdr loaded")
                    const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
                    this.pmremGenerator.compileEquirectangularShader()
                    this.pmremGenerator.dispose();
                    resolve({ envMap });
                }, () => { }, reject);
        });
    }

    private updateTextureEncoding(colorSpace: string): void {
        console.log("updateTextureEncoding " + colorSpace)
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.scene.traverse((node) => {
            if (node.isMesh) {
                const materials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                materials.forEach((material: any) => {
                    if (material.map) material.map.colorSpace = colorSpace;
                    if (material.emissiveMap) material.emissiveMap.colorSpace = colorSpace;
                    if (material.map || material.emissiveMap) material.needsUpdate = true;
                });
            }
        })
    }
}
