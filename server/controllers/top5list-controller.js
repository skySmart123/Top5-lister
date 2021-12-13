const Top5List = require('../models/top5list-model');
const User = require('../models/user-model')
const mongoose = require('mongoose')

const createTop5List = (req, res, next) => {
    const body = req.body;
    // console.log(body)
    if (!body) {
        return res.badRequest({
            message: 'You must provide a Top 5 List',
        })
    }

    const top5List = new Top5List(body);
    if (!top5List) {
        return res.badRequest({
            message: "provide name and items fields"
        })
    }

    top5List.user = req.userId;

    top5List
        .save()
        .then(() => {
            return res.success({
                data: {
                    top5List,
                },
                message: 'Top 5 List Created!'
            })
        })
        .catch(error => {
            return res.error({
                // message: 'Top 5 List Not Created!'
                message: error.message,
            })
        })
}

const saveTop5List = async (req, res) => {
    const body = req.body
    console.log("saveTop5List: " + JSON.stringify(body));

    if (!(body && body.name && body.items && Array.isArray(body.items) && body.items.some(item => !!item))) {
        return res.badRequest({
            message: 'You must provide a title and at least one non-empty item',
        })
    }

    Top5List.findOneAndUpdate({
        _id: req.params.id,

        "$and": [
            {
                user: req.userId,
            },
            {
                published: false,
            }
        ]
    }, {
        name: body.name,
        items: body.items,
    }, {
        useFindAndModify: false,
    }).then((result) => {
        // console.log("SUCCESS!!!");
        // console.log(result)

        if (result) {
            return res.success({
                message: 'Top 5 List updated!',
                // data: result
            })
        } else {
            // result is null if not find
            return res.error({
                message: 'Top 5 List not updated!'
            })
        }
    }).catch(err => {
        return res.error({
            message: err.message,
        })
    })
}

const likeOrDislikeTop5List = async (req, res) => {
    const body = req.body
    // console.log("vote on Top5List: " + JSON.stringify(body));

    if (!(body && ['dislike', 'like'].includes(body.type))) {
        return res.error({
            error: 'Like or Dislike?',
        })
    }

    const id = req.params.id;
    const type = body.type

    const userId = req.userId;

    Top5List.findById(id)
        .then((list) => {
            // console.log(list)
            // console.log(list.ups)
            // console.log(list.downs)

            switch (type) {
                case 'like':
                    if (list.downs.includes(userId)) {
                        list.downs.splice(list.downs.indexOf(userId), 1)
                    }
                    if (list.ups.includes(userId)) {
                        list.ups.splice(list.ups.indexOf(userId), 1)
                    } else {
                        list.ups.push(userId)
                    }
                    break;
                case 'dislike':
                    if (list.ups.includes(userId)) {
                        list.ups.splice(list.ups.indexOf(userId), 1)
                    }
                    if (list.downs.includes(userId)) {
                        list.downs.splice(list.downs.indexOf(userId), 1)
                    } else {
                        list.downs.push(userId)
                    }
                    break;
                default:
                    break;
            }

            list.save()
                .then(() => {
                    // console.log("SUCCESS!!!");

                    return res.success({
                        message: 'Top 5 List vote updated!',
                        // data: {
                        //     id
                        // },
                    })
                })
                .catch(error => {
                    console.log(error)

                    return res.error({
                        // message: 'Top 5 List vote not updated!',
                        message: error.message,
                    })
                })
        })
        .catch(error => {
            // console.log("FAILURE: " + JSON.stringify(error));

            return res.error({
                // message: 'Top 5 List views not updated!',
                message: error.message,
            })
        })
}

const increaseViewsTop5List = async (req, res) => {
    const id = req.params.id;

    Top5List.findByIdAndUpdate(id, {
        $inc: {
            views: 1
        }
    })
        .then(() => {
            // console.log("SUCCESS!!!");

            return res.success({
                message: 'Top 5 List views updated!',
                // data: {
                //     id
                // },
            })
        })
        .catch(error => {
            // console.log("FAILURE: " + JSON.stringify(error));

            return res.error({
                // message: 'Top 5 List views not updated!',
                message: error.message,
            })
        })
}

