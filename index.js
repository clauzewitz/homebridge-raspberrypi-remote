'use strict';

const exec = require('child_process').exec;
const version = require('./package.json').version;
let Service;
let Characteristic;
let logger;

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory('homebridge-raspberrypi', 'RespberryPi', RespberryPi);
}

function initCustomService() {
	/**
	 * Service "RaspberryPi" Based on Service.ServiceLabel
	 */
	let raspberryPiUUID = '000000B9-0000-1000-8000-0026BB765291';
	Service.RespberryPi = function (displayName, subType) {
		Service.call(this, displayName, raspberryPiUUID, subType);

		// Required Characteristics
		this.addCharacteristic(Characteristic.ServiceLabelNamespace);
		this.addCharacteristic(Characteristic.ServiceLabelNamespace);
		this.addCharacteristic(Characteristic.ServiceLabelNamespace);

		// Optional Characteristics
		this.addOptionalCharacteristic(Characteristic.Name);
	}

	inherits(Service.RespberryPi, Service);
	Service.RespberryPi.UUID = raspberryPiUUID;
}

function RespberryPi(log, config) {
	logger = log;

	this.services = [];
	this.name = config.name || 'RespberryPi';
	this.os = config.os || 'linux';
	this.interval = Number(config.interval) || 600000;
	this.showCpuUsage = config.showCpuUsage || false;
	this.showMemoryUsage = config.showMemoryUsage || false;
	this.showTemperature = config.showTemperature || false;
	this.sensorState = undefined;
	this.cpuUsage = undefined;
	this.memoryUsage = undefined;
	this.temperature = undefined;

	this.buttonGroup = [
		{
			code: 0,
			value: 'Reboot'
		},
		{
			code: 1,
			value: 'Shutdown'
		}
	];

	initCustomService();

	this.service = new Service.RespberryPi(this.name);
	this.serviceInfo = new Service.AccessoryInformation();

	this.serviceInfo
		.setCharacteristic(Characteristic.Manufacturer, 'Clauzewitz')
		.setCharacteristic(Characteristic.Model, 'RespberryPi')
		.setCharacteristic(Characteristic.SerialNumber, this.mac.toUpperCase())
		.setCharacteristic(Characteristic.FirmwareRevision, version);

	for (var button in buttonGroup) {

	}

	this.services.push(this.service);
	this.services.push(this.serviceInfo);

	if (this.showCpuUsage) {
		this.temperatureSensorService = new Service.TemperatureSensor('Temperature');
	
		this.temperatureSensorService
			.getCharacteristic(Characteristic.CurrentTemperature)
			.on('get', this.getTemperature.bind(this));

		this.services.push(this.temperatureSensorService);
	}

	if (this.showMemoryUsage) {
		this.temperatureSensorService = new Service.TemperatureSensor('Temperature');
	
		this.temperatureSensorService
			.getCharacteristic(Characteristic.CurrentTemperature)
			.on('get', this.getTemperature.bind(this));

		this.services.push(this.temperatureSensorService);
	}

	if (this.showTemperature) {
		this.temperatureSensorService = new Service.TemperatureSensor('Temperature');
	
		this.temperatureSensorService
			.getCharacteristic(Characteristic.CurrentTemperature)
			.on('get', this.getTemperature.bind(this));

		this.services.push(this.temperatureSensorService);
	}

	this.discover();
}

RespberryPi.prototype = {
	discover: function () {
		setInterval(function () {
			this.updateCpuUsage.bind(this);
			this.updateMemoryUsage.bind(this);
			this.updateTemperature.bind(this);
		}, this.interval);
	},

	getCpuUsage: function (callback) {
		logger.debug('getCpuUsage: %s', this.cpuUsage);

		callback(null, this.cpuUsage);
	},

	updateCpuUsage: function () {
		if (!this.showCpuUsage) {
			return;
		}

		const that = this;

		exec('', function (error, stdout, stderr) {
			if (error) {
				logger(error);
			} else {
				that.cpuUsage = Number('0');
				
				logger.debug('updateCpuUsage: %s', that.cpuUsage);
			}
		});
	},

	getMemoryUsage: function (callback) {
		logger.debug('getMemoryUsage: %s', this.memoryUsage);

		callback(null, this.memoryUsage);
	},

	updateMemoryUsage: function () {
		if (!this.showMemoryUsage) {
			return;
		}

		const that = this;

		exec('', function (error, stdout, stderr) {
			if (error) {
				logger(error);
			} else {
				that.memoryUsage = Number('0');
				
				logger.debug('updateMemoryUsage: %s', that.memoryUsage);
			}
		});
	},

	getTemperature: function (callback) {
		logger.debug('getTemperature: %s', this.temperature);

		callback(null, this.temperature);
	},

	updateTemperature: function () {
		if (!this.showTemperature) {
			return;
		}

		const that = this;

		exec('', function (error, stdout, stderr) {
			if (error) {
				logger(error);
			} else {
				let temp = stdout.match(/temp=([^']*)'([^$]*)$/);
				that.temperature = Number(temp[1]);
				
				logger.debug('updateTemperature: %s', that.temperature);

				that.service.getCharacteristic(Characteristic.CurrentTemperature)
					.setProps({
						unit: (temp[2] === 'C') ? Characteristic.Units.CELSIUS : Characteristic.Units.FAHRENHEIT
					})
					.updateValue(that.temperature);
			}
		});
	},

	identify: function (callback) {
		callback();
	},

	getServices: function () {
		return this.services;
	}
};
