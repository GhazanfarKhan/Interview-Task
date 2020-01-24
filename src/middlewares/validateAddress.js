const isUri = (url) => {
    const expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    const regex = new RegExp(expression);

    if (url.match(regex)) {
        return true;
    }
    return false;
}
const validateAdresses = (req, res, next) => {
    let response = [];
    if (req.query.address) {
        let urls = req.query.address;
        urls = urls instanceof Array ? urls : [urls];
        urls.forEach(url => {
            let valid = true;
            if (!isUri(url)) {
                valid = false
            }
            else {
                valid = true;
            }
            response.push({ url, valid, pending: true });
        });
        req.data = response;
        next();
    }
    else {
        return res.render('error', { message: 'No address found' });
    }
}
module.exports = validateAdresses;