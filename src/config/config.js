export const Config = {
    settings: {
        key: 'eurofooslive-graphics-settings'
    },
    actions: {
        TEAMS_UPDATE: 'teams:update',
    },
    events: {
        TEAMS_UPDATED: 'teams:updated'
    },
    bug: {
        formats: [
            'jpg',
            'png',
            'gif'
        ]
    },
    webcam: {
        constraints: {
            audio: true,
            video: {
                width: {
                    min: 1920
                },
                height: {
                    min: 1080
                },
                deviceId: undefined
            }
        }
    },
    video: {
        formats: [
            'mov',
            'mp4',
            'avi',
            'mpeg',
            'mpg',
            'mkv'
        ]
    },
    overlay: {
        formats: [
            'jpg',
            'png',
            'gif'
        ]
    },
    stinger: {
        formats: [
            'png',
            'jpg'
        ],
        duration: 1000,
        width: 0,
        height: 0
    }
}