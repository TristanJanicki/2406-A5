var User        = require('../models/user');
var Category    = require('../models/categories');
var Department  = require('../models/department');
var Product     = require('../models/product');
var Variant     = require('../models/variant');
var mongoose    = require('mongoose');
var colour      = require('colour');


//mongoose.connect('mongodb://localhost/shoppingApp');
// db name yardAndGarage
mongoose.connect("mongodb+srv://ecommerceAdmin:ecommerceAdminPw1@comp2406a5-nj8mr.mongodb.net/yardAndGarage?retryWrites=true", { useNewUrlParser: true, useCreateIndex: true, });

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
            categoryName        : 'Basics'
        })
        // new Category({
        //     categoryName        : 'Blazer'
        // }),
        // new Category({
        //     categoryName        : 'Knitwear'
        // }),
        // new Category({
        //     categoryName        : 'Jeans'
        // }),
        // new Category({
        //     categoryName        : 'Jackets'
        // })
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
        new Department({
            departmentName      : 'Office',
            categories          : 'Basics'
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
        new Product({
            _id: "5bedf31cc14d7822b39d9d43",
            imagePath: `/uploads/bag.jpg`,
            title: 'Bag',
            description: 'A bag to store stuff in.',
            price: 35.95,
            color: 'Gray',
            quantity: 10,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf3b9c14d7822b39d9d45",
            imagePath: `/uploads/calendar.jpg`,
            title: 'Calendar',
            description: 'A calendar to write stuff on.',
            price: 29.99,
            color: 'White',
            quantity: 15,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf448c14d7822b39d9d47",
            imagePath: `/uploads/highlighter-marker-500x500.jpg`,
            title: 'Highlighter',
            description: 'A highlighter to highlight stuff with.',
            price: 25.99,
            color: 'Yellow, blue, pink, green, orange',
            quantity: 90,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf55bc14d7822b39d9d4b",
            imagePath: `/uploads/paper.jpg`,
            title: 'Paper',
            description: 'A box of papers to write stuff on.',
            price: 79.99,
            color: 'Black',
            quantity: 4,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf5eec14d7822b39d9d4e",
            imagePath: `/uploads/pencil.jpg`,
            title: 'Pencil',
            description: 'A pencil to write stuff on paper with.',
            price: 79.99,
            color: 'Orange',
            quantity: 5,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf6b5c14d7822b39d9d51",
            imagePath: `/uploads/pencilSharpener.jpg`,
            title: 'Pencil Sharpener',
            description: 'A thing to sharpen pencils with.',
            price: 79.99,
            color: 'Dark Blue',
            quantity: 80,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf720c14d7822b39d9d52",
            imagePath: `/uploads/sharpie.jpg`,
            title: 'Sharpie',
            description: 'A thing to write permanent messages with.',
            price: 45.99,
            color: 'Black',
            quantity: 8,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf7ecc14d7822b39d9d55",
            imagePath: `/uploads/stapler.jpg`,
            title: 'Stapler',
            description: 'A thing that is used to put staples through other things.',
            price: 99.99,
            color: 'Brown',
            quantity: 12,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf7ecc14d7822b39d9d55",
            imagePath: `/uploads/stickyNote.jpg`,
            title: 'Sticky Note',
            description: 'A thing that is used to put small notes on other things.',
            price: 99.99,
            color: 'Brown',
            quantity: 12,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf7ecc14d7822b39d9d55",
            imagePath: `/uploads/tape.jpg`,
            title: 'Tape',
            description: 'A thing that is used to hold things together.',
            price: 99.99,
            color: 'Brown',
            quantity: 12,
            department: 'Office',
            category: 'Basics',
        }),
        new Product({
            _id: "5bedf7ecc14d7822b39d9d55",
            imagePath: `/uploads/taxReceipts.jpg`,
            title: 'Tax Forms',
            description: 'Various CRA tax forms.',
            price: 99.99,
            color: 'Brown',
            quantity: 12,
            department: 'Office',
            category: 'Basics',
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
            imagePath: `/uploads/7568644710_1_1_1.jpg`,
            color: 'Beige',
            quantity: 5,
        }),
        new Variant({
            productID: '5bedf3b9c14d7822b39d9d45',
            imagePath: `/uploads/5644641735_2_5_1.jpg`,
            color: 'Copper',
            quantity: 12,
        }),
        new Variant({
            productID: '5bedf448c14d7822b39d9d47',
            imagePath: `/uploads/7568469605_2_1_1.jpg`,
            color: 'Maroon',
            quantity: 4,
        }),
        new Variant({
            productID: '5bedf448c14d7822b39d9d47',
            imagePath: `/uploads/7568469822_2_1_1.jpg`,
            color: 'Charcool',
            quantity: 5,
        }),
        new Variant({
            productID: '5bedf5eec14d7822b39d9d4e',
            imagePath: `/uploads/1775300806_2_1_1.jpg`,
            color: 'Stone',
            quantity: 35,
        }),
        new Variant({
            productID: '5bedf720c14d7822b39d9d52',
            imagePath: `/uploads/5575380407_1_1_1.jpg`,
            color: 'Dark Blue',
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
    var newUser1 = new User({
        username    : 'admin@admin.com',
        password    : 'admin',
        fullname    : 'Tristan Janicki',
        admin       : true
    });

    var newUser2 = new User({
        username: "tristan.janicki@gmail.com",
        password: '2406pw1',
        fullname: "Tristan Janicki 2",
        admin: false
    })

    User.createUser(newUser1, function(err, user){
        if(err) throw err;
        console.log("Admin user inserted".green)
        console.log("Username: ", user.username + "\n" , "Password: admin");
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
                                    //insertVariants(function()
                                    //{
                                        insertAdmin(callback)
                                    //})
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
