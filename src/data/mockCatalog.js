export const mockCatalog = {
    divisions: ['ALC', 'NALC'],
    categories: [
        { division: 'ALC', name: 'Wine' },
        { division: 'ALC', name: 'Rum' },
        { division: 'ALC', name: 'Beer' },
        { division: 'ALC', name: 'Vodka' },
        { division: 'ALC', name: 'Whiskey' },
        { division: 'ALC', name: 'Tequila' },
        { division: 'ALC', name: 'Brandy' },
        { division: 'NALC', name: 'Energy Drinks' },
        { division: 'NALC', name: 'Water' },
        { division: 'NALC', name: 'Soda' },
        { division: 'NALC', name: 'Snacks' },
        { division: 'NALC', name: 'Fruit juice' },
        { division: 'NALC', name: 'Accessories' },
        { division: 'NALC', name: 'Main course' },
        { division: 'NALC', name: 'Sides' },
        { division: 'NALC', name: 'Entrees' },
        { division: 'NALC', name: 'Desserts' }
    ],
    subcategories: [
        { id: 'SCAT-1', categ: 'Wine', scateg: 'Red Wine' },
        { id: 'SCAT-2', categ: 'Wine', scateg: 'White Wine' },
        { id: 'SCAT-3', categ: 'Rum', scateg: 'Dark Rum' },
        { id: 'SCAT-4', categ: 'Rum', scateg: 'White Rum' },
        { id: 'SCAT-5', categ: 'Beer', scateg: 'Lager' },
        { id: 'SCAT-6', categ: 'Beer', scateg: 'Ale' },
        { id: 'SCAT-7', categ: 'Vodka', scateg: 'Flavored Vodka' },
        { id: 'SCAT-8', categ: 'Vodka', scateg: 'Clear Vodka' },
        { id: 'SCAT-9', categ: 'Whiskey', scateg: 'Scotch' },
        { id: 'SCAT-10', categ: 'Whiskey', scateg: 'Bourbon' },
        { id: 'SCAT-11', categ: 'Tequila', scateg: 'Blanco' },
        { id: 'SCAT-12', categ: 'Tequila', scateg: 'Reposado' },
        { id: 'SCAT-13', categ: 'Brandy', scateg: 'Cognac' },
        { id: 'SCAT-14', categ: 'Energy Drinks', scateg: 'Caffeinated' },
        { id: 'SCAT-15', categ: 'Water', scateg: 'Sparkling' },
        { id: 'SCAT-16', categ: 'Water', scateg: 'Still' },
        { id: 'SCAT-17', categ: 'Soda', scateg: 'Cola' },
        { id: 'SCAT-18', categ: 'Soda', scateg: 'Lemon Lime' },
        { id: 'SCAT-19', categ: 'Snacks', scateg: 'Chips' },
        { id: 'SCAT-20', categ: 'Snacks', scateg: 'Nuts' },
        { id: 'SCAT-21', categ: 'Fruit juice', scateg: 'Citrus' },
        { id: 'SCAT-22', categ: 'Fruit juice', scateg: 'Mixed Fruit' },
        { id: 'SCAT-23', categ: 'Accessories', scateg: 'Glasses' },
        { id: 'SCAT-24', categ: 'Accessories', scateg: 'Openers' },
        { id: 'SCAT-25', categ: 'Main course', scateg: 'Steak' },
        { id: 'SCAT-26', categ: 'Main course', scateg: 'Pasta' },
        { id: 'SCAT-27', categ: 'Sides', scateg: 'Fries' },
        { id: 'SCAT-28', categ: 'Sides', scateg: 'Salad' },
        { id: 'SCAT-29', categ: 'Entrees', scateg: 'Seafood' },
        { id: 'SCAT-30', categ: 'Entrees', scateg: 'Poultry' },
        { id: 'SCAT-31', categ: 'Desserts', scateg: 'Cake' },
        { id: 'SCAT-32', categ: 'Desserts', scateg: 'Ice Cream' }
    ],
    items: [
        // BEER (ALC)
        { id: 'MAT-1', name: '7 RIVERS MACHAA 330 - CAN', division: 'ALC', category: 'Beer', subcategory: 'Lager', mrp: 1500 },
        { id: 'MAT-2', name: '7 RIVERS VEERE 330 - CAN', division: 'ALC', category: 'Beer', subcategory: 'Lager', mrp: 1100 },
        { id: 'MAT-3', name: 'AMSTEL BIER GRANDE SUPREME 500 - CAN', division: 'ALC', category: 'Beer', subcategory: 'Lager', mrp: 200 },
        { id: 'MAT-4', name: 'KINGFISHER STRONG BEER 650 - BTL', division: 'ALC', category: 'Beer', subcategory: 'Lager', mrp: 500 },
        { id: 'MAT-5', name: 'BUDWEISER MAGNUM 650 - BTL', division: 'ALC', category: 'Beer', subcategory: 'Ale', mrp: 1100 },
        { id: 'MAT-6', name: 'GUINNESS KEG (50L)', division: 'ALC', category: 'Beer', subcategory: 'Ale', mrp: 500 },

        // WHISKEY (ALC)
        { id: 'MAT-7', name: 'MC DOWELLS NO.1 WHISKY 750ML', division: 'ALC', category: 'Whiskey', subcategory: 'Bourbon', mrp: 1300 },
        { id: 'MAT-8', name: 'ROYAL CHALLENGE WHISKY 750ML', division: 'ALC', category: 'Whiskey', subcategory: 'Bourbon', mrp: 800 },
        { id: 'MAT-9', name: 'BLACK DOG CENTENARY SCOTCH 1000ML', division: 'ALC', category: 'Whiskey', subcategory: 'Scotch', mrp: 700 },
        { id: 'MAT-10', name: 'TEACHERS HIGHLAND CREAM 750ML', division: 'ALC', category: 'Whiskey', subcategory: 'Scotch', mrp: 600 },
        { id: 'MAT-11', name: '100 PIPERS DELUXE SCOTCH 750ML', division: 'ALC', category: 'Whiskey', subcategory: 'Scotch', mrp: 1500 },
        
        // RUM (ALC)
        { id: 'MAT-12', name: 'OLD MONK SUPREME RUM 750ML', division: 'ALC', category: 'Rum', subcategory: 'Dark Rum', mrp: 1100 },
        { id: 'MAT-13', name: 'BACARDI CARTA BLANCA WHITE RUM 750ML', division: 'ALC', category: 'Rum', subcategory: 'White Rum', mrp: 700 },
        { id: 'MAT-14', name: 'CAPTAIN MORGAN DARK RUM 750ML', division: 'ALC', category: 'Rum', subcategory: 'Dark Rum', mrp: 1000 },
        { id: 'MAT-15', name: 'OLD DENG RUM 750ML', division: 'ALC', category: 'Rum', subcategory: 'Dark Rum', mrp: 1400 },
        { id: 'MAT-16', name: 'MALIBU COCONUT RUM 750ML', division: 'ALC', category: 'Rum', subcategory: 'White Rum', mrp: 1300 },
        
        // VODKA (ALC)
        { id: 'MAT-17', name: 'SMIRNOFF NO.21 VODKA 750ML', division: 'ALC', category: 'Vodka', subcategory: 'Clear Vodka', mrp: 900 },
        { id: 'MAT-18', name: 'MAGIC MOMENTS PREMIUM VODKA 750ML', division: 'ALC', category: 'Vodka', subcategory: 'Clear Vodka', mrp: 1600 },
        { id: 'MAT-19', name: 'ABSOLUT VODKA 750ML', division: 'ALC', category: 'Vodka', subcategory: 'Clear Vodka', mrp: 800 },
        { id: 'MAT-20', name: 'GREY GOOSE VODKA 750ML', division: 'ALC', category: 'Vodka', subcategory: 'Clear Vodka', mrp: 500 },
        { id: 'MAT-21', name: 'HOUSE VODKA (750ML)', division: 'ALC', category: 'Vodka', subcategory: 'Clear Vodka', mrp: 1200 },
        
        // WINE (ALC)
        { id: 'MAT-22', name: 'SULA CHENIN BLANC 750ML', division: 'ALC', category: 'Wine', subcategory: 'White Wine', mrp: 1000 },
        { id: 'MAT-23', name: 'JACOBS CREEK SHIRAZ CABERNET 750ML', division: 'ALC', category: 'Wine', subcategory: 'Red Wine', mrp: 1400 },
        { id: 'MAT-24', name: 'GROVER LA RESERVE 750ML', division: 'ALC', category: 'Wine', subcategory: 'Red Wine', mrp: 1000 },
        { id: 'MAT-25', name: 'FRATELLI CLASSIC SHIRAZ 750ML', division: 'ALC', category: 'Wine', subcategory: 'Red Wine', mrp: 1000 },
        { id: 'MAT-26', name: 'YELLOW TAIL MERLOT 750ML', division: 'ALC', category: 'Wine', subcategory: 'Red Wine', mrp: 1200 },

        // TEQUILA (ALC)
        { id: 'MAT-27', name: 'JOSE CUERVO ESPECIAL 750ML', division: 'ALC', category: 'Tequila', subcategory: 'Blanco', mrp: 1400 },
        { id: 'MAT-28', name: 'PATRON SILVER TEQUILA 750ML', division: 'ALC', category: 'Tequila', subcategory: 'Blanco', mrp: 1400 },
        { id: 'MAT-29', name: 'SAUZA GOLD TEQUILA 750ML', division: 'ALC', category: 'Tequila', subcategory: 'Reposado', mrp: 800 },
        { id: 'MAT-30', name: 'DON JULIO BLANCO 750ML', division: 'ALC', category: 'Tequila', subcategory: 'Blanco', mrp: 1300 },
        { id: 'MAT-31', name: 'CAMINO REAL BLANCO 750ML', division: 'ALC', category: 'Tequila', subcategory: 'Blanco', mrp: 1300 },

        // BRANDY (ALC)
        { id: 'MAT-32', name: 'MANSION HOUSE FRENCH BRANDY 750ML', division: 'ALC', category: 'Brandy', subcategory: 'Cognac', mrp: 1200 },
        { id: 'MAT-33', name: 'MORPHEUS XO BRANDY 750ML', division: 'ALC', category: 'Brandy', subcategory: 'Cognac', mrp: 500 },
        { id: 'MAT-34', name: 'HONEY BEE PREMIUM BRANDY 750ML', division: 'ALC', category: 'Brandy', subcategory: 'Cognac', mrp: 200 },
        { id: 'MAT-35', name: 'COURRIER NAPOLEON FINEST BRANDY 750ML', division: 'ALC', category: 'Brandy', subcategory: 'Cognac', mrp: 1300 },
        { id: 'MAT-36', name: 'MCDOWELLS NO.1 BRANDY 750ML', division: 'ALC', category: 'Brandy', subcategory: 'Cognac', mrp: 1300 },

        // ENERGY DRINKS (NALC)
        { id: 'MAT-37', name: 'RED BULL ENERGY DRINK 250ML', division: 'NALC', category: 'Energy Drinks', subcategory: 'Caffeinated', mrp: 900 },
        { id: 'MAT-38', name: 'MONSTER ENERGY DRINK 500ML', division: 'NALC', category: 'Energy Drinks', subcategory: 'Caffeinated', mrp: 600 },
        { id: 'MAT-39', name: 'STING ENERGY DRINK 250ML', division: 'NALC', category: 'Energy Drinks', subcategory: 'Caffeinated', mrp: 1300 },
        { id: 'MAT-40', name: 'GATORADE BLUE BOLT 500ML', division: 'NALC', category: 'Energy Drinks', subcategory: 'Caffeinated', mrp: 1400 },
        { id: 'MAT-41', name: 'HELL ENERGY DRINK 250ML', division: 'NALC', category: 'Energy Drinks', subcategory: 'Caffeinated', mrp: 500 },

        // WATER (NALC)
        { id: 'MAT-42', name: 'KINLEY PACKAGED DRINKING WATER 1L', division: 'NALC', category: 'Water', subcategory: 'Still', mrp: 1400 },
        { id: 'MAT-43', name: 'BISLERI WATER 1L', division: 'NALC', category: 'Water', subcategory: 'Still', mrp: 1100 },
        { id: 'MAT-44', name: 'AQUAFINA WATER 1L', division: 'NALC', category: 'Water', subcategory: 'Still', mrp: 800 },
        { id: 'MAT-45', name: 'HIMALAYAN NATURAL MINERAL WATER 1L', division: 'NALC', category: 'Water', subcategory: 'Still', mrp: 600 },
        { id: 'MAT-46', name: 'VEDICA NATURAL MOUNTAIN WATER 1L', division: 'NALC', category: 'Water', subcategory: 'Still', mrp: 1600 },

        // SODA (NALC)
        { id: 'MAT-47', name: 'SCHWEPPES SODA WATER 750ML', division: 'NALC', category: 'Soda', subcategory: 'Cola', mrp: 700 },
        { id: 'MAT-48', name: 'KINLEY SODA 750ML', division: 'NALC', category: 'Soda', subcategory: 'Lemon Lime', mrp: 1600 },
        { id: 'MAT-49', name: 'COCA-COLA 600ML', division: 'NALC', category: 'Soda', subcategory: 'Cola', mrp: 1200 },
        { id: 'MAT-50', name: 'SPRITE 600ML', division: 'NALC', category: 'Soda', subcategory: 'Lemon Lime', mrp: 1100 },
        { id: 'MAT-51', name: 'THUMS UP 600ML', division: 'NALC', category: 'Soda', subcategory: 'Cola', mrp: 1600 },

        // SNACKS (NALC)
        { id: 'MAT-52', name: 'LAYS CLASSIC SALTED 50G', division: 'NALC', category: 'Snacks', subcategory: 'Chips', mrp: 500 },
        { id: 'MAT-53', name: 'DORITOS NACHO CHEESE 50G', division: 'NALC', category: 'Snacks', subcategory: 'Chips', mrp: 1600 },
        { id: 'MAT-54', name: 'PRINGLES ORIGINAL 100G', division: 'NALC', category: 'Snacks', subcategory: 'Chips', mrp: 300 },
        { id: 'MAT-55', name: 'KURKURE MASALA MUNCH 50G', division: 'NALC', category: 'Snacks', subcategory: 'Chips', mrp: 1400 },
        { id: 'MAT-56', name: 'HALDIRAMS MOONG DAL 100G', division: 'NALC', category: 'Snacks', subcategory: 'Nuts', mrp: 200 },

        // FRUIT JUICE (NALC)
        { id: 'MAT-57', name: 'TROPICANA 100% APPLE JUICE 1L', division: 'NALC', category: 'Fruit juice', subcategory: 'Mixed Fruit', mrp: 1400 },
        { id: 'MAT-58', name: 'REAL MIXED FRUIT JUICE 1L', division: 'NALC', category: 'Fruit juice', subcategory: 'Mixed Fruit', mrp: 1100 },
        { id: 'MAT-59', name: 'PAPER BOAT AAMRAS 250ML', division: 'NALC', category: 'Fruit juice', subcategory: 'Citrus', mrp: 1200 },
        { id: 'MAT-60', name: 'B NATURAL GUAVA JUICE 1L', division: 'NALC', category: 'Fruit juice', subcategory: 'Mixed Fruit', mrp: 600 },
        { id: 'MAT-61', name: 'MINUTE MAID ORANGE 1L', division: 'NALC', category: 'Fruit juice', subcategory: 'Citrus', mrp: 1000 },

        // ACCESSORIES (NALC)
        { id: 'MAT-62', name: 'PAPER CARRY BAG (LARGE)', division: 'NALC', category: 'Accessories', subcategory: 'Openers', mrp: 1300 },
        { id: 'MAT-63', name: 'PLASTIC BAG (MEDIUM)', division: 'NALC', category: 'Accessories', subcategory: 'Openers', mrp: 1500 },
        { id: 'MAT-64', name: 'CARDBOARD PACKAGING BOX', division: 'NALC', category: 'Accessories', subcategory: 'Openers', mrp: 300 },
        { id: 'MAT-65', name: 'CORKSCREW OPENER', division: 'NALC', category: 'Accessories', subcategory: 'Openers', mrp: 700 },
        { id: 'MAT-66', name: 'ICE BUCKET (PLASTIC)', division: 'NALC', category: 'Accessories', subcategory: 'Glasses', mrp: 1400 },

        // MAIN COURSE (NALC)
        { id: 'MAT-67', name: 'RIBEYE STEAK (10OZ)', division: 'NALC', category: 'Main course', subcategory: 'Steak', mrp: 700 },
        { id: 'MAT-68', name: 'CHICKEN BIRYANI', division: 'NALC', category: 'Main course', subcategory: 'Pasta', mrp: 1400 },
        { id: 'MAT-69', name: 'MUTTON ROGAN JOSH', division: 'NALC', category: 'Main course', subcategory: 'Steak', mrp: 1400 },
        { id: 'MAT-70', name: 'PANEER BUTTER MASALA', division: 'NALC', category: 'Main course', subcategory: 'Pasta', mrp: 500 },
        { id: 'MAT-71', name: 'GRILLED SALMON', division: 'NALC', category: 'Main course', subcategory: 'Steak', mrp: 800 },

        // SIDES (NALC)
        { id: 'MAT-72', name: 'FRENCH FRIES', division: 'NALC', category: 'Sides', subcategory: 'Fries', mrp: 800 },
        { id: 'MAT-73', name: 'GARLIC BREAD', division: 'NALC', category: 'Sides', subcategory: 'Salad', mrp: 1600 },
        { id: 'MAT-74', name: 'ONION RINGS', division: 'NALC', category: 'Sides', subcategory: 'Fries', mrp: 400 },
        { id: 'MAT-75', name: 'MASALA PAPAD', division: 'NALC', category: 'Sides', subcategory: 'Salad', mrp: 200 },
        { id: 'MAT-76', name: 'MASHED POTATOES', division: 'NALC', category: 'Sides', subcategory: 'Fries', mrp: 1500 },

        // ENTREES (NALC)
        { id: 'MAT-77', name: 'PANEER TIKKA', division: 'NALC', category: 'Entrees', subcategory: 'Poultry', mrp: 800 },
        { id: 'MAT-78', name: 'CHICKEN 65', division: 'NALC', category: 'Entrees', subcategory: 'Poultry', mrp: 200 },
        { id: 'MAT-79', name: 'SPRING ROLLS', division: 'NALC', category: 'Entrees', subcategory: 'Seafood', mrp: 500 },
        { id: 'MAT-80', name: 'FISH TIKKA', division: 'NALC', category: 'Entrees', subcategory: 'Seafood', mrp: 800 },
        { id: 'MAT-81', name: 'MUSHROOM CHILLI', division: 'NALC', category: 'Entrees', subcategory: 'Poultry', mrp: 800 },

        // DESSERTS (NALC)
        { id: 'MAT-82', name: 'CHOCOLATE BROWNIE', division: 'NALC', category: 'Desserts', subcategory: 'Cake', mrp: 500 },
        { id: 'MAT-83', name: 'GULAB JAMUN (2 PCS)', division: 'NALC', category: 'Desserts', subcategory: 'Ice Cream', mrp: 1400 },
        { id: 'MAT-84', name: 'VANILLA ICE CREAM', division: 'NALC', category: 'Desserts', subcategory: 'Ice Cream', mrp: 300 },
        { id: 'MAT-85', name: 'CHEESECAKE', division: 'NALC', category: 'Desserts', subcategory: 'Cake', mrp: 200 },
        { id: 'MAT-86', name: 'TIRAMISU', division: 'NALC', category: 'Desserts', subcategory: 'Cake', mrp: 1500 }
    ],
    brands: [
        { id: 1, categ: 'Beer', scateg: 'Lager', bname: 'Kingfisher', bowner: 'United Breweries', active: 'Y' },
        { id: 2, categ: 'Rum', scateg: 'Dark Rum', bname: 'Old Monk', bowner: 'Mohan Meakin', active: 'Y' },
        { id: 3, categ: 'Whiskey', scateg: 'Scotch', bname: 'Black Dog', bowner: 'Diageo', active: 'Y' }
    ],
    packTypes: [
        { id: 1, pktype: 'BTL', active: 'Y' },
        { id: 2, pktype: 'CAN', active: 'Y' },
        { id: 3, pktype: 'KEG', active: 'Y' },
        { id: 4, pktype: 'TETRA', active: 'Y' }
    ],
    packSizes: [
        { id: 1, pksize: '330ML', active: 'Y' },
        { id: 2, pksize: '500ML', active: 'Y' },
        { id: 3, pksize: '650ML', active: 'Y' },
        { id: 4, pksize: '750ML', active: 'Y' },
        { id: 5, pksize: '1000ML', active: 'Y' }
    ],
    hsnCodes: [
        { id: 1, hsncode: '22030000', rate: '18%', active: 'Y' },
        { id: 2, hsncode: '22089011', rate: '18%', active: 'Y' },
        { id: 3, hsncode: '22041000', rate: '18%', active: 'Y' }
    ],
    calcTypes: [
        { id: 1, calctype: 'Percentage', active: 'Y' },
        { id: 2, calctype: 'Flat Value', active: 'Y' }
    ],
    discTypes: [
        { id: 1, disctype: 'Volume Discount', active: 'Y' },
        { id: 2, disctype: 'Festival Discount', active: 'Y' }
    ],
    offers: [
        { id: 1, offer: 'Summer Fest', matdesc: 'KINGFISHER STRONG BEER 650 - BTL', disctype: 'Volume Discount', discval: '10%', active: 'Y' },
        { id: 2, offer: 'Diwali Special', matdesc: 'MC DOWELLS NO.1 WHISKY 750ML', disctype: 'Flat Value', discval: '₹50', active: 'Y' }
    ]
};
