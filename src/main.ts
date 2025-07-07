import { Boot } from "./game/scenes/Boot";
import { DashGame } from "./game/scenes/DashGame";
import { Dead } from "./game/scenes/Dead";
import { Eating } from "./game/scenes/Eating";
import { Egg } from "./game/scenes/Egg";
import { Stall } from "./game/scenes/Stall";
import { Sleeping } from "./game/scenes/Sleeping";
import { Game } from "./game/scenes/Game";

document.addEventListener('DOMContentLoaded', () => {
    const config = {
        type: Phaser.AUTO,
        title: 'V-Pet',
        description: '',
        parent: 'game-container',
        pixelArt: true,
        width: 64,
        height: 64,
        physics: {
            default: 'arcade',
            arcade: {
                // debug: true,
            }
        },
        backgroundColor: '#0f380f',
        scene: [
            Boot,
            Egg,
            Game,
            Eating,
            Stall,
            Dead,
            Sleeping,
            DashGame,
        ],
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 64,
            height: 64,
        },
    }

    new Phaser.Game(config);
});