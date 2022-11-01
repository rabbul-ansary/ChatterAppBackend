const userModel = require('../models/user.model');

class UserController {
    constructor() { }

    /**
     * @Method User registerPage Controller
     * @param {*} req 
     * @param {*} res 
     */
    async registerPage(req, res) {
        try {
            res.send(`
            <form action="register" method="post" enctype="multipart/form-data">
            <label for="fname">First name:</label><br>
            <input type="text" id="fname" name="username" value="John"><br>
            <label for="lname">Last name:</label><br>
            <input type="text" id="lname" name="password" value="Doe"><br><br>
            <input type="submit" value="Submit">
            </form> 
            `);
        } catch (error) {
            return res.status(500).send({ status: 500, message: error.message })
        }
    }


    /**
     * @Method User registerPage Controller
     * @param {*} req 
     * @param {*} res 
     */
    async register(req, res) {
        try {
            if (!req.body.username || !req.body.password) {
                return res.status(400).send({ status: 400, message: "Username and password are required!" });
            }
            let user = await User.create({ username: req.body.username, password: req.body.password });
            if (!user) {
                return null;
            }
            return res.status(200).send({ status: 200, message: "User registered successfully.", data: user });
        } catch (error) {
            return res.status(500).send({ status: 500, message: error.message })
        }
    }
}

module.exports = new UserController();