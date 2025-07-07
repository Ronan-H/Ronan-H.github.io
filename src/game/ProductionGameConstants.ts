
const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;

export default {
    stageTimes: {
        egg: {
            min: 3000,
            max: 5000,
        },
        baby: {
            min: 10000,
            max: 20000,
        },
    },
    needsTimes: {
        baby: {
            hunger: {
                min: 2 * ONE_HOUR,
                max: 4 * ONE_HOUR,
            },
            toilet: {
                min: 2 * ONE_HOUR,
                max: 4 * ONE_HOUR,
            },
            tiredness: {
                min: 2 * ONE_HOUR,
                max: 4 * ONE_HOUR,
            },
        },
    },
};
