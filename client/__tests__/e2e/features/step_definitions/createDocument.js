import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';


defineSupportCode(({ Then, When, defineStep }) => {
  const And = defineStep;

  When(/^I fill the create Document form with incomplete values$/, async () => {
    await client.waitForElementVisible('#title', 5000)
      .setValue('#title', 'lo')
      .click('#publicLabel')
      .pause(1000)
      .keys(client.Keys.TAB)
      .click('#btnsubmit')
      .pause(1000)
      .click('#submitLabel')
      .pause(1000);
  });

  Then(/^I should recieve an error message$/, async () => {
    await client.assert.containsText('#message', 'Please')
    .pause(3000);
  });

  When(/^I enter valid values for every field$/, async () => {
    await client
    .clearValue('#title')
      .setValue('#title', 'This is a story of love')
      .pause(2000)
      .keys(client.Keys.TAB)
      .keys('t')
      .keys('h')
      .keys('i')
      .keys('s')
      .keys(client.Keys.SPACE)
      .keys('i')
      .keys('s')
      .keys(client.Keys.SPACE)
      .pause(3000)
      .keys('T')
      .keys('I')
      .keys('A')
      .keys('!')
    .pause(2000);
  });

  And(/^I click the submit button$/, async () => {
    await client.keys(client.Keys.TAB)
    .keys(client.Keys.TAB)
    .click('#btnsubmit')
    .pause(3000);
  });

  Then(/^I should recieve the text "([^"]*)"$/, async (text) => {
    await client.assert
    .containsText('#message', text)
    .pause(5000);
  });
});