const commentOnTop5ListById = async (req, res) => {
    const body = req.body
    // console.log("saveTop5List: " + JSON.stringify(body));

    if (!(body && body.comment)) {
        return res.badRequest({
            message: 'You must provide a comment',
        })
    }

    const id = req.params.id;

    Top5List.findOneAndUpdate({
        _id: id,

        "$and": [
            {
                // can only comment on published list
                published: true,
            }
            // {
            //     "$or": [
            //         {
            //             community: false,
            //             published: true,
            //         },
            //         {
            //             community: true,
            //             published: false,
            //         }
            //     ]
            // }
        ]
    }, {
        $push: {
            comments: {
                text: body.comment,
                user: req.userId,
            }
        }
    })
        .then((result) => {
            // console.log(result)

            if (result) {
                // console.log("SUCCESS!!!");

                return res.success({
                    message: 'Top 5 List comments updated!',
                    // data: {
                    //     id,
                    // }
                })
            } else {
                // null

                return res.error({
                    message: 'Top 5 List comments not updated: list published with this id not found.',
                    // data: {
                    //     id
                    // },
                })
            }
        })
        .catch(error => {
            // console.log("FAILURE: " + JSON.stringify(error));

            return res.error({
                // message: 'Top 5 List comments not updated!',
                message: error.message,
            })
        })
}

const publishTop5ListById = async (req, res) => {
    const body = req.body
    console.log("publishTop5List: " + JSON.stringify(body));

    // if (!(body && body.name && body.items && Array.isArray(body.items) && body.items.some(item => !!item))) {
    if (!(body
        && body.name && body.name.trim()
        && body.items
        && Array.isArray(body.items)
        && body.items.length === 5
    )) {
        return res.badRequest({
            message: 'You must provide a name and five items',
        })
    }

    // trim
    let name = body.name.trim();
    let items = body.items.map(item => item.trim());

    if (!(
        items.every(item => !!item)
        && ((new Set(items.map(item => item.toLowerCase()))).size === items.length)
    )) {
        return res.badRequest({
            message: 'You must provide five different (case-insensitive) non-empty items',
        })
    }

    Top5List.findOne({
        _id: req.params.id
    }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.error({
                // message: 'Top 5 List not found!',
                message: err.message,
            })
        }

        if (!top5List.user.equals(req.userId)) {
            return res.unauthorized({
                message: 'Not having the necessary permission!',
            })
        }

        if (top5List.published) {
            return res.forbidden({
                message: 'Can not edit published list!',
            })
        }

        top5List.name = name
        top5List.items = items
        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!");

                // check if this list can be published
                // case-insensitive: All item tallying and list naming should ignore case
                Top5List.countDocuments({
                    community: false,

                    user: req.userId,
                    published: true,
                    name: {$regex: new RegExp("^" + body.name.toLowerCase() + "$", "i")}
                })
                    .then(count => {
                        // console.log('duplicate:', count)

                        if (count === 0) {
                            top5List.published = true;
                            top5List.publishedAt = Date.now();
                            top5List.save()
                                .then(async (data) => {

                                    // aggregate community list
                                    await aggregate(name);

                                    return res.success({
                                        message: 'Top 5 List published!',
                                    })

                                }).catch((error) => {
                                // console.error(error)
                                return res.error({
                                    message: 'Top 5 List updated but not published, no duplicate list name found but still publish failed!',
                                    // message: error.message,
                                })
                            })
                        } else {
                            return res.error({
                                message: 'Top 5 List updated but not published, you have already published a list with that name!',
                            })
                        }
                    })
                    .catch((error) => {
                        // console.error(error)
                        return res.error({
                            // message: 'Top 5 List updated but not published!',
                            message: error.message,
                        })
                    })

            })
            .catch(error => {
                // console.log("FAILURE: " + JSON.stringify(error));
                return res.error({
                    // message: 'Top 5 List not updated!',
                    message: error.message,
                })
            })
    })
}

const aggregate = async (name) => {
    try {
        const regexp = new RegExp("^" + name.toLowerCase() + "$", "i");

        const result = await Top5List.find({
            community: false,

            published: true,
            name: {$regex: regexp},
        }).select('items');

        console.log('all: ', result)

        if (result && result.length > 0) {
            console.log('all: ', result.length)

            const agg = result.map(list => list.items).reduce((obj, items) => {
                items.forEach((item, index) => {
                    const lower = item.toLowerCase()
                    if (!(lower in obj)) {
                        obj[lower] = {
                            item,
                            count: 0,
                            score: 0,
                        }
                    }
                    const o = obj[lower];
                    obj[lower] = {
                        ...o,
                        count: o.count + 1,
                        score: o.score + (5 - index)
                    }
                })
                return obj
            }, {})
            console.log(agg)
            const keys = Object.keys(agg)
            console.log(keys)
            keys.sort((left, right) => {
                return agg[right].score - agg[left].score;
            })
            console.log(keys)
            const r = keys.slice(0, 5).map(key => ({
                item: agg[key].item,
                score: agg[key].score,
            }))
            console.log(r)

            const filter = {
                community: true,

                published: true,

                name: {$regex: regexp},
            };
            const update = {
                name: name,

                publishedAt: Date.now(),

                items: r.map(rr => rr.item),
                votes: r.map(rr => rr.score),
            };

            const c = await Top5List.countDocuments(filter); // 0
            console.log("count community:" + c);

            // https://mongoosejs.com/docs/tutorials/findoneandupdate.html#upsert
            let doc = await Top5List.findOneAndUpdate(filter, update, {
                useFindAndModify: false,

                new: true,
                upsert: true // Make this update into an upsert
            });
            console.log(doc)
            // console.log(doc.name)
            // console.log(doc.items)
            // console.log(doc.votes)
        } else {
            // delete community lists
            console.log('delete community')

            const re = await Top5List.findOneAndDelete({
                community: true,
                published: true,
                name: {$regex: regexp},
            });
            console.log(re)
        }

    } catch (error) {
        console.log(error)
    }
}

