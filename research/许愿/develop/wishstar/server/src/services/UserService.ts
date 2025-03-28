import { User, UserProfile } from '../../../shared/types';
import { UserModel } from '../models/UserModel';
import { generateToken, verifyToken } from '../utils/auth';
import { hashPassword, comparePassword } from '../utils/encryption';

export interface UserRegistration {
    username: string;
    email: string;
    password: string;
    profile: Partial<UserProfile>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthToken {
    token: string;
    expiresIn: number;
}

export class UserService {
    public async register(userData: UserRegistration): Promise<User> {
        try {
            // 检查用户是否已存在
            const existingUser = await UserModel.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // 哈希密码
            const hashedPassword = await hashPassword(userData.password);

            // 创建新用户
            const user = await UserModel.create({
                ...userData,
                password: hashedPassword,
                wishEnergy: 100, // 初始能量值
                level: 1,
                achievements: [],
                friends: []
            });

            return user;
        } catch (error) {
            throw new Error('Registration failed');
        }
    }

    public async login(credentials: LoginCredentials): Promise<AuthToken> {
        try {
            // 查找用户
            const user = await UserModel.findOne({ email: credentials.email });
            if (!user) {
                throw new Error('User not found');
            }

            // 验证密码
            const isValid = await comparePassword(credentials.password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }

            // 生成token
            const token = generateToken(user);
            return {
                token,
                expiresIn: 24 * 60 * 60 // 24小时
            };
        } catch (error) {
            throw new Error('Login failed');
        }
    }

    public async updateProfile(userId: string, data: Partial<UserProfile>): Promise<User> {
        try {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $set: { profile: data } },
                { new: true }
            );
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Failed to update profile');
        }
    }

    public async getWishEnergy(userId: string): Promise<number> {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user.wishEnergy;
        } catch (error) {
            throw new Error('Failed to get wish energy');
        }
    }

    public async addWishEnergy(userId: string, amount: number): Promise<void> {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            user.wishEnergy += amount;
            await user.save();
        } catch (error) {
            throw new Error('Failed to add wish energy');
        }
    }

    public async updateLevel(userId: string): Promise<void> {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // 根据某些条件更新等级
            const newLevel = this.calculateNewLevel(user);
            if (newLevel > user.level) {
                user.level = newLevel;
                await user.save();
            }
        } catch (error) {
            throw new Error('Failed to update level');
        }
    }

    private calculateNewLevel(user: User): number {
        // 实现等级计算逻辑
        const baseXP = 1000;
        const wishCount = user.wishEnergy / 100;
        return Math.floor(Math.log(wishCount + 1) / Math.log(2)) + 1;
    }

    public async addAchievement(userId: string, achievementId: string): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(userId, {
                $addToSet: { achievements: achievementId }
            });
        } catch (error) {
            throw new Error('Failed to add achievement');
        }
    }
} 