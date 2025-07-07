import Stats from '../stats.ts';
import { ghost, reload } from '../assets/index.ts';

export class Dead extends Phaser.Scene {
    constructor() {
        super('Dead');
    }

    init(data) {
        this.stats = data.stats;
    }

    preload() {
        this.load.image('ghost', ghost);
        this.load.image('reload', reload);
    }

    create() {
        this.ghost = this.add.image(32, 32, 'ghost');
        this.reload = this.add.sprite(32, 54, 'reload');
        this.reload.setInteractive();

        this.wiggleTween = this.tweens.add({
            targets: this.ghost,
            y: [31, 32],
            duration: 750,
            hold: 750,
            repeat: -1,
        });

        this.reload.on('pointerup', () => {
            this.wiggleTween.stop();
            this.reload.destroy();

            this.tweens.add({
                targets: this.ghost,
                x: [31, 32],            
                duration: 250,
                hold: 250,
                repeat: -1,            // -1: infinity
            });

            this.tweens.add({
                targets: this.ghost,
                y: -this.ghost.height - 5,
                duration: 2000,
                repeat: 0,
            }).on('complete', () => {
                this.scene.stop();
                this.scene.start('Egg', {
                    stats: new Stats(true),
                });
            });
        });
    }
}
