const isLoggedIn = () => {
    return (req, res, next) => {
        console.log(req.session.user);
        if (req.session.user == undefined) {
            res.redirect('/login');
        }
        else {
            next();
        }
    }
}
export default isLoggedIn;