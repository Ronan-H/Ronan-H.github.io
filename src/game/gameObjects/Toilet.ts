import Item from './Item.ts';

export default class Toilet extends Item {
    constructor(scene) {
        super(scene, 8, 54, 'toilet');
    }

    onContact() {
        if (!super.onContact()) {
            return false;
        }

        this.scene.scene.start('Stall', {
            stats: this.scene.stats,
        });
        this.scene.scene.stop();
    }
}
