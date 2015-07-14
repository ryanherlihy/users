var React = require('react');
var Firebase = require('firebase');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
// var history = require('react-router/lib/BrowserHistory');

var ref = new Firebase("https://user-testing.firebaseio.com/");

var toArray = function(obj) {
	return (Object.keys(obj).map(function(key) {
		obj[key].key = key;
		return obj[key]
	}))
};

var Login = React.createClass({
	handleAddUser: function() {
		var username = React.findDOMNode(this.refs.username).value;
		var password = React.findDOMNode(this.refs.pw).value;
		if(!username || !password) {
			console.log("Enter a name and password.");
		} else {
			this.props.addUser({
				username: username, 
				password: password, 
				score: 0
			});
		}
		React.findDOMNode(this.refs.username).value = '';
		React.findDOMNode(this.refs.pw).value = '';

	},
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<form role="form">
					    <div className="form-group">
					        <label className="small" htmlFor="usr">Name:</label>
					        <input 
					        	ref="username"
					        	type="text" 
					        	className="form-control" 
					        	id="usr" />
					    </div>
					    <div className="form-group">
					        <label className="small" htmlFor="pwd">Password:</label>
					        <input 
					        	ref="pw"
					        	type="password" 
					        	className="form-control" 
					        	id="pwd" />
					    </div>
					    <button 
					    	className="btn btn-primary center-block" 
					    	type="button" 
					    	onClick={this.handleAddUser}>Add User
					    </button>
					</form>
				</div>
			</div>
		)
	}
});

var Users = React.createClass({
	render: function() {
		var styles = {
			remove: {
				cursor: "pointer",
				color: "rgb(222, 79, 79)",
			},
			item: {
				display: "block"
			}
		};
		var userList = this.props.users.map(function(item, index) {
			return (			
				<li 
					className="list-group-item" 
					style={styles.item}
					key={index}>
					<div>
						<UpDown />
						Username: {item.username}, 
						Password: {item.password}
						<button 
							className="glyphicon glyphicon-remove pull-right"
							style={styles.remove}
							onClick={this.props.remove.bind(null, index)} 
						>
						</button>
					</div>
				</li>
			)
		}.bind(this));
		return (
			<div>
				<h2>Users</h2>
				<ul className="list-group">
					{userList}
				</ul>
			</div>
		)
	},

});

var UpDown = React.createClass({
	getInitialState: function() {
		return {
			count: 0
		}
	},
	handleUp: function() {
		this.setState({count: this.state.count + 1})
	},
	handleDown: function() {
		this.setState({count: this.state.count - 1})
	},
	render: function() {
		var styles = {
			up: {
				color: 'blue'
			},
			down: {
				color: 'red'
			},
			upDown: {
				float: "left",
				display: "block"
			}
		};
		return (
			<div style={styles.upDown}>
				<div>
					<span 
						className="glyphicon glyphicon-arrow-up"
						onClick={this.handleUp} 
						style={styles.up} />
				</div>
				<span className="center-block">{this.state.count}</span>
				<div>
					<span 
						className="glyphicon glyphicon-arrow-down" 
						onClick={this.handleDown}
						style={styles.down} />
				</div>
			</div>
		)
	}
});

var App = React.createClass({
	getInitialState: function() {
		return {
			users: []
		}
	},
	componentDidMount: function() {
		this.ref = ref.child("users");
		this.ref.on('value', this.handleStateUpdate);

	},
	handleStateUpdate: function(snapshot) {
		if(snapshot.val()) {
			this.setState({users: toArray(snapshot.val())})
		} else {
			this.setState({users: []})
		}
	},
	addUser: function(newUser) {
		this.ref.push(newUser)
	},
	removeUser: function(index) {
		var key = this.state.users[index].key;
		this.ref.child(key).remove();
	},
	render: function() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-sm-6 col-sm-push-3">
						<Login 
							users={this.state.users} 
							addUser={this.addUser} />
						<Users 
							users={this.state.users}
							remove={this.removeUser} />
					</div>
				</div>
			</div>
		);
	}
});

var Test = React.createClass({
	render: function() {
		return (
			<div>
				<h2>Test</h2>
			</div>
		)
	}
})

React.render(<App />, document.getElementById('app'));