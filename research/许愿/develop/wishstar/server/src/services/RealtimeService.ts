import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { WishInteraction } from '../../../shared/types';
import { SocketEvents } from '../../../shared/constants/SocketEvents';

export type WishUpdateCallback = (data: any) => void;

export class RealtimeService {
    private io: SocketServer;
    private userSockets: Map<string, string[]> = new Map();

    public initialize(server: HttpServer): void {
        this.io = new SocketServer(server, {
            cors: {
                origin: process.env.CLIENT_URL,
                methods: ['GET', 'POST']
            }
        });

        this.setupSocketHandlers();
    }

    private setupSocketHandlers(): void {
        this.io.on('connection', (socket) => {
            const userId = socket.handshake.auth.userId;
            
            // 记录用户连接
            this.addUserSocket(userId, socket.id);

            // 加入用户专属房间
            socket.join(`user:${userId}`);

            socket.on('disconnect', () => {
                this.removeUserSocket(userId, socket.id);
                this.broadcastUserStatus(userId, false);
            });

            // 广播用户在线状态
            this.broadcastUserStatus(userId, true);

            // 设置其他事件处理器
            this.setupWishHandlers(socket);
        });
    }

    private setupWishHandlers(socket: any): void {
        socket.on(SocketEvents.WISH_INTERACTION, (data: {
            wishId: string;
            interaction: WishInteraction;
        }) => {
            this.notifyWishInteraction(data.wishId, data.interaction);
        });
    }

    public broadcastWishUpdate(wishId: string, data: any): void {
        this.io.to(`wish:${wishId}`).emit(SocketEvents.WISH_UPDATED, {
            wishId,
            ...data
        });
    }

    public notifyWishInteraction(wishId: string, interaction: WishInteraction): void {
        this.io.to(`wish:${wishId}`).emit(SocketEvents.WISH_INTERACTION, {
            wishId,
            interaction
        });
    }

    public subscribeToWishUpdates(userId: string, callback: WishUpdateCallback): void {
        const sockets = this.userSockets.get(userId) || [];
        sockets.forEach(socketId => {
            const socket = this.io.sockets.sockets.get(socketId);
            if (socket) {
                socket.on(SocketEvents.WISH_UPDATED, callback);
            }
        });
    }

    private addUserSocket(userId: string, socketId: string): void {
        const existingSockets = this.userSockets.get(userId) || [];
        this.userSockets.set(userId, [...existingSockets, socketId]);
    }

    private removeUserSocket(userId: string, socketId: string): void {
        const existingSockets = this.userSockets.get(userId) || [];
        this.userSockets.set(
            userId,
            existingSockets.filter(id => id !== socketId)
        );
    }

    private broadcastUserStatus(userId: string, isOnline: boolean): void {
        this.io.emit(isOnline ? SocketEvents.USER_ONLINE : SocketEvents.USER_OFFLINE, {
            userId,
            timestamp: new Date()
        });
    }

    public sendDirectMessage(userId: string, event: string, data: any): void {
        this.io.to(`user:${userId}`).emit(event, data);
    }

    public broadcastToAll(event: string, data: any): void {
        this.io.emit(event, data);
    }
} 