var mongoose = require('mongoose');
var mysql = require('mysql');
var config = require('config');

mongoose.connect(config.get('MongoDB.connectionString'), function(err, res) {
    if (err) {
	console.log('Error connecting to localhost/contactdb');
	return;
	} else
	    console.log('Connected to localhost/contactdb');
});


var contactPersonSchema = new mongoose.Schema({
    contactId: Number,
    firstName: String,	
    lastName: String,	
    email: String,	
    phone: String,	
    imagePath: String
});

var contactPerson = mongoose.model('contactPerson', contactPersonSchema, 'contactPerson');

var connection = mysql.createConnection(config.get('MySQL'));

connection.connect();


function readMySQLContactPerson() {
    connection.query('SELECT * FROM contact_person', 
	function(err, rows) {
	    if (err) {
		console.log('Error reading MySQL database');
		return;
	    }
	
	    for (var i = 0; i < rows.length; i++) {
		saveMongoDBContactPerson(rows[i]);
	    }

	});
}


function saveMongoDBContactPerson(contact) {
    var newContact = new contactPerson({
	contactId: contact.contactId,
	firstName: contact.firstName,
	lastName: contact.lastName,
	email: contact.email,
	phone: contact.phone,
	imagePath: contact.imagePath
    });

    newContact.save(function(err) {
	if (err) {
	    console.log('Error adding record to MongoDB');
	    return;
	}

	console.log(JSON.stringify(newContact,"",2));
    }); 
}

readMySQLContactPerson();

