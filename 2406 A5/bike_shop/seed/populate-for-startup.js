var User        = require('../models/user');
var Category    = require('../models/categories');
var Department  = require('../models/department');
var Product     = require('../models/product');
var Variant     = require('../models/variant');
var mongoose    = require('mongoose');
var colour      = require('colour');


//mongoose.connect('mongodb://localhost/shoppingApp');
mongoose.connect('mongodb://localhost/yardAndGarage', { useNewUrlParser: true, useCreateIndex: true, });

function deleteVariants(callback)
{
    Variant.deleteMany({}, function(e, result)
    {
        if (e)
        {
            console.log("Failed on deleting variants from db\nError:".error, e.message.error + "\n")
        }
        else
        {
            console.log("Variants deleted".red)
            callback()
        }
    });
}
function deleteCategories(callback)
{
    Category.deleteMany({}, function(e, result)
    {
        if (e)
        {
            console.log("Failed on deleting category from db\nError:".error, e.message.error + "\n")
        }
        else
        {
            console.log("Categories deleted".red)
            callback()
        }
    });
}
function deleteDepartments(callback)
{
    Department.deleteMany({}, function(e, result)
    {
        if (e)
        {
            console.log("Failed on deleting department from db\nError:".error, e.message.error + "\n")
        }
        else
        {
            console.log("Departments deleted".red)
            callback()
        }
    });
}

function deleteUsers(callback)
{
    User.deleteMany({}, function(e, result)
    {
        if (e)
        {
            console.log("Failed on deleting user from db\nError:".error, e.message.error + "\n")
        }
        else
        {
            console.log("Users deleted".red)
            callback()
        }
    });
}
function deleteProducts(callback)
{
    Product.deleteMany({}, function(e, result)
    {
        if (e)
        {
            console.log("Failed on deleting product from db\nError:".error, e.message.error + "\n")
        }
        else
        {
            console.log("Products deleted".red)
            callback()
        }
    });
}

function insertCategories(callback)
{
    var categories =
    [
        new Category({
            categoryName        : 'Mountan bike'
        }),
        new Category({
            categoryName        : 'Road Bike'
        }),
        new Category({
            categoryName        : 'Cyclocross'
        }),
        new Category({
            categoryName        : 'Triathlon'
        }),
        new Category({
            categoryName        : 'Fat Bike'
        }),
        new Category({
            categoryName        : 'Kids'
        })
    ]

    for (let i = 0; i < categories.length; i++){
        categories[i].save(function(e, r) {
            if (i === categories.length - 1){
                console.log("Categories inserted".green)
                callback();
            }
        });
    }
}

function insertDepartments(callback)
{
    var departments =
    [
        // bikes type
        new Department({
            departmentName      : 'Bikes type',
            categories          : 'Mountan Bike,Road Bike,Cyclocross,Triathlon,Fat Bike,Kids'

        })
    ]

    for (let i = 0; i < departments.length; i++){
        departments[i].save(function(e, r) {
            if (i === departments.length - 1){
                console.log("Departments inserted".green)
                callback();
            }
        });
    }
}

