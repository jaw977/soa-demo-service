const seneca = require('seneca');
const config = require('./config.js');

class Service {
	constructor(name) {
		this.seneca = seneca();
		this.name = name;
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
		const subs = config.subscribedTo[event];
		if (! subs) return;
		for (let sub of subs) {
			this.seneca.act({role:sub.role, _cmd:event}, info);
		}
	}
	
	clients(type) {
		for (let t in config.messageRouting) {
			if (t != this.name && (! type || config.messageType[t] == type)) this.seneca.client(config.messageRouting[t]);
		}
	}
	
	listen() {
		for (let t in config.messageRouting) {
			if (t == this.name) this.seneca.listen(config.messageRouting[t]);
		}
	}
}

module.exports = Service;
