import Stats from '../stats.ts';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.stats = new Stats();
    }

    create() {
        // this.scene.start('DashGame', {
        //     stats: this.stats,
        //     isFromNew: false,
        // });

        if (this.stats.getStage() === 'egg') {
            this.scene.start('Egg', {
                stats: this.stats,
            });
            return;
        }

        this.scene.start('Game', {
            stats: this.stats,
            isFromNew: false,
        });
    }
}
