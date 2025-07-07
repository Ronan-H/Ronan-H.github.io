import { sleeping } from '../assets/index.ts';

export class Sleeping extends Phaser.Scene {
    constructor() {
        super('Sleeping');
    }

    init(data) {
        this.stats = data.stats;
    }

    preload() {
        this.load.image('sleeping', sleeping);
    }

    create() {
        this.stall = this.add.image(32, 32, 'sleeping');

        this.time.addEvent({
            delay: 3000, // ms
            callback: () => {
                this.stats.resetTiredness();
                this.scene.stop();
                this.scene.start('Game', {
                    stats: this.stats,
                    isFromNew: false,
                });
            },
            callbackScope: this,
            loop: false,
        });
    }
}
