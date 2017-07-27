import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';
const user = {
  email: 'test@bot.com',
  password: 'smilesh2o!'
};

defineSupportCode(({ Given, Then, When, defineStep }) => {
  const And = defineStep;

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
