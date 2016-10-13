"use strict";
const db = require("../helpers/db");
const userModel = require("../models/user");

const config = require("../config.json");

let user = null;

module.exports.index = function* index() {
	if (this.isAuthenticated()) {
		user = this.session.passport.user;
	}
	yield this.render("index", {
		title: config.site.name,
		user: user,
		script: "index"
	});
};

module.exports.getFollowers = function* getFollowers() {
	let document;

	const params = this.request.body;

	// check to see we were provided followers
	if (!params.followers) {
		return this.throw(400, "You must provide followers to save");
	}
	// check to see we were provided a username
	if (!params.username) {
		return this.throw(400, "You must provide a username");
	}
	// check to see if this user already exists
	const userExists = yield userModel.checkUser(params.username);
	if (userExists === false) {
		// if it doesnt exist make it.
		document = yield userModel.newUser(params.username);
		if (document.error === true) {
			return this.throw(500, document.message);
		}
		// save the user so we can modify it
		document = yield db.saveDocument(document, "githubusers");
	}
	// save followers to the db
	const result = yield userModel.saveFollowers(params.followers, params.username);
	if (result.error === true) {
		return this.throw(400, "Cant save followers");
	}

	return this.body = result;
};

module.exports.getFollowing = function* getFollowing() {
	let document;

	const params = this.request.body;

	// check to see we were provided people being followed
	if (!params.following) {
		return this.throw(400, "You must provide followers to save");
	}
// check to see we were provided a username
	if (!params.username) {
		return this.throw(400, "You must provide a username");
	}
	// check to see if this user already exists
	const userExists = yield userModel.checkUser(params.username);
	if (userExists === false) {
		// if it doesnt exist make it.
		document = yield userModel.newUser(params.username);
		if (document.error === true) {
			return this.throw(500, document.message);
		}
		// save the user so we can modify it
		document = yield db.saveDocument(document, "githubusers");
	}

	const result = yield userModel.saveFollowing(params.following, params.username);
	if (result.error === true) {
		return this.throw(400, "Cant save following");
	}

	return this.body = result;
};

module.exports.compare = function* compare() {
	const params = this.request.body;

	// check to see we were provided a username
	if (!params.username) {
		return this.throw(400, "You must provide a username");
	}
	// get the user from the db
	const document = yield db.getDocument(params.username, "githubusers");
	if (document.error === true) {
		return this.throw(404, "There are no users with this name in the db");
	}
	// assign followers to arrays we can modify
	const followed = document.following;
	const followedBack = document.followers;
	let index;
	// remove people who followed you from the array of people you followed
	for (let i = 0; i < followedBack.length; i++) {
		index = followed.indexOf(followedBack[i]);
		if (index > -1) {
			followed.splice(index, 1);
		}
	}
	// save the people who havent followed you back to the db
	const result = yield userModel.notFollowing(followed, params.username);

	return this.body = followed;
};
