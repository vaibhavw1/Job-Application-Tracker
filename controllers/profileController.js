const { where } = require('sequelize');
const fs = require('fs');
const AWS = require('aws-sdk');

const Profile = require('../models/profile');
const User = require('../models/profile');


exports.addProfile = async (req, res, next) => {

    try {
        const userId = req.user.userId;
        const name = req.body.name;
        
        const goals = req.body.goals;


        const file = req.file;

        const fileContent = fs.readFileSync(file.path);


        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_S3_REGION
        });

        const bucketName = 'jobapplicationtracker';

        const params = {
            Bucket: bucketName,
            Key: `profile/${file.filename}`,
            Body: fileContent
            // ContentType: 'text/html'
        };


        s3.upload(params, async (err, uploadData) => {
            if (err) {
                console.error("Error uploading data: ", err);
                return res.status(500).json({ error: err, success: false, message: 'Something went wrong' });
            }


            const [created,isCreated] = await Profile.upsert({
                name: name,
                resumeLink: uploadData.Location,
                carrerGoals: goals,
                userId: userId

            },{
                returning: true
            });






            fs.unlinkSync(file.path);

            if(isCreated){

                res.status(201).json({ message: "Profile created", success: true });
            }else{
                res.status(201).json({ message: "Profile updated", success: true });
            }

        });

    } catch (error) {
        if (error.toString() === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(403).json({ message: "Profile already exists! Please add a profile with different name", success: false });
            return;
        }

        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }


}

exports.deleteProfile = async (req, res, next) => {

    try {
        const userId = req.user.userId;
        const name = req.query.name;
        await Profile.destroy({
            where: {
                userId: userId,
                name: name
            }
        });

        res.status(200).json({ success: true, message: "Delete Profile" });

    } catch (error) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }

}




exports.getProfiles = async (req, res, next) => {

    try {
        const userId = req.user.userId;
        const profiles = await Profile.findAll({
            where: {
                userId: userId
            }
        });

        res.status(200).json({ message: "Profiles fetched", success: true, profiles: profiles });



    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }

}