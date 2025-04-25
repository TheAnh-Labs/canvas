export const createDummyStream = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 160;  // Larger size, but still minimal bandwidth
    canvas.height = 120;

    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Create a more visible pattern
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '24px Arial';
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.fillText('No Stream', canvas.width / 2, canvas.height / 2);

        // Draw a small animation to ensure the stream is active
        setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#222222';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#888888';
            ctx.fillText('No Stream', canvas.width / 2, canvas.height / 2);
            const date = new Date();
            ctx.fillText(date.getSeconds().toString(), canvas.width / 2, canvas.height / 2 + 30);
        }, 1000);
    }

    const stream = canvas.captureStream(5); // 5fps is enough to be visible

    return stream;
};