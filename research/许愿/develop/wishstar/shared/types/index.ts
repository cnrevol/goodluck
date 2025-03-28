export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface WishAppearance {
    color: string;
    size: number;
    glowIntensity: number;
    particleEffect?: string;
}

export interface WishInteraction {
    type: 'like' | 'support' | 'energy';
    userId: string;
    timestamp: Date;
    value: number;
}

export type WishType = 'personal' | 'shared' | 'community';
export type WishStatus = 'pending' | 'active' | 'completed' | 'expired';
export type WishVisibility = 'private' | 'friends' | 'public';

export interface Wish {
    id: string;
    userId: string;
    content: string;
    type: WishType;
    status: WishStatus;
    energy: number;
    createdAt: Date;
    expiresAt?: Date;
    visibility: WishVisibility;
    interactions: WishInteraction[];
    position: Vector3;
    appearance: WishAppearance;
}

export interface UserProfile {
    avatar: string;
    nickname: string;
    bio: string;
    location?: string;
}

export interface UserSettings {
    theme: 'light' | 'dark';
    notifications: boolean;
    privacy: {
        shareWishes: boolean;
        showStatus: boolean;
    };
}

export interface User {
    id: string;
    username: string;
    email: string;
    profile: UserProfile;
    wishEnergy: number;
    level: number;
    achievements: Achievement[];
    friends: string[];
    settings: UserSettings;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    icon: string;
} 