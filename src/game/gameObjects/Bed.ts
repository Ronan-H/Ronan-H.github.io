import Item from './Item.ts';

export default class Bed extends Item {
    constructor(scene) {
        super(scene, 54, 54, 'bed');
    }

    onContact() {
        if (!super.onContact()) {
            return false;
        }

        this.scene.scene.start('Sleeping', {
            stats: this.scene.stats,
        });
        this.scene.scene.stop();
    }
}