function insertProducts(callback)
{
    var products =
    [
        // product 1
        new Product({
            _id: "5bedf31cc14d7822b39d9d43",
            imagePath: `https://content.competitivecyclist.com/images/items/900/YTI/YTI00B2/TU.jpg`,
            title: 'Yeit Cycles Sb5',
            description: 'This bike is use to go on different trails on mountans or hi hills when you are biking upwards. It is lightweight, quick on climbs and strong on descents.',
            price: 7999.00,
            color: 'Blue',
            size: 'L, XL',
            quantity: 10,
            department: 'Bikes type',
            category: 'Mountan Bike',
        }),
        // product 2
        new Product({
            _id: "5bedf3b9c14d7822b39d9d45",
            imagePath: `https://content.competitivecyclist.com/images/items/900/RID/RID007A/BLA.jpg`,
            title: 'Ridley Noah',
            description: 'This bile is speedy and fast and and mark as the number one product that was tested in 2018. Not only it is fast, the frame weight 250g over its predecessor.',
            price: 3499.00,
            color: 'Red and Black',
            size: 'XXS, XS, S, M, L',
            quantity: 15,
            department: 'Bikes type',
            category: 'Road Bike',
        }),
        // product 3
        new Product({
            _id: "5bedf448c14d7822b39d9d47",
            imagePath: `https://content.competitivecyclist.com/images/items/900/NNR/NNR00A4/YEL.jpg`,
            title: 'Niner Bsb 9',
            description: 'The BSB 9 3-Star Complete Cyclocross Bike from Niner keeps your blood moving and your muscles working. This bike is purposly used for working out your legs and muscles and you will need a drink after your ride.',
            price: 3800.00,
            color: 'Yellow',
            size: 'S, M',
            quantity: 90,
            department: 'Bikes type',
            category: 'Cyclocross',
        }),
        // product 4
        new Product({
            _id: "5bedf55bc14d7822b39d9d4b",
            imagePath: `https://content.competitivecyclist.com/images/items/900/BIA/BIA000W/MATCEL.jpg`,
            title: 'Bianchi Oltre',
            description: 'It\'s a Bianchi, which is design for a fast preformans having great control, good position, and have a comfortable seat. Also, it reduce wind drag so there is more acceleration in biking.',
            price: 6999.00,
            color: 'Light Blue',
            size: 'S, M, L',
            quantity: 4,
            department: 'Bikes type',
            category: 'Road Bike',
        }),
        // product 5
        new Product({
            _id: "5bedf5eec14d7822b39d9d4e",
            imagePath: `https://content.competitivecyclist.com/images/items/900/RID/RID009N/BLA_D1.jpg`,
            title: 'Ridley Dean',
            description: 'Have great design, comfortable seat, and accelerate at good speed. The Ridley Dean gives you everything you want',
            price: 2699.00,
            color: 'Black',
            size: 'XS, S, M, L',
            quantity: 5,
            department: 'Bikes type',
            category: 'Triathlon',
        }),
        // product 6
        new Product({
            _id: "5bedf6b5c14d7822b39d9d51",
            imagePath: `https://content.competitivecyclist.com/images/items/900/EVB/EVB000J/FREMER.jpg`,
            title: 'Evil Bikes The Insurgent',
            description: 'You think riding this bike will make you evil. You are wrong. It has a short chainstays, low bottom bracket and a long tube that makes shredding better. It also gives boost to the rear axle spacing and able to jump off ramps',
            price: 7299.00,
            color: 'Grey',
            size: 'XS, S, M, L',
            quantity: 80,
            department: 'Bikes type',
            category: 'Mountain Bikes',
        }),
        // product 7
        new Product({
            _id: "5bedf720c14d7822b39d9d52",
            imagePath: `https://content.competitivecyclist.com/images/items/900/BOR/BOR000S/NORLIG.jpg`,
            title: 'Borealis Bikes Crestone',
            description: 'If you\'re looking at this bike, then this bike will take you though the wild and they are able to ride though the winter storm and heap of snow.',
            price: 2699.00,
            color: 'Black',
            size: 'L',
            quantity: 8,
            department: 'Bikes type',
            category: 'Fat Bike',
        }),
        // product 8
        new Product({
            _id: "5bedf7ecc14d7822b39d9d55",
            imagePath: `https://content.competitivecyclist.com/images/items/900/RID/RID006F/ORA.jpg`,
            title: 'Ridley X-night',
            description: 'Cyclocross\' best competion bike is realy super light and can ride off streets and make you the number one champion.',
            price: 2624.25,
            color: 'Orange',
            size: 'S',
            quantity: 12,
            department: 'Bikes type',
            category: 'Cyclocross',
        }),
        // product 9
        new Product({
            _id: "5bedf7ecc14d7822b39d9d58",
            imagePath: `https://content.competitivecyclist.com/images/items/900/PVE/PVE0004/SI.jpg`,
            title: 'Revelo Bikes Alpha Three 20in Complete Bike - Kids',
            description: 'This bike is small for kids and the color is silver.',
            price: 499.00,
            color: 'Silver',
            size: 'XXS',
            quantity: 12,
            department: 'Bikes type',
            category: 'Kids',
        }),
        // product 10
        new Product({
            _id: "5bedf7ecc14d7822b39d9d5a",
            imagePath: `https://content.competitivecyclist.com/images/items/900/JLI/JLI006D/GN.jpg`,
            title: 'Juliana Strega',
            description: 'This bike is good for femaie riders and it is super light that you are able to ride straight through to the World Championship ',
            price: 3719.66,
            color: 'Light Green',
            size: 'XS, S, M',
            quantity: 12,
            department: 'Bikes type',
            category: 'Mountan Bike',
        })
    ];

    for (let i = 0; i < products.length; i++){
        products[i].save(function(e, r) {
            if (i === products.length - 1){
                console.log("Products inserted".green)
                callback();
            }
        });
    }
}

