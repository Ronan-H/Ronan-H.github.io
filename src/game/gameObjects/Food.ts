import Item from './Item.ts';

export default class Food extends Item {
    constructor(scene) {
        super(scene, 8, 13, 'food');
    }

    onContact() {
        if (!super.onContact()) {
            return false;
        }

        const foodPos = {
            x: this.x,
            y: this.y,
        };

        this.scene.scene.start('Eating', {
            foodPos,
            stats: this.scene.stats,
        });
        this.scene.scene.stop();
    }
}
