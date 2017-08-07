import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';

const user = {
  email: 'test@bot.com',
  password: 'smilesh2o!'
};

defineSupportCode(({ Then, defineStep }) => {
  const And = defineStep;
  Then(/^I should be redirected to the "([^"]*)" page$/, async (link) => {
    let page = link;
    let lookupElement;
    if (page === 'authentication') {
      page = '';
      lookupElement = '#signuptab';
    } else {
      lookupElement = '.mainHeader';
    }
    await client.waitForElementVisible(lookupElement, 5000)
    .assert.urlEquals(`http://localhost:1142/#/${page}`);
  });

  And(/^I login$/, async () => {
    await client.clearValue('#email')
      .setValue('#email', user.email)
      .clearValue('#password')
      .setValue('#password', user.password)
      .pause(1000)
      .click('#signinSubmit');
  });

  And(/^I click the "([^"]*)" navigation tab$/, async (tab) => {
    const navBar = `#${tab}`;
    await client.waitForElementVisible(navBar, 2000)
      .click(navBar);
  });

//  When(/^I click the "([^"]*)" navigation tab$/, async (tab) => {
//    await client.waitForElementVisible(`#${tab}`, 2000)
//       .click('#createDocument');
//  });
});
