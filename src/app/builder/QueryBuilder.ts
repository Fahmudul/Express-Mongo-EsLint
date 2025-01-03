import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
    console.log(query);
  }

  // Searching
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      console.log('from linw 16', searchTerm);
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  // Filter
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['page', 'sort', 'fields', 'limit', 'searchTerm'];
    excludeFields.forEach((elem) => delete queryObj[elem]);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  // Sorting
  sort() {
    const sortedQuery = this?.query?.sort
      ? (this?.query?.sort as string).split(',').join(' ')
      : '-createdAt';
    this.modelQuery = this.modelQuery.sort(sortedQuery);
    return this;
  }

  // Pagination
  paginate() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1; // Default to page 1
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // selected fields
  select() {
    const selectedFields = this?.query?.fields
      ? (this?.query?.fields as string).split(',').join(' ')
      : '-__v';
    this.modelQuery = this.modelQuery.select(selectedFields);
    // console.log(this.modelQuery);
    return this;
  }
}

export default QueryBuilder;