const deleteTop5List = async (req, res) => {
    Top5List.findOneAndDelete({
        _id: req.params.id,

        "$and": [
            {
                user: req.userId,
            }
        ]
    }).then(async (result) => {
        // console.log('delete')
        // console.log(result)
        if (result) {
            if (result.published) {
                await aggregate(result.name)
            }

            return res.success({
                message: 'Delete success',
            })
        } else {
            return res.error({
                message: 'Delete failed',
            })
        }
    }).catch(error => {
        return res.error({
            message: error.message,
        })
    })
}

const getTop5ListsYours = async (req, res) => {

    const {search, sort} = req.query

    let filter = {
        // user: req.userId,
        user: mongoose.Types.ObjectId(req.userId),
    }

    // start with
    if (search) {
        filter['name'] = {$regex: new RegExp("^" + search.toLowerCase() + "", "i")}
    }

    let sortObject = {publishedAt: 'desc'}
    switch (sort) {
        case 'date-desc':
            sortObject = {publishedAt: 'desc'}
            break;
        case 'date-asc':
            sortObject = {publishedAt: 'asc'}
            break;
        case 'views-desc':
            sortObject = {views: 'desc'}
            break;
        case 'likes-desc':
            sortObject = {likes: 'desc'}
            break;
        case 'dislikes-desc':
            sortObject = {dislikes: 'desc'}
            break;
        default:
            // default is same as case 'date-desc':
            break;
    }
    console.log(sortObject)

    Top5List
        .aggregate([
            // {
            //     $match: filter,
            // },
            {
                $addFields: {
                    'likes': {$size: '$ups'},
                    'dislikes': {$size: '$downs'},
                }
            }
        ])
        .match(filter)
        .sort(sortObject)
        .then(async (top5Lists) => {
            if (top5Lists) {
                let populate1 = await Top5List
                    .populate(top5Lists, {
                        path: 'comments.user',
                        select: 'username'
                    })
                let populate2 = await Top5List
                    .populate(populate1, {
                        path: 'user',
                        select: 'username'
                    })

                return res.success({
                    data: populate2,
                })
            } else {
                return res.success({
                    data: top5Lists,
                })
            }
        })
        .catch(err => {
            // console.log(err)
            return res.error({
                message: err.message,
            })
        })
}

const getTop5ListsUser = async (req, res) => {
    const {search, sort} = req.query

    let filter = {
        community: false,
        published: true,
    }

    if (search) {
        let searchUser = await User.findOne({
            username: {$regex: new RegExp("^" + search.toLowerCase() + "$", "i")}
        })
        console.log("searchUser: ", searchUser)

        if (searchUser) {
            filter['user'] = searchUser._id;
        } else {
            return res.success({
                data: [],
                message: 'this username not exists.'
            })
        }
    } else {
        return res.success({
            data: [],
            message: 'type the username to search.'
        })
    }

    let sortObject = {publishedAt: 'desc'}
    switch (sort) {
        case 'date-desc':
            sortObject = {publishedAt: 'desc'}
            break;
        case 'date-asc':
            sortObject = {publishedAt: 'asc'}
            break;
        case 'views-desc':
            sortObject = {views: 'desc'}
            break;
        case 'likes-desc':
            sortObject = {likes: 'desc'}
            break;
        case 'dislikes-desc':
            sortObject = {dislikes: 'desc'}
            break;
        default:
            // default is same as case 'date-desc':
            break;
    }
    console.log(sortObject)

    Top5List
        .aggregate([
            {
                $addFields: {
                    'likes': {$size: '$ups'},
                    'dislikes': {$size: '$downs'},
                }
            }
        ])
        .match(filter)
        .sort(sortObject)
        .then(async (top5Lists) => {
            if (top5Lists) {
                let populate1 = await Top5List
                    .populate(top5Lists, {
                        path: 'comments.user',
                        select: 'username'
                    })
                let populate2 = await Top5List
                    .populate(populate1, {
                        path: 'user',
                        select: 'username'
                    })

                return res.success({
                    data: populate2,
                })
            } else {
                return res.success({
                    data: top5Lists,
                })
            }
        })
        .catch(err => {
            // console.log(err)
            return res.error({
                message: err.message,
            })
        })
}

