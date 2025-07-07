import { runningSheet, plantsSheet, dashGameBackground, fainted } from '../assets/index.ts';
import fontPng from '../fonts/round_6x6.png';
import fontXml from '../fonts/round_6x6.xml';

export class DashGame extends Phaser.Scene {
    guy: Phaser.Physics.Arcade.Sprite;
    obstacles: Phaser.Physics.Arcade.Group;
    text: Phaser.GameObjects.BitmapText;
    score: number;
    stats: any;

    constructor() {
        super('DashGame');
    }

    init(data) {
        this.stats = data.stats;
    }

    preload() {
        this.load.spritesheet('running-sheet', runningSheet, { frameWidth: 11, frameHeight: 16 });
        this.load.spritesheet('plants-sheet', plantsSheet, { frameWidth: 10, frameHeight: 12 });
        this.load.image('background', dashGameBackground);
        this.load.image('fainted', fainted);

        this.load.bitmapFont('pixelfont', fontPng, fontXml);
    }

    create() {
        this.add.image(32, 32, 'background');

        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('running-sheet', { frames: [ 1, 2 ] }),
            duration: 300,
            repeat: -1
        });

        this.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNumbers('running-sheet', { frames: [ 0 ] }),
            duration: 600,
            repeat: -1
        });

        [0, 1, 2].forEach(n => {
            this.anims.create({
                key: `obstacle-${n}`,
                frames: this.anims.generateFrameNumbers('plants-sheet', { frames: [ n ] }),
                repeat: -1
            });
        })

        this.physics.world.setBounds(0, 0, 64, 59);

        this.guy = this.physics.add.sprite(8, 64, 'running');
        this.guy.setDepth(1);
        this.guy.body.setSize(11, 16)
        this.guy.setSize(11, 16)
        this.guy.body.setOffset(0, 0);
        this.guy.play('running');
        this.guy.setGravityY(280);
        this.guy.setCollideWorldBounds(true);
        this.guy.body.debugShowBody = true;
        this.guy.setDebug(true, true, 0xff0000)

        this.input.on('pointerdown', (_pointer: any) => {
            if (this.guy.y >= 51 && !this.isFainted()) {
            this.guy.setVelocityY(-130);
            this.guy.play('jumping');
            }
        });

        this.events.on('pointerdown', (pointer) => {
            console.log('Pointer down at:', pointer.x, pointer.y);
        });

        this.obstacles = this.physics.add.group({ allowGravity: false }),
        this.physics.add.overlap(this.guy, this.obstacles, this.onHitObstacle, null, this);

        this.time.addEvent({
            delay: 3000, // ms
            callback: () => {
                this.addObstacle();
            },
            callbackScope: this,
            loop: false,
        });

        this.text = this.add.bitmapText(32, 26, 'pixelfont', '0', 10);
        this.text.tint = 0x9bbc0f;
        this.text.setOrigin(0.5, 0.5);

        this.score = 0;
    }

    addObstacle() {
        const o = this.physics.add.sprite(70, 53, 'obstacle-0');

        this.obstacles.add(o);

        o.setVelocityX(-70);
        const spriteIndex = Phaser.Math.RND.pick([0, 1, 2]);
        o.play(`obstacle-${spriteIndex}`);
        o.setSize(10, 12)
        o.body.setSize(10, 12)

        this.time.addEvent({
            delay: Phaser.Math.RND.between(800, 1400), // ms
            callback: () => {
                this.addObstacle();
            },
            callbackScope: this,
            loop: false,
        });
    }

    isFainted() {
        return this.guy.texture.key === 'fainted';
    }

    onHitObstacle() {
        this.guy.stop();
        this.guy.setTexture('fainted')
        this.guy.setSize(16, 11)
        this.guy.body.setSize(16, 11)
        this.input.off('pointerdown');
        this.stats.recordScore(this.score);

        this.obstacles.setVelocityX(0);

        this.time.addEvent({
            delay: 3000, // ms
            callback: () => {
                this.scene.start('Game', {
                    stats: this.stats,
                    isFromNew: false,
                });
            },
            callbackScope: this,
            loop: false,
        });
    }

    update() {
        if (this.isFainted()) return;

        if (this.guy.body.velocity.y === 0) {
            this.guy.play('running', true);
        }

        this.obstacles.getChildren().forEach(o => {
            const oRight = o.x + (o.width / 2);
            const gLeft = this.guy.x - (o.width / 2);

            if (oRight < gLeft && !o.getData('passed')) {
                this.text.setText(++this.score);
                o.setData('passed', true);
            }
        });
    }
}
