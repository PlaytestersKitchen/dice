'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('diceApp'));

  var MainCtrl;
  var scope;
  var rollTypes = ['D', 'H', 'L', 'I', 'U', 'N'];
  var rollModifiers = ['Z', 'R', 'E'];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should make a single choice from one die', function () {
    expect(scope.choices([1], 1)).to.eql([1]);
  });

  it('should make multiple choices from multiple dice', function () {
    expect(scope.choices([1], 2)).to.eql([1, 1]);
  });

  describe('rollType', function () {

    rollTypes.forEach(function (rollType) {

      describe(rollType, function () {
        var roll;

        before(function () {
          roll = scope.rollTypes[rollType].fn(3, 3);
        });

        it('should have a hint', function () {
          if (['D'].indexOf(rollType) > -1) {
            expect(scope.rollTypes[rollType].hint).to.equal('');
          } else {
            expect(scope.rollTypes[rollType].hint).to.not.be.empty;
          }
        });

        it('should have the correct number of dice in the result', function () {
          if (['H', 'L'].indexOf(rollType) > -1) {
            expect(roll.length).to.equal(1);
          } else if (['I'].indexOf(rollType) > -1) {
            expect(roll.length).to.equal(2);
          } else {
            expect(roll.length).to.equal(3);
          }
        });

        it('should the correct number on the face of the result', function () {
          if (rollType === 'U') {
            expect(roll[0]).to.be.at.least(-1);
          } else {
            expect(roll[0]).to.be.at.least(1);
          }
        });
      });
    });

    describe('N (unique rolls)', function () {

      it('should return all faces if count is greater than faces', function () {
        expect(scope.rollTypes.N.fn(3, 4)).to.eql([1, 2, 3]);
      });
    });

  });

  describe('regular expressions', function () {

    it('should properly build robust regexes', function () {
      expect(scope.upperLowerRegex(['A', 'B', 'C'])).to.eql('[ABCabc]');
    });

  });

  describe('tokenization', function () {

    it('should tokenize one die', function () {

    });

    it('should tokenize ten dice', function () {

    });

    rollTypes.forEach(function (rollType) {

      it('should tokenize properly for ' + rollType, function () {

      });

    });

  });

  describe('roll modifier', function () {

    rollModifiers.forEach(function (rollModifier) {

      describe('hints', function () {

        it(rollModifier + ' should have a hint', function () {
          expect(scope.rollModifiers[rollModifier].hint).to.not.be.empty;
        });

      });

      rollTypes.forEach(function (rollType) {

        describe(rollModifier + ' with ' + rollType, function () {
          var roll;

          before(function () {
            roll = scope.rollTypes[rollType].fn(3, 3);
          });


        });

      }

    });

  });

  describe('roll hints', function () {

  });

  describe('rolling', function () {

  });

});
