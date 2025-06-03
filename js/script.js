import { Renderer } from './core/Renderer.js';

async function main() {
    const canvas = document.querySelector("#canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    try {
        const renderer = new Renderer(canvas);
        await renderer.init();
        renderer.start();
    } catch (error) {
        console.error("Initialization error:", error);
        alert(`Erro de inicialização: ${error.message}`);
    }
}

main().catch(e => console.error("Runtime error:", e));