'use strict';

module.exports = {
  USER_ROLES: {
    SUPER_ADMIN: 1,
    TEACHER: 2,
    STUDENT: 3
  },
  STUDENT_LEARNING_MODE: {
    ADD_SUB: 1,
    MUL_DIV: 2
  },
  MATH_OPERATION: {
    ADDITION: 1,
    SUBTRACTION: 2,
    MULTIPLICATION: 3,
    DIVISION: 4
  },
  STRATEGY_GROUP: {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6
  },
  MATH_OPERATION_SIGN: {
    1: '+',
    2: '-',
    3: '*',
    4: '/'
  },
  MATH_OPERATION_INITIAL: {
    1: 'add',
    2: 'sub',
    3: 'mul',
    4: 'div'
  },
  QUESTION_COUNT_CONFIG: {
    ADD_SUB: {
      1: { total: 20 },
      2: { total: 32, currentNoReverse: 11, previosRemainingNonRever: 11 },
      3: { total: 25, currentNoReverse: 0, previosRemainingNonRever: 0, current: 5, remainingCurrentMax: 5, previos: 15 },
      4: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      5: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      6: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      7: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      8: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      9: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      10: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      11: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      12: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
      13: { total: 0, currentNoReverse: 0, previosRemainingNonRever: 0, current: 0, remainingCurrentMax: 10, previos: 10 },
    },
    MUL_DIV: {
      1: { total: 23 },
      2: { total: 30, current: 10, currentRem: 7, previous: 10, previousHighWeight: 3 },
      3: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      4: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      5: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      6: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      7: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      8: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      9: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      10: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      11: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
      12: { total: 30, current: 10, currentRem: 7, previousLowWeigth: 3, previousHighWeight: 10 },
    },
    RADOM_CURRENT_LEVLE: Math.floor(Math.random() * 14)
  }
};
