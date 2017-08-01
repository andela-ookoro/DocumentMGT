/**
 * @summary check if documents were found
 * @return {any} - false for no doc or accessRight
 */
const checkDoc = () => {
  // assert for either no document found or document(s) was found
  const noDocFound = document.getElementById('noDoc');
  if (noDocFound) {
    return false;
  }
  // check if there rows
  const documentTable = document.getElementById('tbDocuments');
  // get second row, skip first row for header
  const firstDoc = documentTable.rows[1];
  const firstDocAccessibility = firstDoc.cells[3].id;
  return `#${firstDocAccessibility}`;
};

export default checkDoc;
