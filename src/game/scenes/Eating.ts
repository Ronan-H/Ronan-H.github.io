import { food, babySheet } from '../assets/index.ts';

export class Eating extends Phaser.Scene {
    constructor() {
        super('Eating');
    }

    init(data) {
        this.foodPos = data.foodPos;
        this.stats = data.stats;
    }

    preload() {
        this.load.image('food', food);
        this.load.spritesheet('baby-sheet', babySheet, { frameWidth: 11, frameHeight: 16 });
    }

    create() {
        this.add.sprite(32, 32, 'baby-sheet').play('baby-mouth-open');
        this.food = this.add.image(this.foodPos.x, this.foodPos.y, 'food')

        this.tweens.add({
            targets: this.food,
            x: 32,            
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 200,
            repeat: 0,            // -1: infinity
            yoyo: false
        })

        this.tweens.chain({
            targets: this.food,
            tweens: [
                {
                    targets: this.food,
                    y: 33,            
                    ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 200,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                },
                {
                    targets: this.food,
                    scale: 0,            
                    ease: 'Cubic.easeIn',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 1000,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                },
                {
                    // Dummy tween to add a pause
                    targets: this.food,
                    scale: 0,            
                    ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 300,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                }
            ],
        }).on('complete', () => {
            this.stats.resetHunger();
            this.scene.stop();
            this.scene.start('Game', {
                stats: this.stats,
                isFromNew: false,
            });
        })
    }
}
