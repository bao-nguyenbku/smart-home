const isLoggedIn = () => {
    return (req, res, next) => {
        console.log(req);
        if (req.session.user == null) {
            res.redirect('/login');
        }
        else {
            next();
        }
    }
}
export default isLoggedIn;