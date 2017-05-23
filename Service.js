const seneca = require('seneca');
const jsonic = require('jsonic');

class Service {
	constructor(name) {
		this.seneca = seneca();
		this.name = name;
		this.env = process.env;
		this.addrFor = {};
		
		for (let client of jsonic(this.env.CLIENTS)) {
			var addr = this.env[client + ".ADDR"];
			if (addr.match(/\D/)) addr = {host:addr, port:80};
			else addr = {port:addr};
			this.addrFor[client] = addr;
		}
	}
	
	add(pattern, action) {
		const seneca = this.seneca;
		this.seneca.add(pattern, async(msg, reply) => {
			try {
				const response = await action(msg,{service:this,seneca});
				reply(null, response);
			} catch(error) {
				reply(error);
			}
		});
	}
	
	publish(event, info) {
		const subs = jsonic(this.env.SUBSCRIPTIONS)[event];
		if (! subs) return;
		for (let sub of subs) {
			this.seneca.act({role:sub, _cmd:event}, info);
		}
	}
	
	clients() {
		for (let client of jsonic(this.env.CLIENTS)) {
			if (client == this.name) continue;
			const params = Object.assign({pin:this.pin(client)}, this.addrFor[client]);
			this.seneca.client(params);
		}
	}
	
	listen() {
		this.seneca.listen({
			port:this.env.PORT || this.addrFor[this.name].port, 
			pin:this.pin()
		});
	}
	
	pin(client) {
		const name = client || this.name;
		return this.env[name + ".PIN"] || "role:" + name;
	}
}

module.exports = Service;
