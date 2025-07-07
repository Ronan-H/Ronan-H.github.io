export default class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, startX, startY, key, imagePath) {
        super(scene, startX, startY, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.startX = startX;
        this.startY = startY;

        this.create();
    }

    create() {
        this.setVisible(false);
        this.setDataEnabled();

        this.setCollideWorldBounds(true);

        this.on('drag', (_pointer, dragX, dragY) => {
            this.setPosition(dragX, dragY)
        });

        this.on('pointerdown', () => {
            this.scene.tweens.chain({
                targets: this,
                tweens: [
                    {
                        scale: 1.05,            
                        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                        duration: 50,
                        repeat: 0,            // -1: infinity
                        yoyo: false
                    },  
                    {
                        scale: 0.75,            
                        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                        duration: 100,
                        repeat: 0,            // -1: infinity
                        yoyo: false
                    },   
                ],
            })
        })

        this.on('pointerup', () => {
            const tween = this.scene.tweens.add({
                targets: this,
                scale: 1.0,            
                ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 50,
                repeat: 0,            // -1: infinity
                yoyo: false
            })

            tween.on('complete', () => {
                this.onCancel();
            })
        })

        this.scene.physics.add.collider(this, this.scene.guy, this.onContact, null, this);
        this.scene.physics.world.setBoundsCollision(true, true, true, true);
    }

    onEnter() {
        this.setPosition(this.startX, this.startY);
        this.setScale(1);
        this.setVisible(true);
        this.setInteractive({ draggable: true });
    }

    onContact() {
        this.disableInteractive();

        return true;
    }

    onCancel() {}
}
