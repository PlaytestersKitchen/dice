'use strict';

angular.module('diceApp')
.controller('MainCtrl', function ($scope, _) {

  $scope.rollTypes = {
    'D': {
      hint: '',
      fn: function rollDice (faces, count) {
        return $scope.rollSimple(faces, count);
      }
    },

    'H': {
      hint: 'keep highest',
      fn: function takeHighest (faces, count) {
        return [_.max($scope.rollSimple(faces, count))];
      }
    },

    'L': {
      hint: 'keep lowest',
      fn: function takeLowest (faces, count) {
        return [_.min($scope.rollSimple(faces, count))];
      }
    },

    'I': {
      hint: 'drop lowest',
      fn: function dropLowest (faces, count) {
        var results = $scope.rollSimple(faces, count);
        var lowest = _.min(results);
        results.splice(results.indexOf(lowest), 1);
        return results;
      }
    },

    'U': {
      hint: 'pivot on ± dice roll',
      fn: function fudgeRolls (faces, count) {
        // Fudged rolls take `faces` and makes valid results numbers `(faces * - 1)` through `faces`.
        faces = Math.abs(faces);
        return _.map($scope.rollSimple(faces * 2, count), function (dice) { return dice - faces; });
      }
    },

    'N': {
      hint: 'unique results',
      fn: function uniqueRolls (faces, count, uniqueRolls_) {
        if (count > faces) {
          return _.range(1, faces + 1);
        }

        var rolls = uniqueRolls_ || [];
        rolls = _.unique(rolls.concat($scope.rollSimple(faces, count)));
        if (rolls.length >= count) {
          return rolls.slice(0, count);
        } else {
          return this.fn(faces, count, rolls);
        }
      }
    }
  };

  $scope.rollModifiers = {
    'null': {
      hint: function () { return ''; },
      fn: function noOperation () {}
    },

    'Z': {
      hint: function (modifier) {
        return 'sum highest ' + modifier + ' rolls';
      },
      fn: function sumHighest (result, n) {
        return [_.reduce(_.rest(result.sort(), _.size(result) - n), function (sum, num) {
          return sum + num;
        })];
      }
    },

    'E': {
      hint: function (modifier) {
        return 'count successes (rolls over ' + modifier + ')';
      },
      fn: function countSuccesses (result, success) {
        return [_.filter(result, function (roll) { return roll > success; }).length];
      }
    },

    'R': {
      hint: function (modifier) {
        return 're-roll on ' + modifier + ' or less';
      },
      fn: function reRollOn(result, reroll) {
        // Not implemented
        return result + reroll;
      }
    }
  };

  $scope.upperLowerRegex = function (keys) {
    // Create a list of upper and lowercase characters, suitable for a regular expression.
    // ['A', 'B', 'C'] -> '[ABCabc]'
    var upperAndLower = keys.concat(_.map(keys, function (key) { return key.toLowerCase(); }));
    return ['[', upperAndLower.join(''), ']'].join('');
  };

  $scope.validRollTypes = $scope.upperLowerRegex(_.keys($scope.rollTypes));
  $scope.validModifiers = $scope.upperLowerRegex(_.keys($scope.rollModifiers));

  $scope.regexes = {
    validInput: new RegExp('\\d+' + $scope.validRollTypes + '{1}\\d+'),
    hasModifier: new RegExp('\\d+' + $scope.validRollTypes + '{1}\\d+' + $scope.validModifiers + '{1}\\d+'),
    modifier: new RegExp('\\d+' + $scope.validRollTypes + '{1}\\d+(' + $scope.validModifiers + '{1})'),
    modifiedBy: new RegExp('\\d+' + $scope.validRollTypes + '{1}\\d+' + $scope.validModifiers + '{1}(\\d+)'),
    diceCount: /(\d+)/,
    rollType: new RegExp('\\d+(' + $scope.validRollTypes + '{1})\\d+'),
    diceType: new RegExp('\\d+[' + $scope.validRollTypes + '{1}(\\d+)')
  };

  $scope.roll = function (input) {
    var tokens = $scope.tokenizeInput(input);
    var result = $scope.rollTypes[tokens.rollType].fn(tokens.diceType, tokens.diceCount);
    if (tokens.hasModifier) {
      result = $scope.rollModifiers[tokens.modifier].fn(result, tokens.modifiedBy);
    }
    // [2, 5, 10] -> ["[", 2, "], [", 5, "], [", 10, "]"] -> "[2], [5], [10]"
    $scope.result = ['[', result.join('], ['), ']'].join('');
  };

  $scope.tokenizeInput = function (input) {
    input = input || '';
    input = $scope.regexes.validInput.test(input) ? input.toUpperCase() : '0D0';
    var modifier = $scope.regexes.hasModifier.test(input);
    modifier = modifier && input.match($scope.regexes.modifier)[1].toUpperCase();
    return {
      diceCount: input.match($scope.regexes.diceCount)[1],
      rollType: input.match($scope.regexes.rollType)[1],
      diceType: input.match($scope.regexes.diceType)[1],
      hasModifier: modifier,
      modifier: modifier ? input.match($scope.regexes.modifier)[1] : 'null',
      modifiedBy: modifier ? input.match($scope.regexes.modifiedBy)[1] : ''
    };
  };

  $scope.rollSimple = function (faces, count) {
    faces = parseInt(faces, 10);
    count = parseInt(count, 10);
    // Special rolls for d10
    faces = faces === 10 ? _.range(faces) : _.range(1, faces + 1);
    return $scope.choices(faces, count);
  };

  $scope.choices = function (range, times) {
    return _.flatten(_.times(times, function () { return _.sample(range, 1); }));
  };

  $scope.rollHint = function (input) {
    var tokens = $scope.tokenizeInput(input);
    var rollHint = $scope.rollTypes[tokens.rollType].hint;
    var modifierHint = $scope.rollModifiers[tokens.modifier].hint(tokens.modifiedBy);
    var hints = _.compact([rollHint, modifierHint]);
    var hint = $scope.hintText(hints);
    return ['Roll', tokens.diceCount, tokens.diceType, 'sided dice', hint].join(' ');
  };

  $scope.hintText = function (hints) {
    var multipleHints = ['(', hints.join(', '), ')'].join('');
    var hintCount = hints.length;
    var hint = { 0: '',
                 1: '(' + hints[0] + ')' }[hintCount];
    return hint === '' ? hint : multipleHints;
  };

  $scope.validInput = function (input) {
    return $scope.regexes.validInput.test(input);
  };

});
