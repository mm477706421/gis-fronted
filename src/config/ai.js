// AI 接口配置
const aiConfig = {
    BASE_URL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    API_KEY: 'sk-7f2d477aec3946e0be30362f5e27884c',
    MODEL: 'qwen-turbo',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    // 系统预设提示语
    SYSTEM_PROMPT: '你是一个专业的地理信息系统助手，可以帮助用户解答GIS相关的问题。',
};

export default aiConfig;