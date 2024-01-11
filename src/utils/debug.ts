export function getRandomColor():string {
    // Generate a random hexadecimal number (colors are represented in hexadecimal)
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}