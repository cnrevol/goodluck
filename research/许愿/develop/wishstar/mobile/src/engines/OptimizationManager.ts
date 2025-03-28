import * as THREE from 'three';

export class OptimizationManager {
    private maxStars: number = 100;
    private frustumCulling: boolean = true;
    private instancedMesh: boolean = true;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;

    public initialize(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void {
        this.scene = scene;
        this.renderer = renderer;
        this.setupOptimizations();
    }

    private setupOptimizations(): void {
        // 启用视锥体裁剪
        this.enableFrustumCulling();
        
        // 设置渲染器优化
        this.setupRendererOptimizations();
        
        // 设置场景优化
        this.setupSceneOptimizations();
    }

    public setupLOD(baseMesh: THREE.Mesh): THREE.LOD {
        const lod = new THREE.LOD();

        // 高细节版本
        const highDetail = this.createDetailLevel(baseMesh, 32);
        lod.addLevel(highDetail, 0);

        // 中等细节版本
        const mediumDetail = this.createDetailLevel(baseMesh, 16);
        lod.addLevel(mediumDetail, 50);

        // 低细节版本
        const lowDetail = this.createDetailLevel(baseMesh, 8);
        lod.addLevel(lowDetail, 100);

        return lod;
    }

    private createDetailLevel(baseMesh: THREE.Mesh, segments: number): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(
            (baseMesh.geometry as THREE.SphereGeometry).parameters.radius,
            segments,
            segments
        );
        return new THREE.Mesh(geometry, baseMesh.material);
    }

    public enableFrustumCulling(): void {
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.frustumCulled = true;
            }
        });
    }

    private setupRendererOptimizations(): void {
        // 启用物理正确的光照
        this.renderer.physicallyCorrectLights = true;

        // 设置像素比
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.renderer.setPixelRatio(pixelRatio);

        // 启用阴影优化
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    private setupSceneOptimizations(): void {
        // 设置场景背景为null以优化性能
        this.scene.background = null;

        // 启用自动更新
        this.scene.matrixAutoUpdate = false;
    }

    public useInstancedMesh(geometry: THREE.BufferGeometry, material: THREE.Material, count: number): THREE.InstancedMesh {
        return new THREE.InstancedMesh(geometry, material, count);
    }

    public optimizeMemory(): void {
        // 清理未使用的纹理和材质
        this.renderer.dispose();
        
        // 遍历场景中的对象并优化
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }

    public getMaxStars(): number {
        return this.maxStars;
    }

    public setMaxStars(value: number): void {
        this.maxStars = value;
    }
}