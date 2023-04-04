const mongoose = require('mongoose');
const { UserImageSchema } = require('./dbschemes');

const DB_ACCESS = process.env.DB_ACCESS;

class DBConnector {
    constructor() {
        if(mongoose.connection.readyState === 0) {
            this.initDB();
        }
    };

    async initDB() {
        try {
            this.connection = await mongoose.connect(DB_ACCESS, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            console.log('Database successfully connected');
        } catch(e) {
            console.log(e);
        }
    }
}

class DBImageController {
    constructor() {
        new DBConnector;
        this.DBcache = {};
    };

    async getImages({id, isGlobal}) {
        if(this.DBcach && this.DBcach[id] && !isGlobal) {
            return this.DBcache[id];
        }

        if(this.DBcache?.global && isGlobal) {
            return this.DBcache.global;
        }

        const modelName = isGlobal || !id ? 'globals' : id.toString();
        const BotModel = mongoose.model(modelName, UserImageSchema);
        const instance = await BotModel.find();

        if(isGlobal) {
            this.DBcache.global = instance;
        } else {
            this.DBcache[id] = instance;
        }

        return instance;
    }

    async addImage({id, newImage}) {
        const BotModel = mongoose.model(id.toString(), UserImageSchema);
        const BotModelGlobal = mongoose.model('globals', UserImageSchema);

        await BotModel.create(newImage);
        await BotModelGlobal.create(newImage);

        this.clearCache();
    }

    async deleteImage({imageId, userId}) {
        const BotModel = mongoose.model(userId.toString(), UserImageSchema);
        const BotModelGlobal = mongoose.model('globals', UserImageSchema);

        const resultDeleteUser = await BotModel.deleteOne({id: imageId});
        const resultDeleteGlobal = await BotModelGlobal.deleteOne({id: imageId});

        this.clearCache();

        const wasDeleted = resultDeleteGlobal.deletedCount && resultDeleteUser.deletedCount;

        return wasDeleted;
    }
    
    clearCache() {
        this.DBcache = {};
    }
}

const DBInstance = new DBImageController;

module.exports = {
    DBInstance
}
