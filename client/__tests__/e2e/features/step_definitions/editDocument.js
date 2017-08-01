import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';
import checkDoc from '../../helper';

defineSupportCode(({ Then, When, defineStep }) => {
  const And = defineStep;

  When(/^I click on the edit document icon$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
        client.click('#documentDashboard  i:nth-of-type(6)')
        .pause(11000);
      }
    });
  });

  Then(/^I should edit the document on the createdocument page$/, async () => {
    await client.waitForElementVisible('.mainHeader', 5000);
  });
});

