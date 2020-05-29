module.exports = {
    eAdmin: function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        req.flash('error_msg', 'Você deve estar autenticado');
        res.redirect('/');
    }
}