const Place = require('../models/place');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');



// list of COOL places page
module.exports.index = async (req, res) => {
    const places = await Place.find({});
    res.render('places/index', { places });
};



// add cool place page
module.exports.newPlace = (req, res) => {
    res.render('places/new');
};



// post a COOL place
module.exports.createPlace = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
            query: req.body.place.location,
            limit: 1
    }).send();
    const place = new Place(req.body.place);
    place.geometry = geoData.body.features[0].geometry;
    place.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    place.author = req.user._id;
    await place.save();
    console.log(place);
    req.flash('success', 'Successfully created ' + req.body.place.title + '!');
    res.redirect(`/coolplaces/${place._id}`);
};



// see the details of a COOL place
module.exports.showPlace = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.id).populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        }).populate('author');
        
        console.log(place);
        res.render('places/details', { place });
    } catch (error) {
        req.flash('error', 'Place Not Found!');
        return res.redirect('/coolplaces');
    }
};



// edit page
module.exports.editPlace = async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(req.params.id);
    if (!place) {
        req.flash('error', 'Place Not Found!');
        return res.redirect('/coolplaces');
    }
    res.render('places/edit', { place });
};



// update a COOL place
module.exports.updatePlace = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.place.location,
        limit: 1
    }).send();
    const place = await Place.findByIdAndUpdate(id,{ ...req.body.place});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    place.image.push(...imgs);
    place.geometry = geoData.body.features[0].geometry;
    await place.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await place.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages }}}});
    }
    req.flash('success', 'Successfully updated ' + req.body.place.title + '!');
    res.redirect(`/coolplaces/${place._id}`);
};



// delete a COOL place
module.exports.deletePlace = async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a COOL place ):');
    res.redirect('/coolplaces');
};