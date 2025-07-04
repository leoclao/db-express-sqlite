import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export class QueryBuilder {
  static applyPagination<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    page: number,
    limit: number
  ): SelectQueryBuilder<T> {
    const offset = (page - 1) * limit;
    return query.skip(offset).take(limit);
  }

  static applySorting<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): SelectQueryBuilder<T> {
    return query.orderBy(`entity.${sortBy}`, sortOrder);
  }

  static applyFilters<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    filters: Record<string, any>
  ): SelectQueryBuilder<T> {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string') {
          query.andWhere(`entity.${key} LIKE :${key}`, { [key]: `%${value}%` });
        } else {
          query.andWhere(`entity.${key} = :${key}`, { [key]: value });
        }
      }
    });

    return query;
  }

  static applySearch<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    searchTerm: string,
    searchFields: string[]
  ): SelectQueryBuilder<T> {
    if (!searchTerm || searchFields.length === 0) {
      return query;
    }

    const conditions = searchFields.map(field => `entity.${field} LIKE :search`).join(' OR ');
    query.andWhere(`(${conditions})`, { search: `%${searchTerm}%` });

    return query;
  }
}