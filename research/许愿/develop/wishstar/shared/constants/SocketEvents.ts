export const SocketEvents = {
    // 愿望相关事件
    WISH_CREATED: 'wish:created',
    WISH_UPDATED: 'wish:updated',
    WISH_DELETED: 'wish:deleted',
    WISH_INTERACTION: 'wish:interaction',
    
    // 能量相关事件
    ENERGY_UPDATED: 'energy:updated',
    ENERGY_RECEIVED: 'energy:received',
    ENERGY_SENT: 'energy:sent',
    
    // 用户状态事件
    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline',
    USER_TYPING: 'user:typing',
    
    // 成就相关事件
    ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
    
    // 系统事件
    SYSTEM_NOTIFICATION: 'system:notification',
    ERROR: 'error'
} as const;

// 使用const断言确保类型安全
export type SocketEventType = keyof typeof SocketEvents; 