const {schema,model} = require('mongoose');

const usersSchema = new schema (
    {
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },

    thoughts: [{
        type: schema.types.objectId,
        ref: 'thoughts'
    }],

    friends: [{
        type: schema.types.objectId,
        ref: 'users'
    }]
    },
    {
    toJSON: {
        virtual: true,
        getters: true,
    },
    id: false
    }
)

usersSchema.virtual('friendCount').get(function() {
    return this.friends.length;
})

const users = model('users', usersSchema);

module.exports = users;
