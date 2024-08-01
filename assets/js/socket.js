import {
    WEBSOCKET_URL
} from './env.js';

if (!WEBSOCKET_URL) {
    throw new Error('Forgot to initialize some variables');
}

WebSocket.prototype.init = function() {
    this.channels = new Map();
    this.addEventListener('message', this._handleMessage.bind(this));
};

WebSocket.prototype._handleMessage = function(message) {
    const {
        channel,
        data
    } = JSON.parse(message.data.toString());
    this.propagate(channel, data);
};

WebSocket.prototype.emit = function(channel, data) {
    this.send(JSON.stringify({
        channel,
        data
    }));
};

WebSocket.prototype.register = function(channel, callback) {
    this.channels.set(channel, callback);
};

WebSocket.prototype.propagate = function(channel, data) {
    const callback = this.channels.get(channel);
    if (!callback) return;
    callback(data);
};

WebSocket.prototype.cleanup = function() {
    this.removeEventListener('message', this._handleMessage);
    this.channels.clear();
};

export const createSocket = async (isChatroom = false) => {
    return new Promise(resolve => {
        // Correctly construct the WebSocket URL
        const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${socketProtocol}//${window.location.host}:8443`; // Adjust the port if necessary

        // Create the WebSocket with the protocol if it's a chatroom
        const ws = isChatroom ?
            new WebSocket(wsUrl, 'chatroom') :
            new WebSocket(wsUrl);

        ws.addEventListener('open', async () => {
            if (typeof ws.init === 'function') {
                ws.init();
            }

            setInterval(function() {
                if (ws.readyState === WebSocket.OPEN) {
                    if (typeof ws.emit === 'function') {
                        ws.emit('peopleOnline');
                    } else if (typeof ws.send === 'function') {
                        ws.send(JSON.stringify({
                            type: 'peopleOnline'
                        }));
                    }
                }
            }, 10000);

            resolve(ws);
        });

        ws.addEventListener('close', () => {
            // Safely call cleanup if it exists
            if (ws && typeof ws.cleanup === 'function') {
                try {
                    ws.cleanup();
                } catch (error) {
                    console.error('Error during WebSocket cleanup:', error);
                }
            }
        });

        ws.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });
};