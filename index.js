'use strict';

const isObject = require('is-plain-obj');
const autoBind = require('auto-bind');
const arrify = require('arrify');

const get = (obj, key) => typeof obj.get === 'function' ? obj.get(key) : obj[key];

const isPartiallyEqual = (target, obj) => {
	return Object.keys(obj).every(key => get(target, key) === obj[key]);
};

const getConditionFn = condition => {
	return (performer, target) => isPartiallyEqual(target, condition);
};

const defaultInstanceOf = (instance, model) => instance instanceof model;
const defaultCreateError = () => new Error('Authorization error');

class CanCan {
	constructor(options) {
		autoBind(this);

		options = options || {};

		this.abilities = [];
		this.instanceOf = options.instanceOf || defaultInstanceOf;
		this.createError = options.createError || defaultCreateError;
	}

	allow(model, actions, targets, condition) {
		if (typeof condition !== 'undefined' && typeof condition !== 'function' && !isObject(condition)) {
			throw new TypeError(`Expected condition to be object or function, got ${typeof condition}`);
		}

		if (isObject(condition)) {
			condition = getConditionFn(condition);
		}

		arrify(actions).forEach(action => {
			arrify(targets).forEach(target => {
				this.abilities.push({model, action, target, condition});
			});
		});
	}

	can(performer, action, target, options) {
		return this.abilities
			.filter(ability => this.instanceOf(performer, ability.model))
			.filter(ability => {
				return ability.target === 'all' ||
					target === ability.target ||
					this.instanceOf(target, ability.target);
			})
			.filter(ability => {
				return ability.action === 'manage' ||
					action === ability.action;
			})
			.filter(ability => {
				if (ability.condition) {
					return ability.condition(performer, target, options || {});
				}

				return true;
			})
			.length > 0;
	}

	cannot() {
		return !this.can.apply(this, arguments);
	}

	authorize() {
		if (this.cannot.apply(this, arguments)) {
			const err = this.createError.apply(null, arguments);
			throw err;
		}
	}
}

module.exports = CanCan;
