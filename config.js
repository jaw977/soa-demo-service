module.exports = {
	messageRouting: {
		user:       {port:10101,  pin:"role:user"},
		listing:    {port:10102,  pin:"role:listing"},
		bid:        {port:10103,  pin:"role:bid"},
		api:        {port:8080,   pin:"cmd:*"},
	},
	messageType: {
		user:"cmd",
		listing:"cmd",
		bid:"cmd",
		api:"api",
	},
	subscribedTo: {
		addUser: [{role:'listing'},{role:'bid'}],
		addListing: [{role:'bid'}],
		addBid: [{role:'listing'}],
	},
};
