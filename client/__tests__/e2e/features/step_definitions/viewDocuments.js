import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';

/**
 * @summary check if documents were found
 * @param accessRight - document accessRight to look up
 * @return {any} - false for no doc or accessRight
 */
const checkDoc = (accessRight) => {
   // assert for either no document found or document(s) was found
  const noDocFound = document.getElementById('noDoc');
  if (noDocFound) {
    console.log('no doc found', noDocFound);
    return false;
  } 
  // check if there rows
  const documentTable =document.getElementById("tbDocuments");
  console.log('has table', documentTable);
  // get second row, skip first row for header
  const firstDoc = documentTable.rows[1];
  const firstDocAccessibility = firstDoc.cells[3].id;
  return `#${firstDocAccessibility}`;
}


defineSupportCode(({ Given, Then, When, defineStep }) => {
  const And = defineStep;

  When(/^I click on the "([^"]*)" tab on the dashboard$/, async (tab) => {
    const tabSelector = `#${tab}`;
    await client.waitForElementVisible(tabSelector, 1000)
      .click(tabSelector)
      .pause(5000);
  });

  Then(/^I should view "([^"]*)" documents$/, async (accessRight) => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
         // my document, check if documents exist
         client.assert.visible(selector)
          .pause(1000);
      } else {
        client.assert.containsText('#noDoc', 'No document found')
          .pause(1000);
      }
    });
  });

  When(/^I click on a page$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
         // my document, check if documents exist
         client.click('.next a:first-of-type');
      }
    });
  });

  Then(/^I should view document on that page$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
         // my document, check if documents exist
         client.assert.containsText('#tbDocuments','Title')
          .pause(1000)
      }
    });
  });

  When(/^I enter a text on the search box$/, async () => {
    await client.setValue('#searchHint','e')
      .pause(1000);
  });

  Then(/^I should view documents with the hint that I entered$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
         // my document, check if documents exist
         client.assert.containsText('#tbDocuments','Title')
          .pause(1000)
      }
    });
  });

  When(/^I click the view document icon$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
         client.click('#documentDashboard  i:first-of-type');
      }
    });
  });

  Then(/^I should be view the document on the document page$/, async () => {
    await client.waitForElementVisible('#author', 5000)
      .assert.containsText('#author','Author');
  });
});

