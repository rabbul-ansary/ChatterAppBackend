class AdminController {
    constructor() {}
    /**
     * @Method User Login Controller
     * @param {*} req 
     * @param {*} res 
     */
    async admin(req, res) {
        try {
            res.send('Hello');
        } catch (error) {
            return res.status(500).send({status: 500, message: error.message})
        }
    }
}

module.exports = new AdminController();