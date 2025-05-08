// 调试配置
const debugConfig = {
    // 开发环境跳过登录
    skipLogin: process.env.NODE_ENV === 'development',
    // skipLogin: false,

    // 模拟用户信息
    mockUser: {
        username: 'admin',
        role: 'administrator',
        permissions: ['admin']
    }
};

export default debugConfig;