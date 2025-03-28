import { Wish, WishType, WishVisibility } from '../../../shared/types';
import { api } from '../utils/api';

export interface WishData {
    content: string;
    type: WishType;
    visibility: WishVisibility;
    expiresAt?: Date;
}

export interface WishFilters {
    type?: WishType;
    visibility?: WishVisibility;
    status?: string;
    userId?: string;
}

export class WishService {
    public async createWish(wishData: WishData): Promise<Wish> {
        try {
            const response = await api.post('/wishes', wishData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create wish');
        }
    }

    public async updateWish(wishId: string, data: Partial<WishData>): Promise<Wish> {
        try {
            const response = await api.put(`/wishes/${wishId}`, data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update wish');
        }
    }

    public async deleteWish(wishId: string): Promise<void> {
        try {
            await api.delete(`/wishes/${wishId}`);
        } catch (error) {
            throw new Error('Failed to delete wish');
        }
    }

    public async getWishes(filters: WishFilters = {}): Promise<Wish[]> {
        try {
            const response = await api.get('/wishes', { params: filters });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch wishes');
        }
    }

    public async getWishById(wishId: string): Promise<Wish> {
        try {
            const response = await api.get(`/wishes/${wishId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch wish');
        }
    }

    public async shareWish(wishId: string, shareType: 'social' | 'private'): Promise<void> {
        try {
            await api.post(`/wishes/${wishId}/share`, { shareType });
        } catch (error) {
            throw new Error('Failed to share wish');
        }
    }

    public async addInteraction(wishId: string, interactionType: string): Promise<void> {
        try {
            await api.post(`/wishes/${wishId}/interactions`, { type: interactionType });
        } catch (error) {
            throw new Error('Failed to add interaction');
        }
    }

    public async getWishStats(wishId: string): Promise<{
        interactions: number;
        energy: number;
        supporters: number;
    }> {
        try {
            const response = await api.get(`/wishes/${wishId}/stats`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch wish stats');
        }
    }
}