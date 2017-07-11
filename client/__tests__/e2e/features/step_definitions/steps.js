import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';

require('babel-polyfill');

defineSupportCode(({ Given, Then, When }) => {
  Given(/^I open Google's search page$/, async () => {
    await client.url('http://google.com');
    await client.waitForElementVisible('body', 50000);
  });

  Then(/^the title is "([^"]*)"$/, async (title) => {
    await client.assert.title(title);
  });

  Then(/^the Google search form exists$/, async () => {
    await client.assert.visible('input[name="q"]');
  });
});
