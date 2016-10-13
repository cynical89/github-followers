const db = require("../helpers/db");

module.exports = {
	newUser: function newUser(username) {
		const user = {
			error: false,
			id: username,
			followers: [],
			following: [],
			notFollowingYou: []
		};
		return user;
	},
	checkUser: function* checkUser(username) {
		const document = yield db.getDocument(username, "githubusers");
		if (document.error === true) {
			// they don't exist
			return false;
		}
		// they do exist
		return true;
	},

	saveFollowers: function* saveFollowers(followers, username) {
		const document = yield db.getDocument(username, "githubusers");
		if (document.error === true) {
			return document;
		}
		document.followers = followers;
		const savedDoc = yield db.saveDocument(document, "githubusers");
		return savedDoc;
	},
	saveFollowing: function* saveFollowing(following, username) {
		const document = yield db.getDocument(username, "githubusers");
		if (document.error === true) {
			return document;
		}
		document.following = following;
		const savedDoc = yield db.saveDocument(document, "githubusers");
		return savedDoc;
	},
	notFollowing: function* notFollowing(notfollowingyou, username) {
		const document = yield db.getDocument(username, "githubusers");
		if (document.error === true) {
			return document;
		}
		document.notFollowingYou = notfollowingyou;
		const savedDoc = yield db.saveDocument(document, "githubusers");
		return savedDoc;
	}
};
