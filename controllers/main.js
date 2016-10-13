"use strict";
const db = require("../helpers/db");
const userModel = require("../models/user");
const github = require("octonode");

const client = github.client();

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
	// TODO: check for username
	if (!params.followers) {
		return this.throw(400, "You must provide followers to save");
	}
	// check to see if this user already exists
	const userExists = yield userModel.checkUser(params.username);
	if (userExists === false) {
		document = yield userModel.newUser(params.username);
		if (document.error === true) {
			return this.throw(500, document.message);
		}
		document = yield db.saveDocument(document, "githubusers");
	}
	const result = yield userModel.saveFollowers(params.followers, params.username);
	if (result.error === true) {
		return this.throw(400, "Cant save followers");
	}
	return this.body = result;
};

module.exports.getFollowing = function* getFollowing() {
	let document;
	const params = this.request.body;
	// TODO: check for username
	if (!params.following) {
		return this.throw(400, "You must provide followers to save");
	}
	// check to see if this user already exists
	const userExists = yield userModel.checkUser(params.username);
	if (userExists === false) {
		document = yield userModel.newUser(params.username);
		if (document.error === true) {
			return this.throw(500, document.message);
		}
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
	// TODO: check for username
	const document = yield db.getDocument(params.username, "githubusers");
	if (document.error === true) {
		return this.throw(404, "There are no users with this name in the db");
	}
	const followed = document.following;
	const followedBack = document.followers;
	let index;
	for (let i = 0; i < followedBack.length; i++) {
		index = followed.indexOf(followedBack[i]);
		if (index > -1) {
			followed.splice(index, 1);
		}
	}
	const result = yield userModel.notFollowing(followed, params.username);
	return this.body = followed;
};
