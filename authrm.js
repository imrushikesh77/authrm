const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Default values of token expiry and secret
let tokenExpiry = '1h';
let tokenSecret = 'myTokenSecret@123';

// Default value of user model
let user = null;


// Function to set the user model, token secret and token expiry
const config = (newUser, newTokenSecret, newTokenExpiry) => {
    user = newUser;
    tokenExpiry = newTokenExpiry;
    tokenSecret = newTokenSecret;
}


// Function to create and sign a token
const createAndSignToken = (userData) => {
    return jwt.sign(
        { username: userData.username, email: userData.email },
        tokenSecret,
        { expiresIn: tokenExpiry}
    );
};

// Sign in function
const signIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            return { 
                status: 400,
                error: 'User does not exist' 
            };
        }

        // Check if password is correct
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return { 
                status: 400,
                error: 'Invalid credentials' 
            };
        }

        // Create and sign token
        const token = createAndSignToken(existingUser);

        // Return user and token
        return {
            status: 200,
            user: existingUser,
            message: 'User signed in successfully',
            token
        };
    } catch (error) {
        return { 
            status: 500,
            error: error.message };
    }
}

// Sign up function
const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    let newUser = null;
    try {
        // Check if username or email already exists
        const usernameExists = await user.findOne({ username });
        const emailExists = await user.findOne({ email });

        // Return error if username already exists
        if (usernameExists) {
            return {
                status: 400,
                error: 'Username already exists'
            }
        }

        // Return error if email already exists
        if (emailExists) {
            return {
                status: 400,
                error: 'Email already exists'
            }
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser = new user({ username, email, password: hashedPassword });
        await newUser.save();

        const token = createAndSignToken(newUser);

        // Return user and token
        return {
            status: 200,
            user: newUser,
            message: 'User created successfully',
            token
        };
    } catch (error) {
        // Remove user if an error occurs
        if (newUser) {
            await newUser.remove();
        }
        return { 
            status: 500,
            error: error.message 
        };
    }
}


const signOut = (req, res, tokenName) => {
    try {
        // Clear cookie
        res.clearCookie(tokenName, { httpOnly: true })
        return{ 
            status: 200,
            message: 'User signed out successfully' 
        };
    } catch (error) {
        return{ 
            status: 500,
            error: error.message
        };
    }
}


const changePassword = async (req, res) => { 
    const { email, currentPassword, password } = req.body;
    try {
        // Check if user exists
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return { 
                status: 400,
                error: 'User does not exist' 
            };
        }

        // Check if current password is correct
        const passwordMatch = await bcrypt.compare(currentPassword, existingUser.password);
        if (!passwordMatch) {
            return { 
                status: 400,
                error: 'Invalid current password' 
            };
        }

        // Hash and save new password
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();

        // Return user
        return { 
            status: 200,
            user: existingUser,
            message: 'Password changed successfully'
        };
    }
    catch (error) {
        return { 
            status: 500,
            error: error.message 
        };
    }
}



module.exports = {
    config,
    signIn,
    signUp,
    signOut,
    changePassword
}