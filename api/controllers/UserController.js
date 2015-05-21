// Note -- we need a UserController so that blueprints will be activated for User,
// but we don't need any custom User controller code for this app!

module.exports = {
    create: function (req, res, next) {

       // var socket = req.socket;
       // var socketId = sails.sockets.id(socket);
        var socket = sails.io.connect('http://localhost:1337');
        socket.get('/user/testSocket/',req.allParams());

},

    testSocket: function(req,res){
       // var socket = req.socket;
        var socketId = sails.sockets.id(socket);
        User.create({name: req.param('email'),email: req.param('email'), password: req.param('password'), socketId: socketId}).exec(function(err, user) {
            console.log(req.attributes);
            console.log(user);
            // Create the session.users hash if it doesn't exist already
            req.session.users = req.session.users || {};

            // Save this user in the session, indexed by their socket ID.
            // This way we can look the user up by socket ID later.
            req.session.users[socketId] = user;

            // Persist the session
            req.session.save();

            // Send a message to the client with information about the new user
            sails.sockets.emit(socketId, 'hello', user);

            User.watch(socket);

            // User.subscribe(socket, user, 'message');
            // Get updates about rooms being created
            Room.watch(socket);
            // Subscribe the connected socket to custom messages regarding the user.
            // While any socket subscribed to the user will receive messages about the
            // user changing their name or being destroyed, ONLY this particular socket
            // will receive "message" events.  This allows us to send private messages
            // between users.
            //  User.subscribe(socket, user, 'message');

            // Get updates about users being created


            // Publish this user creation event to every socket watching the User model via User.watch()
            User.publishCreate(user, socket);

        });
    }
};