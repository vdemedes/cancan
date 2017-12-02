<h1 align="center">
	<br>
	<img width="200" src="media/logo.png">
	<br>
	<br>
	<br>
</h1>

[![Build Status](https://travis-ci.org/vadimdemedes/cancan.svg?branch=master)](https://travis-ci.org/vadimdemedes/cancan)

> Authorize easily.

CanCan provides a simple API for handling authorization of actions.
Permissions are defined and validated using simple `allow()` and `can()` functions respectively.

CanCan is inspired by Ryan Bates' [cancan](https://github.com/ryanb/cancan).


## Installation

```
$ npm install --save cancan
```


## Usage

```js
const CanCan = require('cancan');

const cancan = new CanCan();
const {allow, can} = cancan;

class User {}
class Product {}

allow(User, 'view', Product);

const user = new User();
const product = new Product();

can(user, 'view', product);
//=> true

can(user, 'edit', product);
//=> false
```


## API

### allow(model, action, target, [condition])

Adds a new access rule.

#### model

Type: `class` (`function`)

Configure the rule for instances of this class.

#### action

Type: `array|string`

Name(s) of actions to allow.
If action name is `manage`, it allows any action.

#### target

Type: `array|class|string`

Scope this rule to the instances of this class.
If value is `"all"`, rule applies to all models.

#### condition

Type: `object|function`

Optional callback to apply additional checks on both target and action performers.

Examples:

```js
// allow users to view all public posts
allow(User, 'view', Post, {public: true});

// allow users to edit and delete their posts
allow(User, ['edit', 'delete'], Post, (user, post) => post.authorId === user.id);

// allow editors to do anything with all posts
allow(Editor, 'manage', Post);

// allow admins to do anything with everything
allow(AdminUser, 'manage', 'all');
```

### can(instance, action, target[, options])

Checks if the action is possible on `target` by `instance`.

#### instance

Type: `object`

Instance that wants to perform the action.

#### action

Type: `string`

Action name.

#### target

Type: `object`

Target against which the action would be performed.

#### options

Type: `object`

Additional data for the rule condition.

Examples:

```js
const user = new User();
const post = new Post();

can(user, 'view', post);
```

With the use of 'options' parameter
```js
const admin = new User({role: 'administrator'});
const user = new User({role: 'user'});

allow(User, 'update', User, (user, target, options) => {
	if (user.role === 'administrator') {
		return true;
	}
	
	// Don't let regular user update their role
	if (user.role === 'user' && options.fields.includes('role')) {
		return false;
	}
	
	return true;
});

can(admin, 'update', user, {fields: ['role']);
//=> true

can(user, 'update', user, {fields: ['username']);
//=> true

can(user, 'update', user, {fields: ['role']);
//=> false
```


### cannot(instance, action, target[, options])

Inverse of `.can()`.

### authorize(instance, action, target[, options])

Same as `.can()`, but throws an error instead of returning `false`.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)