function insertVariants(callback)
{
    var variants =
    [
        new Variant({
            productID: '5bedf31cc14d7822b39d9d43',
            imagePath: `https://content.competitivecyclist.com/images/items/900/YTI/YTI00B2/RAW.jpg`,
            color: 'Black',
            size: 'L, XL',
            quantity: 5,
        }),
        new Variant({
            productID: '5bedf3b9c14d7822b39d9d45',
            imagePath: `https://content.competitivecyclist.com/images/items/900/RID/RID007A/BLA_D3.jpg`,
            color: 'Red and Black',
            size: 'XXS, XS, S, M, L',
            quantity: 12,
        }),
        new Variant({
            productID: '5bedf448c14d7822b39d9d47',
            imagePath: `https://content.competitivecyclist.com/images/items/900/NNR/NNR00A4/YEL_D4.jpg`,
            color: 'Yellow',
            size: 'S, M',
            quantity: 4,
        }),
        new Variant({
            productID: '5bedf448c14d7822b39d9d47',
            imagePath: `https://content.competitivecyclist.com/images/items/900/NNR/NNR00A4/YEL_D3.jpg`,
            color: 'Yellow',
            size: 'S, M',
            quantity: 5,
        }),
        new Variant({
            productID: '5bedf55bc14d7822b39d9d4b',
            imagePath: `https://content.competitivecyclist.com/images/items/900/BIA/BIA000W/MATCEL_D9.jpg`,
            color: 'Light Blue',
            size: 'S, M, L',
            quantity: 35,
        }),
        new Variant({
            productID: '5bedf6b5c14d7822b39d9d51',
            imagePath: `https://content.competitivecyclist.com/images/items/900/EVB/EVB000J/FREMER_D6.jpg`,
            color: 'Grey',
            size: 'XS, S, M, L',
            quantity: 5,
        }),
        new Variant({
            productID: '5bedf7ecc14d7822b39d9d58',
            imagePath: `https://content.competitivecyclist.com/images/items/900/PVE/PVE0004/SI_D1.jpg`,
            color: 'Silver',
            size: 'XXS',
            quantity: 5,
        }),
        new Variant({
            productID: '5bedf7ecc14d7822b39d9d5a',
            imagePath: `https://content.competitivecyclist.com/images/items/900/JLI/JLI006D/GN_D6.jpg`,
            color: 'Light Green',
            size: 'XS, S, M',
            quantity: 5,
        })
    ];

    for (let i = 0; i < variants.length; i++){
        variants[i].save(function(e, r) {
            if (i === variants.length - 1){
                console.log("Variants inserted".green)
                callback();
            }
        });
    }
}

function insertAdmin(callback)
{
    // making one admin user
    var newUser = new User({
        username    : 'balcerzak.michael@gmail.com',
        password    : 'Lakeadded',
        fullname    : 'Michael Balcerzak',
        admin       : true
    });
    
    // making a second admin user
    var newUser2 = new User({
        username    : 'sebastian.z.kamel@gmail.com',
        password    : 'helper',
        fullname    : 'Sebastian Kamel',
        admin       : true
    });
    
    // put the first admin user to the web store
    User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log("Admin user inserted".green)
        console.log("Username: ", user.username + "\n" , "Password: Lakeadded");
    });
    
    // put the second admin user to the web store and disconect from mongoose
    User.createUser(newUser2, function(err, user){
        if(err) throw err;
        console.log("Admin user inserted".green)
        console.log("Username: ", user.username + "\n" , "Password: Lakeadded");
        callback()
    });
}


function deleteDBEntitites(callback)
{
    deleteVariants(function()
    {
        deleteCategories(function()
        {
            deleteDepartments(function()
            {
                deleteUsers(function()
                {
                    deleteProducts(function()
                    {
                        insertCategories(function()
                        {
                            insertDepartments(function()
                            {
                                insertProducts(function()
                                {
                                    insertVariants(function()
                                    {
                                        insertAdmin(callback)
                                    })
                                })
                            })
                        })
                    });
                })
            })
        })
    })
}



deleteDBEntitites(exit)


function exit() {
    mongoose.disconnect();
}