const getTop5ListsAll = async (req, res) => {
    const {search, sort} = req.query

    let filter = {
        community: false,
        published: true,
    }
    if (search) {
        filter['name'] = {$regex: new RegExp("^" + search.toLowerCase() + "$", "i")}
    }

    let sortObject = {publishedAt: 'desc'}
    switch (sort) {
        case 'date-desc':
            sortObject = {publishedAt: 'desc'}
            break;
        case 'date-asc':
            sortObject = {publishedAt: 'asc'}
            break;
        case 'views-desc':
            sortObject = {views: 'desc'}
            break;
        case 'likes-desc':
            sortObject = {likes: 'desc'}
            break;
        case 'dislikes-desc':
            sortObject = {dislikes: 'desc'}
            break;
        default:
            // default is same as case 'date-desc':
            break;
    }
    console.log(sortObject)

    Top5List
        .aggregate([
            {
                $addFields: {
                    'likes': {$size: '$ups'},
                    'dislikes': {$size: '$downs'},
                }
            }
        ])
        .match(filter)
        .sort(sortObject)
        .then(async (top5Lists) => {
            if (top5Lists) {
                let populate1 = await Top5List
                    .populate(top5Lists, {
                        path: 'comments.user',
                        select: 'username'
                    })
                let populate2 = await Top5List
                    .populate(populate1, {
                        path: 'user',
                        select: 'username'
                    })

                return res.success({
                    data: populate2,
                })
            } else {
                return res.success({
                    data: top5Lists,
                })
            }
        })
        .catch(err => {
            // console.log(err)
            return res.error({
                message: err.message,
            })
        })
}

const getTop5ListsCommunity = async (req, res) => {

    const {search, sort} = req.query

    let filter = {
        community: true,

        published: true,
    }

    if (search) {
        filter['name'] = {$regex: new RegExp("^" + search.toLowerCase() + "$", "i")}
    }

    let sortObject = {publishedAt: 'desc'}
    switch (sort) {
        case 'date-desc':
            sortObject = {publishedAt: 'desc'}
            break;
        case 'date-asc':
            sortObject = {publishedAt: 'asc'}
            break;
        case 'views-desc':
            sortObject = {views: 'desc'}
            break;
        case 'likes-desc':
            sortObject = {likes: 'desc'}
            break;
        case 'dislikes-desc':
            sortObject = {dislikes: 'desc'}
            break;
        default:
            // default is same as case 'date-desc':
            break;
    }
    console.log(sortObject)

    Top5List
        .aggregate([
            {
                $addFields: {
                    // 'likes': {$size: '$ups'},
                    'likes': {
                        $size: {
                        "$cond": [
                            { "$isArray": "$ups" },
                            "$ups",
                            []
                        ]
                        }
                    },
                    // 'dislikes': {$size: '$downs'},
                    'dislikes': {
                        $size: {
                        "$cond": [
                            { "$isArray": "$downs" },
                            "$downs",
                            []
                        ]
                        }
                    },
                }
            }
        ])
        .match(filter)
        .sort(sortObject)
        .then(async (top5Lists) => {
            if (top5Lists) {
                let populate1 = await Top5List
                    .populate(top5Lists, {
                        path: 'comments.user',
                        select: 'username'
                    })
                let populate2 = await Top5List
                    .populate(populate1, {
                        path: 'user',
                        select: 'username'
                    })

                return res.success({
                    data: populate2,
                })
            } else {
                return res.success({
                    data: top5Lists,
                })
            }
        })
        .catch(err => {
            // console.log(err)
            return res.error({
                message: err.message,
            })
        })
}

module.exports = {
    createTop5List,
    saveTop5List,
    publishTop5ListById,
    deleteTop5List,

    getTop5ListsYours,
    getTop5ListsAll,
    getTop5ListsUser,
    getTop5ListsCommunity,

    likeOrDislikeTop5List,
    increaseViewsTop5List,
    commentOnTop5ListById,
}