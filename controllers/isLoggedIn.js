const isLoggedIn = () => {
    return (req, res, next) => {
        if (req.session.user == undefined) {
            res.redirect('/login');
        }
        else {
            next();
        }
    }
}
export default isLoggedIn;