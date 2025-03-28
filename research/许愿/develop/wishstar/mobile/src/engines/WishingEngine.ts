import * as THREE from 'three';
import { Wish, Vector3 } from '../../../shared/types';
import { WishingStar } from './WishingStar';
import { OptimizationManager } from './OptimizationManager';

export class WishingEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private stars: Map<string, WishingStar>;
    private optimizer: OptimizationManager;
    private animationFrame: number;

    constructor() {
        this.stars = new Map();
        this.optimizer = new OptimizationManager();
    }

    public initialize(containerWidth: number, containerHeight: number): void {
        // 初始化场景
        this.scene = new THREE.Scene();
        
        // 初始化相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            containerWidth / containerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // 初始化渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(containerWidth, containerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // 添加基础光源
        this.setupLights();
        
        // 启用性能优化
        this.optimizer.initialize(this.scene, this.renderer);
    }

    private setupLights(): void {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // 主点光源
        const mainLight = new THREE.PointLight(0xffffff, 1, 100);
        mainLight.position.set(0, 10, 10);
        this.scene.add(mainLight);

        // 辅助点光源
        const fillLight = new THREE.PointLight(0x8080ff, 0.5, 100);
        fillLight.position.set(-10, -5, -10);
        this.scene.add(fillLight);
    }

    public addWish(wish: Wish): WishingStar {
        const star = new WishingStar(wish);
        this.stars.set(wish.id, star);
        this.scene.add(star.getMesh());
        return star;
    }

    public updateWish(wishId: string, data: Partial<Wish>): void {
        const star = this.stars.get(wishId);
        if (star) {
            star.update(data);
        }
    }

    public removeWish(wishId: string): void {
        const star = this.stars.get(wishId);
        if (star) {
            this.scene.remove(star.getMesh());
            this.stars.delete(wishId);
        }
    }

    public render(): void {
        this.animationFrame = requestAnimationFrame(() => this.render());
        
        // 更新所有星星的动画
        this.stars.forEach(star => star.animate());
        
        // 执行渲染
        this.renderer.render(this.scene, this.camera);
    }

    public dispose(): void {
        cancelAnimationFrame(this.animationFrame);
        this.renderer.dispose();
        this.stars.forEach(star => star.dispose());
        this.stars.clear();
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    public resize(width: number, height: number): void {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    public getCameraPosition(): Vector3 {
        return {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
    }

    public setCameraPosition(position: Vector3): void {
        this.camera.position.set(position.x, position.y, position.z);
    }
} 