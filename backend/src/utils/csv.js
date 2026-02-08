const convertToCSV = (data, fields) => {
    if (!data || data.length === 0) {
        return fields.join(',') + '\n';
    }

    const header = fields.join(',') + '\n';

    const rows = data.map(row => {
        return fields.map(field => {
            let val = row[field];

            // Handle null/undefined
            if (val === null || val === undefined) {
                val = '';
            }

            // Handle objects/arrays (stringify)
            if (typeof val === 'object') {
                val = JSON.stringify(val);
            }

            // Convert to string and escape double quotes
            val = String(val).replace(/"/g, '""');

            // Wrap in double quotes
            return `"${val}"`;
        }).join(',');
    }).join('\n');

    return header + rows;
};

module.exports = {
    convertToCSV
};
