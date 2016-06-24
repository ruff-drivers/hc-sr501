'use strict';

var EventEmitter = require('events');
var Level = require('gpio').Level;
var mock = require('ruff-mock');

var Device = require('../');

require('t');

describe('HC-SR501 Driver', function () {
    var sensor;
    var gpio;

    before(function () {
        gpio = mock(new EventEmitter());
        sensor = new Device({
            gpio: gpio
        });
    });

    afterEach(function (done) {
        setTimeout(function () {
            sensor.removeAllListeners();
            done();
        }, 10);
    });

    describe('Events', function () {
        it('should emit `presence` event', function (done) {
            sensor.once('presence', function () {
                done();
            });

            gpio.emit('interrupt', Level.high);
        });

        it('should emit `absence` event', function (done) {
            sensor.once('absence', function () {
                done();
            });

            gpio.emit('interrupt', Level.low);
        });

        it('should not emit `presence` event continuously', function (done) {
            sensor.on('presence', function () {
                done();
            });

            gpio.emit('interrupt', Level.high);
            gpio.emit('interrupt', Level.high);
        });

        it('should not emit `absence` event continuously', function (done) {
            sensor.on('absence', function () {
                done();
            });

            gpio.emit('interrupt', Level.low);
            gpio.emit('interrupt', Level.low);
        });
    });
});
