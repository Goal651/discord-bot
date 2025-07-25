// API and server endpoints
const SERVER_URL = "https://discordbotserver-production.up.railway.app"

export const BASE_URL = {
    API: SERVER_URL + '/api',
    WS: SERVER_URL + '/discord'
}

export const END_POINT = {
    AUTH: {
        LOGIN: '/auth/discord/login'
    },
}

export const WS_ENDPOINTS = {
    CONNECTION: {
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        STATUS: 'connection_status'
    },
    ERROR: {
        CONNECTION: 'connect_error',
        GLOBAL: 'error',

    },
    CHANNELS: {
        JOIN: 'join_channel',
        LEAVE: 'leave_channel',
        LIST: 'channels',
    },
    MESSAGE: {
        NEW: 'message'
    }
}

