import { client } from 'nightwatch-cucumber';
import { defineSupportCode } from 'cucumber';
import model from '../../../../../server/models/index';

// get existing role
const Role = model.role;
const User = model.user;
// create mock user
const user = {
  fname: 'Obinna',
  lname: 'Musa',
  mname: 'Bamidele',
  email: 'obi_musa_dele@gmail.com',
  password: 'smilesh2o!',
  roleID: 24
};

// get an avaliable role
Role.find({
  where: {
    title: {
      $notLike: '%admin'
    }
  },
  offset: 1,
  limit: 1,
  order: [['title', 'ASC']],
})
.then((roles) => {
  if (roles.length > 0) {
    user.roleID = roles.id;
    return user;
  }
});

// delete user account if it exist 
User.findOne({
  where: {
    email: user.email
  }
})
.then(founduser => {
  if(founduser) {
    founduser.destroy();
  }
});


defineSupportCode(({ Given, Then, When, defineStep }) => {
  const And = defineStep;

  And(/^I signup$/, async () => {
    await client.waitForElementVisible('#signuptab', 10000)
      .click('#signuptab')
    .clearValue('#roleId')
    .click('select[id="roleId"]')
      .pause(1000)
      .click('option[value="24"]')
      .pause(3000)
      .setValue('#roleId', user.roleID)
    .clearValue('#fname')
      .setValue('#fname', user.fname)
    .clearValue('#mname')
      .setValue('#mname', user.mname)
    .clearValue('#lname')
      .setValue('#lname', user.lname)
    .clearValue('#emailsignup')
      .setValue('#emailsignup', user.email)
    .clearValue('#passwordsignup')
      .setValue('#passwordsignup', user.password)
    .clearValue('#comfirmpassword')
      .setValue('#comfirmpassword', user.password)
    .click('#signupSubmit')
  });

  And(/^I click the createDocument navigation tab$/, async () => {
    await client.waitForElementVisible('#createDocument', 2000)
      .click('#createDocument');
  });

  When(/^I fill the create Document form with incomplete values$/, async () => {
    await client.waitForElementVisible('#title', 5000)
      .setValue('#title', 'lo')
      .click('#public')
      .click('#btnsubmit');
  });

  Then(/^I should recieve an error message$/, async () => {
    await client.assert
    .containsText('#message', 'Please');
  })

  When(/^I enter valid values for every field$/, async () => {
    await client
    .clearValue('#title')
      .setValue('#title', 'This is a story of love')
      .pause(2000)
    .click('.mce-i-code')
    .setValue('.mce-textbox', 'Love is possible, try it.')
    .click('.mce-floatpanel .mce-container-body button')
  });

  And(/^I click the submit button$/, async () => {
     await client.click('#btnsubmit')
  });

  Then(/^I should recieve the text "([^"]*)"$/, async (text) => {
    await client.assert
    .containsText('#message', text);
  })

});
