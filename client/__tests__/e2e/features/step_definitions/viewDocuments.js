import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';
import checkDoc from '../../helper';

defineSupportCode(({ Then, When, defineStep }) => {
  const And = defineStep;

  When(/^I click on the "([^"]*)" tab on the dashboard$/, async (tab) => {
    const tabSelector = `#${tab}`;
    await client.waitForElementVisible(tabSelector, 1000)
      .click(tabSelector)
      .pause(3000);
  });

  Then(/^I should view "([^"]*)" documents$/, async (accessRight) => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
         // my document, check if documents exist
        client.assert.visible(selector)
         .pause(3000);
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
        client.assert.containsText('#tbDocuments', 'Title')
          .pause(1000);
      }
    });
  });

  When(/^I enter a text on the search box$/, async () => {
    await client.setValue('#searchText', 'e')
      .pause(1000);
  });

  Then(/^I should view documents with the hint that I entered$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
         // my document, check if documents exist
        client.assert.containsText('#tbDocuments','Title')
          .pause(1000);
      }
    });
  });

  When(/^I click on the view document icon$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
        client.click('#documentDashboard  i:first-of-type');
      }
    });
  });

  Then(/^I should view the document on the document page$/, async () => {
    await client.waitForElementVisible('#author', 5000)
      .assert.containsText('#author', 'Author');
  });
});

