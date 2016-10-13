var apiURL = "https://api.github.com/users/";

var followerCount = 1;
var followerURL = "/followers?per_page=100";
var followers =[];

var followingCount = 1;
var followingURL = "/following?per_page=100";
var following =[];

var fullURL;
var username;


$("#getFollowers").on("click", function(e) {
	username = $("#username").val();
	if (followerCount === 1) {
		fullURL = `${apiURL}${username}${followerURL}`
	}
	e.preventDefault();
	$.ajax({
		type: "GET",
		dataType: "json",
		url: fullURL
	}).done(function result(result) {
		if (result.error === true) {
			console.error(result.message);
		}
		followerCount++;
		var contURL = `${apiURL}${username}${followerURL}&page=${followerCount}`;
		fullURL = contURL;
		for (var follower of result) {
			followers.push(follower.login);
		}
		if(result.length === 100) {
			$("#getFollowers").trigger("click");
		} else {
			$("#saveFollowers").trigger("call");
			followerCount = 1;
		}
		$("#followers").append(JSON.stringify(followers));
	}).fail(function error(err) {
		// do something with the failure, like laugh at the user
		console.error(err);
	});
})

	$("#saveFollowers").on("call", function(e) {
		username = $("#username").val();
		e.preventDefault();
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/followers",
			data: {followers: followers, username: username}
		}).done(function result(result) {
			if (result.error === true) {
				console.error(result.message);
			}
			console.log(result);
		}).fail(function error(err) {
			// do something with the failure, like laugh at the user
			console.error(err);
		});
})

$("#getFollowing").on("click", function(e) {
	username = $("#username").val();
	if (followingCount === 1) {
		fullURL = `${apiURL}${username}${followingURL}`
	}
	e.preventDefault();
	$.ajax({
		type: "GET",
		dataType: "json",
		url: fullURL
	}).done(function result(result) {
		if (result.error === true) {
			console.error(result.message);
		}
		followingCount++;
		var contURL = `${apiURL}${username}${followingURL}&page=${followingCount}`;
		fullURL = contURL;
		for (var follower of result) {
			following.push(follower.login);
		}
		if(result.length === 100) {
			$("#getFollowing").trigger("click");
		} else {
			$("#saveFollowing").trigger("call");
			followingCount = 1;
		}
		$("#following").append(JSON.stringify(followers));
	}).fail(function error(err) {
		// do something with the failure, like laugh at the user
		console.error(err);
	});
})

	$("#saveFollowing").on("call", function(e) {
		username = $("#username").val();
		e.preventDefault();
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/following",
			data: {following: following, username: username}
		}).done(function result(result) {
			if (result.error === true) {
				console.error(result.message);
			}
			console.log(result);
		}).fail(function error(err) {
			// do something with the failure, like laugh at the user
			console.error(err);
		});
})

	$("#getCompare").on("click", function(e) {
		username = $("#username").val();
		e.preventDefault();
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/compare",
			data: {username: username}
		}).done(function result(result) {
			if (result.error === true) {
				console.error(result.message);
			}
			console.log(result);
			$("#compare").append(JSON.stringify(result));
		}).fail(function error(err) {
			// do something with the failure, like laugh at the user
			console.error(err);
		});
})
