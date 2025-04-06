var express = require('express');
const Item = require("../models/item");
const Section = require("../models/section");
const Tag = require("../models/tag");
const Account = require("../models/account");
const ItemAccount = require("../models/itemAccount");
const ItemTag = require("../models/itemTag");
var userItemsRouter = express.Router();

userItemsRouter.post('/', async function (req, res) {
    const {
        username,
        title,
        author,
        year,
        selectedCategory,
        lastMinute,
        lastChapter,
        done,
        link,
        section,
        tags,
        notes,
        favouriteParts,
        storyValue,
        visualValue,
        endingValue,
        publicItem
    } = req.body;

    try {
        let account = await Account.findOne({where: {username: username}});

        console.log(account);

        let item = await Item.findOne({where: {title: title, author: author}});
        console.log(item);

        if (!item) {
            item = await Item.create({title: title, author: author, year: year, type: selectedCategory});
            console.log('created item ', item);
        }

        let sectionItem = await Section.findOne({where: {section_name: section, section_type: selectedCategory}});
        console.log(sectionItem);

        if (!sectionItem) {
            sectionItem = await Section.create({section_name: section, section_type: selectedCategory});
            console.log('created section ', sectionItem);
        }

        let itemAccount = await ItemAccount.findOne({where: {item_id: item.item_id, account_id: account.account_id}});
        console.log(itemAccount);

        if (!itemAccount) {
            itemAccount = await ItemAccount.create({
                item_id: item.item_id,
                account_id: account.account_id,
                section_id: sectionItem.section_id,
                link: link,
                last_minute: lastMinute,
                last_chapter: lastChapter,
                done: done,
                notes: notes,
                favourite_parts: favouriteParts,
                story_rating: storyValue,
                scenery_rating: visualValue,
                ending_rating: endingValue,
                public: publicItem,
            });
        } else {
            await itemAccount.update({
                section_id: sectionItem.section_id,
                link: link,
                last_minute: lastMinute,
                last_chapter: lastChapter,
                done: done,
                notes: notes,
                favourite_parts: favouriteParts,
                story_rating: storyValue,
                scenery_rating: visualValue,
                ending_rating: endingValue,
                public: publicItem,
            });
        }

        for (const tag of tags) {
            let tagItem = await Tag.findOne({where: {tag_name: tag}});
            console.log(tagItem);

            if (!tagItem) {
                tagItem = await Tag.create({tag_name: tag});
                console.log('created tag ', tagItem);
            }

            let tagAccount = await ItemTag.findOne({where: {itemAccount_id: itemAccount.id, tag_id: tagItem.tag_id}});
            console.log(tagAccount);

            if (!tagAccount) {
                tagAccount = await ItemTag.create({itemAccount_id: itemAccount.id, tag_id: tagItem.tag_id});
                console.log('created tag-item ', tagAccount);
            }
        }


        res.status(201).json({
            message: 'Item saved successfully',
        });

        console.log('here');

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

userItemsRouter.get('/', async (req, res) => {
    const {username} = req.query;

    console.log('username', username);

    if (!username) {
        return res.status(400).json({error: 'Username is required'});
    }

    try {
        let account = await Account.findOne({where: {username: username}});
        console.log('get');

        let itemAccounts = null;
        if (username !== 'admin') {
            itemAccounts = await ItemAccount.findAll({
                where: {account_id: account.account_id},
                attributes: {exclude: ['createdAt', 'updatedAt']}
            });
        } else {
            itemAccounts = await ItemAccount.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}});
        }

        console.log('here', itemAccounts.length, itemAccounts);

        for (let i = 0; i < itemAccounts.length; i++) {
            console.log(itemAccounts[i]);
            let item = await Item.findOne({where: {item_id: itemAccounts[i].item_id}});
            let section = await Section.findOne({where: {section_id: itemAccounts[i].section_id}});
            let tagsId = await ItemTag.findAll({where: {itemAccount_id: itemAccounts[i].id}});

            let tags = [];

            for (const tagId of tagsId) {
                let tag = await Tag.findOne({where: {tag_id: tagId.tag_id}});

                if (tag) {
                    tags.push(tag.tag_name);
                }
            }

            if (item) {
                itemAccounts[i].dataValues.title = item.title;
                itemAccounts[i].dataValues.year = item.year;
                itemAccounts[i].dataValues.author = item.author;
                itemAccounts[i].dataValues.section = section.section_name;
                itemAccounts[i].dataValues.tags = tags;
            }

            console.log('After update:', itemAccounts);
        }

        console.log('all info', itemAccounts);

        res.status(201).json({
            items: itemAccounts,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to fetch items',
            error: err.message
        });
    }
});

userItemsRouter.delete('/', async (req, res) => {
    const {itemId} = req.query;

    try {
        const deletedCount = await ItemAccount.destroy({where: {id: itemId}});

        if (deletedCount === 0) {
            return res.status(404).json({message: "No item account found with this ID."});
        }

        res.status(201).json({message: `Deleted item account with ID: ${itemId}`});

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to fetch items',
            error: err.message
        });
    }
});


module.exports = userItemsRouter;
