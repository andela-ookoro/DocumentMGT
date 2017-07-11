// import { client } from 'nightwatch-cucumber';
// import { defineSupportCode } from 'cucumber';

// require('babel-polyfill');

// defineSupportCode(({ Given, Then, When, And }) => {
//   Given(/^ Given I Open to the Document signup page$/, async () => {
//     await client.url('http://localhost:1142');
//     await client.waitForElementVisible('body', 1000);
//   });

//   And(/^I click the Signup tab"$/, async (title) => {
//     let el = element(by.css('[value="add"]'));
//     el.click();
//     await client.assert.title(title);
//   });

//   And(/^I fill the Signup form"$/, async (title) => {
//     await client.assert.title(title);
//   });

//   Then(/^I should redirected to the "dashboard" page$/, async () => {
//     await client.assert.visible('input[name="q"]');
//   });
// });
