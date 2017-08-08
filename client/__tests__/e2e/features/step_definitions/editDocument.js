import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';
import checkDoc from '../../helper';

defineSupportCode(({ Then, When, defineStep }) => {
  const And = defineStep;

  And(/^I click on the edit document icon$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      const selector = response.value;
      if (selector) {
        const editIconSelector = selector.toString().replace('access', 'edit');
        client.click(`${editIconSelector} i:first-of-type`)
        .pause(3000);
      }
    });
  });

  Then(/^I should edit the document on the createdocument page$/, async () => {
    await client.waitForElementVisible('.mainHeader', 5000);
  });

  And(/^I double click on the delete document icon$/, async () => {
    await client.execute(checkDoc, [], (response) => {
      let selector = response.value;
      if (selector) {
        selector = selector.toString();
        const deleteIconSelector = selector.replace('access', '');
        const deleteBtnSelector = selector.replace('access', 'delete');
        console.log('.........', deleteIconSelector);
        client.pause(3000)
        .click(deleteBtnSelector)
        .doubleClick()
        .click(`${deleteBtnSelector} i:first-of-type`)
        .doubleClick()
        .pause(3000);
      }
    });
  });
});
