function isValid(req, res, next) {
    const data = req.body;

    if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const validKeysAndTypes = {
        id: 'number',
        done: 'boolean',
        text: 'string',
        userId: 'number'
    };

    // Verifica se tutte le chiavi nell'oggetto sono chiavi valide
    for (const key in data) {
        if (!validKeysAndTypes.hasOwnProperty(key)) {
            return res.status(400).json({ error: `Invalid key: ${key}` });
        }

        if (typeof data[key] !== validKeysAndTypes[key]) {
            return res.status(400).json({ error: `Invalid data type for key ${key}` });
        }
    }

    next();
}

module.exports = isValid