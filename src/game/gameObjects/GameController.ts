import Item from './Item.ts';

export default class GameController extends Item {
    constructor(scene) {
        super(scene, 50, 10, 'game-controller');
    }

    onContact() {
        if (!super.onContact()) {
            return false;
        }

        this.scene.scene.start('DashGame', {
            stats: this.scene.stats,
        });
        this.scene.scene.stop();
    }
}
