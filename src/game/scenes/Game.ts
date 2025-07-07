import Food from '../gameObjects/Food.ts';
import Toilet from '../gameObjects/Toilet.ts';
import Bed from '../gameObjects/Bed.ts';
import GameController from '../gameObjects/GameController.ts';
import { egg, hatchParticle, food, toilet, bed, gameController, babySheet } from '../assets/index.ts';
import fontPng from '../fonts/round_6x6.png';
import fontXml from '../fonts/round_6x6.xml';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        this.stats = data.stats;
        this.isFromNew = data.isFromNew;
    }

    preload() {
        this.scale.setParentSize(window.innerWidth, window.innerHeight);

        this.load.image('egg', egg);
        console.log('Loading egg asset:', egg);
        this.load.image('hatch-particle', hatchParticle);
        this.load.image('food', food);
        this.load.image('toilet', toilet);
        this.load.image('bed', bed);
        this.load.image('game-controller', gameController);

        this.load.spritesheet('baby-sheet', babySheet, { frameWidth: 11, frameHeight: 16 });

        this.load.bitmapFont('pixelfont', fontPng, fontXml);
    }

    create() {
        this.guy = this.physics.add.sprite(32, 32, 'egg');
        this.guy.setSize(11, 16);

        this.anims.create({
            key: 'baby-idle',
            frames: this.anims.generateFrameNumbers('baby-sheet', { frames: [ 0, 1 ] }),
            duration: 600,
            repeat: -1
        });

        this.anims.create({
            key: 'baby-mouth-open',
            frames: this.anims.generateFrameNumbers('baby-sheet', { frames: [ 2 ] }),
            repeat: -1
        });

        this.food = new Food(this);
        this.toilet = new Toilet(this);
        this.bed = new Bed(this);
        this.gameController = new GameController(this);

        this.guy.play('baby-idle');
        
        this.hatchEmitter = this.add.particles(0, 0, 'hatch-particle', {
			speed: 100,
			scale: { start: 1, end: 0.2 },
            lifespan: 2000,
			blendMode: 'NORMAL',
            gravityY: 300,
            frequency: 10,
            angle: { min: -135, max: -45 },
		});
        this.hatchEmitter.setPosition(32, 32);

        // The emitter from above will already be started by default.
        if (this.isFromNew) {
            this.time.addEvent({
                delay: 100, // ms
                callback: () => {
                    this.hatchEmitter.stop();
                },
                callbackScope: this,
                loop: false,
            });
        } else {
            this.hatchEmitter.stop();
        }

        this.wiggleTween = this.tweens.add({
            targets: this.guy,
            x: [31, 32],            
            duration: 250,
            hold: 250,
            repeat: -1,            // -1: infinity
        });
        this.wiggleTween.pause();

        this.gameController.onEnter();

        this.text = this.add.bitmapText(51, 21, 'pixelfont', this.stats.data.hiscore, 10);
        this.text.tint = 0x9bbc0f;
        this.text.setOrigin(0.5, 0.5);
    }

    update() {
        this.guy.play('baby-idle', true);

        if (this.stats.isDead()) {
            this.scene.start('Dead');
            return;
        }

        if (this.stats.isHungry()) {
            this.guy.play('baby-mouth-open');

            if (!this.food.visible) {
                this.food.onEnter();
            }
        }
        if (this.stats.needsToilet()) {
            this.wiggleTween.resume();

            if (!this.toilet.visible) {
                this.toilet.onEnter();
            }
        }
        else {
            this.wiggleTween.pause();
        }
        if (this.stats.isTired()) {
            // TODO: some indicator that he's tired

            if (!this.bed.visible) {
                this.bed.onEnter();
            }
        }
    }
}
