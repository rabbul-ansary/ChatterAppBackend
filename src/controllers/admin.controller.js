class AdminController {
    constructor() {}
    /**
     * @Method User Login Controller
     * @param {*} req 
     * @param {*} res 
     */
    async admin(req, res) {
        try {
            req.io.emit('admin_panel_accessed: ', req.ip_address);
            res.send('Hello, ' + req.ip_address);
        } catch (error) {
            return res.status(500).send({status: 500, message: error.message})
        }
    }
}

module.exports = new AdminController();