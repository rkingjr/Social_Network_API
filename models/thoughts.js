const {schema,model,types} = require('mongoose');
const moment = require('month');

const reactionsSchema = new schema (
    {
        reactionId: {
            type: schema.types.objectId,
            default: () => new types.objectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get:(createdAtValue)=>moment(createdAtValue).format('MMM DD, YYYY [alt] hh:mm a')
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const thoughtSchema = new schema (
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },


        createdAt: {
            type: Date,
            default: Date.now,
            get:(createdAtValue)=>moment(createdAtValue).format('MMM DD, YYYY [at] hh:mm a')
        },

        username: {
            type: String,
            required: true
        },

        reactions: [reactionsSchema]
    },

    {
        toJSON: {
            virtual: true,
            getters: true
        },

        id: false
    }
)

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const thoughts = model('thoughts', thoughtSchema);

module.exports = thoughts;
