const indexControl = {
    async showHome(req, res){
        //res.sendFile(path.join(__dirname, 'public', 'index.html'));
        res.render('index');
    }
}

module.exports = indexControl;