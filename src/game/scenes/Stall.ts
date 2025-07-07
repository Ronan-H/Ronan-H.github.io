import { stall } from '../assets/index.ts';

export class Stall extends Phaser.Scene {
    constructor() {
        super('Stall');
    }

    init(data) {
        this.stats = data.stats;
    }

    preload() {
        this.load.image('stall', stall);
    }

    create() {
        this.stall = this.add.image(32, 32, 'stall');

        this.time.addEvent({
            delay: 3000, // ms
            callback: () => {
                this.stats.resetToilet();
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
