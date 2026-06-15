import { mockCatalog } from '../data/mockCatalog';

export const getUnifiedCategories = () => {
    let unifiedCategs = [...mockCatalog.categories];
    try {
        const categLocalStr = localStorage.getItem('masters_categ_local');
        const categDeletedStr = localStorage.getItem('masters_categ_deleted');
        
        const categLocal = categLocalStr ? JSON.parse(categLocalStr) : [];
        const categDeleted = categDeletedStr ? JSON.parse(categDeletedStr) : [];

        // Remove deleted
        unifiedCategs = unifiedCategs.filter((cat, i) => {
            const id = cat.id || `CATEG-${i}`;
            return !categDeleted.includes(id) && !categDeleted.includes(cat.name);
        });

        // Add new
        const newCategs = categLocal.filter(c => String(c.id).startsWith('LOCAL-') && !categDeleted.includes(c.id));
        newCategs.forEach(nc => {
            unifiedCategs.push({
                division: nc.division || 'ALC',
                name: nc.categ || nc.name
            });
        });
    } catch (e) {
        console.error("Failed to parse unified categories", e);
    }
    // Deduplicate by name
    return Array.from(new Map(unifiedCategs.map(item => [item.name, item])).values());
};

export const getUnifiedSubcategories = () => {
    let unifiedSubcategs = [...mockCatalog.subcategories];
    try {
        const scategLocalStr = localStorage.getItem('masters_scateg_local');
        const scategDeletedStr = localStorage.getItem('masters_scateg_deleted');
        
        const scategLocal = scategLocalStr ? JSON.parse(scategLocalStr) : [];
        const scategDeleted = scategDeletedStr ? JSON.parse(scategDeletedStr) : [];

        // Remove deleted
        unifiedSubcategs = unifiedSubcategs.filter((sub, i) => {
            const id = sub.id || `SCAT-${i}`;
            return !scategDeleted.includes(id) && !scategDeleted.includes(sub.scateg);
        });

        // Add new
        const newSubcategs = scategLocal.filter(s => String(s.id).startsWith('LOCAL-') && !scategDeleted.includes(s.id));
        newSubcategs.forEach(ns => {
            unifiedSubcategs.push({
                id: ns.id,
                categ: ns.categ,
                scateg: ns.scateg
            });
        });
    } catch (e) {
        console.error("Failed to parse unified subcategories", e);
    }
    // Deduplicate by scateg name
    return Array.from(new Map(unifiedSubcategs.map(item => [item.scateg, item])).values());
};

export const getUnifiedCatalog = () => {
    // 1. Start with base catalog items
    let unifiedItems = [...mockCatalog.items];

    try {
        // 2. Read Mara (Material Master) additions & edits
        const maraLocalStr = localStorage.getItem('masters_mara_local');
        const maraDeletedStr = localStorage.getItem('masters_mara_deleted');
        
        const maraLocal = maraLocalStr ? JSON.parse(maraLocalStr) : [];
        const maraDeleted = maraDeletedStr ? JSON.parse(maraDeletedStr) : [];

        // Remove deleted items
        unifiedItems = unifiedItems.filter(item => !maraDeleted.includes(item.id));

        // Apply Mara edits to existing items
        unifiedItems = unifiedItems.map(item => {
            const override = maraLocal.find(l => l.id === item.id);
            if (override) {
                return {
                    ...item,
                    name: override.matdesc || item.name,
                    subcategory: override.scateg || item.subcategory,
                    active: override.active || item.active
                };
            }
            return item;
        });

        const unifiedSubs = getUnifiedSubcategories();

        // Add new Mara items (LOCAL-...)
        const newMaraItems = maraLocal.filter(l => String(l.id).startsWith('LOCAL-') && !maraDeleted.includes(l.id));
        newMaraItems.forEach(newItem => {
            // Find parent category from subcategory dynamically
            const sub = unifiedSubs.find(s => s.scateg === newItem.scateg);
            unifiedItems.push({
                id: newItem.id,
                name: newItem.matdesc || 'Unnamed Material',
                division: 'ALC', // default
                category: sub ? sub.categ : 'Misc',
                subcategory: newItem.scateg,
                mrp: '', // Default empty, needs to be set in price list
                active: newItem.active || 'Y'
            });
        });

        // 3. Apply Price List edits
        const priceLocalStr = localStorage.getItem('masters_price_local');
        if (priceLocalStr) {
            const priceLocal = JSON.parse(priceLocalStr);
            unifiedItems = unifiedItems.map(item => {
                const priceOverride = priceLocal.find(p => p.id === item.id);
                if (priceOverride && priceOverride.mrp) {
                    return { ...item, mrp: Number(priceOverride.mrp) };
                }
                return item;
            });
        }
    } catch (e) {
        console.error("Failed to parse unified catalog overrides", e);
    }

    return unifiedItems;
};
