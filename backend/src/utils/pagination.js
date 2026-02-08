const paginate = (query, params, { page = 1, limit = 20 }) => {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 20;
    const offset = (p - 1) * l;

    // Return the pagination clause and values to append to params
    return {
        clause: ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        limit: l > 100 ? 100 : l, // Max limit 100
        offset
    };
};

const getPaginationMetadata = (total, page, limit) => {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 20;
    const totalCount = parseInt(total) || 0;

    return {
        total: totalCount,
        page: p,
        limit: l,
        totalPages: Math.ceil(totalCount / l),
        hasNext: p * l < totalCount,
        hasPrev: p > 1
    };
};

const getSortClause = ({ sort, order, allowedFields = [], defaultSort = 'created_at', defaultOrder = 'DESC' }) => {
    const s = allowedFields.includes(sort) ? sort : defaultSort;
    const o = (order && order.toUpperCase() === 'ASC') ? 'ASC' : (order && order.toUpperCase() === 'DESC') ? 'DESC' : defaultOrder;

    return ` ORDER BY ${s} ${o}`;
};

module.exports = {
    paginate,
    getPaginationMetadata,
    getSortClause
};
