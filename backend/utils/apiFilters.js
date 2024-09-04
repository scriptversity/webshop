export default function APIFilters(query, queryStr) {
  this.query = query;
  this.queryStr = queryStr;
}

APIFilters.prototype.search = function () {
  let keyword = this.queryStr.keyword
    ? {
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      }
    : {};

  this.query = this.query.find(keyword);
  return this;
};

APIFilters.prototype.filters = function () {
  let queryCopy = Object.assign({}, this.queryStr);

  // Fields to remove
  let fieldsToRemove = ["keyword", "page"];
  fieldsToRemove.forEach(function (el) {
    delete queryCopy[el];
  });

  // Advance filter for price, ratings etc
  let queryStr = JSON.stringify(queryCopy);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
    return "$" + match;
  });

  this.query = this.query.find(JSON.parse(queryStr));
  return this;
};

APIFilters.prototype.pagination = function (resPerPage) {
  let currentPage = Number(this.queryStr.page) || 1;
  let skip = resPerPage * (currentPage - 1);

  this.query = this.query.limit(resPerPage).skip(skip);
  return this;
};

// Alternative implementation
// class APIFilters {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   search() {
//     const keyword = this.queryStr.keyword
//       ? {
//           name: {
//             $regex: this.queryStr.keyword,
//             $options: "i",
//           },
//         }
//       : {};

//     this.query = this.query.find({ ...keyword });
//     return this;
//   }

//   filters() {
//     const queryCopy = { ...this.queryStr };

//     // Fields to remove
//     const fieldsToRemove = ["keyword", "page"];
//     fieldsToRemove.forEach((el) => delete queryCopy[el]);

//     // Advance filter for price, ratings etc
//     let queryStr = JSON.stringify(queryCopy);
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

//     this.query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }

//   pagination(resPerPage) {
//     const currentPage = Number(this.queryStr.page) || 1;
//     const skip = resPerPage * (currentPage - 1);

//     this.query = this.query.limit(resPerPage).skip(skip);
//     return this;
//   }
// }

// export default APIFilters;
