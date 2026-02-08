const { paginate, getPaginationMetadata, getSortClause } = require('../src/utils/pagination');
const { convertToCSV } = require('../src/utils/csv');

describe('Pagination Utils', () => {
    test('paginate returns correct clause and values', () => {
        const params = [1, 2];
        const result = paginate('SELECT *', params, { page: 2, limit: 10 });

        expect(result.clause).toBe(' LIMIT $3 OFFSET $4');
        expect(result.limit).toBe(10);
        expect(result.offset).toBe(10);
    });

    test('getPaginationMetadata calculates correctly', () => {
        const meta = getPaginationMetadata(100, 2, 20);
        expect(meta.total).toBe(100);
        expect(meta.page).toBe(2);
        expect(meta.limit).toBe(20);
        expect(meta.totalPages).toBe(5);
        expect(meta.hasNext).toBe(true);
        expect(meta.hasPrev).toBe(true);
    });

    test('getSortClause validates fields', () => {
        const clause = getSortClause({ sort: 'name', order: 'ASC', allowedFields: ['name'], defaultSort: 'id' });
        expect(clause).toBe(' ORDER BY name ASC');

        const invalidClause = getSortClause({ sort: 'hacked', order: 'ASC', allowedFields: ['name'], defaultSort: 'id' });
        expect(invalidClause).toBe(' ORDER BY id ASC');
    });
});

describe('CSV Utils', () => {
    test('convertToCSV formats correctly', () => {
        const data = [{ id: 1, name: 'Test' }];
        const fields = ['id', 'name'];
        const csv = convertToCSV(data, fields);

        expect(csv).toContain('id,name');
        expect(csv).toContain('"1","Test"');
    });

    test('convertToCSV handles nulls and quotes', () => {
        const data = [{ id: 1, name: 'Test "Quote"' }];
        const fields = ['id', 'name'];
        const csv = convertToCSV(data, fields);

        expect(csv).toContain('"Test ""Quote"""');
    });
});
