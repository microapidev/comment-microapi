exports.paginateDeleted = async (Model, findFilter, query, limit, page) => {
  let currentPage,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    pageRecordCount,
    totalRecords,
    documents;

  //get total documents in collection
  if (findFilter === "unDeleted") {
    totalRecords = await Model.countDocuments(query);
  } else if (findFilter === "deleted") {
    totalRecords = await Model.countDocumentsDeleted(query);
  } else if (findFilter === "all") {
    totalRecords = await Model.countDocumentsWithDeleted(query);
  } else {
    //throw an error here
    throw new Error("Invalid 'findFilter' specified");
  }

  //divide total by limit(round up) to get number of pages
  totalPages = Math.ceil(totalRecords / limit);

  //if requested page is greater than last page return last page with
  currentPage = page;

  hasNext = true;
  hasPrev = true;
  nextPage = page + 1;
  prevPage = page - 1;

  if (page >= totalPages) {
    currentPage = totalPages;
    hasNext = false;
    nextPage = null;
  }

  if (page <= 1) {
    page = 1;
    hasPrev = false;
    prevPage = null;
  }

  const skipCount = limit * (currentPage - 1);

  //skip (limit * page - 1) records and get limit records
  let result;
  if (findFilter === "unDeleted") {
    result = await Model.find(query).skip(skipCount).limit(limit);
  } else if (findFilter === "deleted") {
    result = await Model.findDeleted(query).skip(skipCount).limit(limit);
  } else if (findFilter === "all") {
    result = await Model.findWithDeleted(query).skip(skipCount).limit(limit);
  }

  pageRecordCount = result.length;
  documents = result;

  return {
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    pageRecordCount,
    totalRecords,
    documents,
  };
};
