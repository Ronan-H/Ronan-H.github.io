import { egg } from '../assets/index.ts';

export class Egg extends Phaser.Scene {
    constructor() {
        super('Egg');
    }

    init(data) {
        this.stats = data.stats;
    }

    preload() {
        this.load.image('egg', egg);
    }

    create() {
        this.add.image(32, 32, 'egg');

        this.stats.resetHunger(this.stats.getTimeToHatch());
        this.stats.resetToilet(this.stats.getTimeToHatch());
        this.stats.resetTiredness(this.stats.getTimeToHatch());

        this.time.addEvent({
            delay: this.stats.getTimeToHatch(),
            callback: () => {
                this.scene.start('Game', {
                    stats: this.stats,
                    isFromNew: true,
                })
            },
            callbackScope: this,
            loop: false,
        });
    }
}
