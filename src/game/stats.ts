
import Phaser from 'phaser';
import GameConstants from './ProductionGameConstants.ts';

const STATS_STORAGE_KEY = 'stats';

export default class Stats {
    constructor(startNew) {
        if (Stats.statsSaveExists() && !startNew) {
            this.deserialise();
        }
        else {
            this.initialiseNew();
        }

        // For debugging
        window.stats = this;
    }

    static randBetween({ min, max }) {
        return Phaser.Math.Between(min, max);
    }

    initialiseNew() {
        const now = Date.now();

        const eggTime = Stats.randBetween(GameConstants.stageTimes.egg);
        const babyTime = Stats.randBetween(GameConstants.stageTimes.baby);

        const eggEnd = now + eggTime;
        const babyEnd = eggEnd + babyTime;

        this.data = {
            hunger: {},
            toilet: {},
            tiredness: {},
            stageEnds: {
                egg: eggEnd,
                baby: babyEnd,
            },
            hiscore: 0,
        };

        this.serialise();
    }

    getStage() {
        const now = Date.now();

        if (now >= this.data.stageEnds.egg) {
            return 'baby';
        }

        return 'egg';
    }

    getTimeToHatch() {
        const now = Date.now();
        return this.data.stageEnds.egg - now;
    }

    isHungry() {
        const now = Date.now();
        return now >= this.data.hunger.next;
    }

    needsToilet() {
        const now = Date.now();
        return now >= this.data.toilet.next;
    }

    isTired() {
        const now = Date.now();
        return now >= this.data.tiredness.next;
    }

    resetStat(stat, offset) {
        const now = Date.now();

        this.data[stat].next = now + Stats.randBetween(GameConstants.needsTimes.baby[stat]) + offset;
        this.data[stat].dead = now + Stats.randBetween(GameConstants.needsTimes.baby[stat]) * 2 + offset;

        this.serialise();
    }

    resetHunger(offset) {
        this.resetStat('hunger', offset ?? 0);
    }

    resetToilet(offset) {
        this.resetStat('toilet', offset ?? 0);
    }

    resetTiredness(offset) {
        this.resetStat('tiredness', offset ?? 0);
    }

    isDead() {
        const now = Date.now();

        return (
            now >= this.data.hunger.dead ||
            now >= this.data.toilet.dead ||
            now >= this.data.tiredness.dead
        );
    }

    recordScore(score) {
        this.data.hiscore = Math.max(this.data.hiscore, score);
        this.serialise();
    }

    static statsSaveExists() {
        return !!localStorage.getItem(STATS_STORAGE_KEY);
    }

    serialise() {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(this.data));
    }

    deserialise() {
        this.data = JSON.parse(localStorage.getItem(STATS_STORAGE_KEY));
    }
}
