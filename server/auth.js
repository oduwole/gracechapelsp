// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'profileFields': ['id', 'displayName', 'email'],//, 'photos'
        'clientID': '575272359508092', // your App ID
        'clientSecret': '59312176822ad616c546100c56f41ea1', // your App Secret
        'callbackURL': 'http://seekerslocus.com/auth/facebook/callback'
        //'callbackURL': 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth': {
        'consumerKey': 'uGWIJ0cvlJ617nOCJ70ZlPrxr',
        'consumerSecret': 'NiW6kZHJHzZ0IGHSO7z9bB5B0MLsckS9XTNwExNiXiLP9btJiL',
        'callbackURL': 'http://seekerslocus.com/auth/twitter/callback'
        //'callbackURL': 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': '918060741847-43in8mcpl5vnatouu9okbdg3o25u948d.apps.googleusercontent.com',
        'clientSecret': '8if_9lTdl6sroY6KITX09Jj6',
        'callbackURL': 'http://seekerslocus.com/auth/google/callback'
    }

};