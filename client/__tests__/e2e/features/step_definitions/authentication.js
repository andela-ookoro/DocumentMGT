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
.then((founduser) => {
  if (founduser) {
    founduser.destroy();
  }
});


defineSupportCode(({ Given, Then, When, defineStep }) => {
  const And = defineStep;
  Given(/^I open Document Hub home page$/, async () => {
    // maximize browser window
    await client.maximizeWindow()
    .url('http://localhost:1142')
      .execute(() => Object.assign({}, localStorage), [], () => {
      })
    .waitForElementVisible('body', 5000);
  });

  And(/^I click on the "([^"]*)" tab$/, async (form) => {
    await client.waitForElementVisible(`#${form}tab`, 5000)
    .click(`#${form}tab`);
  });

  // When(/^I click on the "([^"]*)" tab$/, async (form) => {
  //   await client.waitForElementVisible(`#${form}tab`, 3000)
  //   .click(`#${form}tab`);
  // });

  When(/^I fill the signup form with invalid values$/, async () => {
    await client.setValue('#fname', 'n')
    .setValue('#mname', '2')
    .setValue('#lname', '!')
    .setValue('#passwordsignup', 'hell')
    .setValue('#passwordsignup', 'hell@!')
    .setValue('#passwordsignup', user.password)
    .setValue('#comfirmpassword', user.password.substring(0, 2))
    .setValue('#comfirmpassword', user.password.substring(0, 5))
    .setValue('#emailsignup', user.email.substring(0, 5))
    .setValue('#emailsignup', user.email.substring(0, 12))
    .setValue('#emailsignup', user.email.substring(0, 15))
    .setValue('#roleId', user.roleID);
  });

  Then(/^I should recieve error message on the "([^"]*)" form$/,
   async (form) => {
     // for signup form only
     if (form === 'signup') {
       await client.assert
       .containsText('#fnameValidator', '2 to 30 alphabets only')
       .assert
        .containsText('#lnameValidator', '2 to 30 alphabets only')
       .assert
        .containsText('#mnameValidator', '2 to 30 alphabets only')
       .assert
        .containsText('#comfirmpasswordValidator', 'Password does not match')
       .assert
        .containsText('#emailValidatorsignup', 'input a valid email address');
     } else if (form === 'signin') {
       await client.assert
        .containsText('#passwordValidator', 'a number and a special character')
       .assert
        .containsText('#emailValidator', 'Please input a valid email address');
     }
   });

  And(/^the "([^"]*)" button should be disabled$/, async (form) => {
    const btnId = `#${form}Submit`;
    await client.assert.attributeEquals(btnId, 'disabled', 'true');
  });

  When(/^I enter valid value for every field in the "([^"]*)" form$/,
  async (form) => {
    // for signup form only
    if (form === 'signup') {
      await client.clearValue('#roleId')
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
        .setValue('#comfirmpassword', user.password);
    } else {
      await client.clearValue('#email')
      .setValue('#email', user.email)
      .clearValue('#password')
      .setValue('#password', user.password);
    }
  });

  Then(/^the "([^"]*)" button should be enabled$/, async (form) => {
    const btnId = `#${form}Submit`;
    await client.elementIdEnabled(btnId);
  });

  Then(/^I should be Logged in and redirected to the Dashboard page$/,
  async () => {
    await client.waitForElementVisible('.mainHeader', 5000)
    .assert.urlEquals('http://localhost:1142/#/dashboard')
    .pause(5000);
  });

  And(/^I should redirected to the "([^"]*)" page$/, async (link) => {
    let page = link;
    let lookupElement;
    if (page === 'authentication') {
      page = '';
      lookupElement = '#signup';
    } else {
      lookupElement = '.mainHeader';
    }
    await client.waitForElementVisible(lookupElement, 5000)
    .assert.urlEquals(`http://localhost:1142/#/${page}`);
  });

  And(/^a JWT Token and my profile should be store in the localStorage$/,
  async () => {
    // check localstorage
  });

  When(/^I click the "([^"]*)" button$/, async (form) => {
    let buttonid = `#${form}`;
    if (form === 'signin' || form === 'signup') {
      buttonid = `${buttonid}Submit`;
    }
    await client.click(buttonid);
  });

  And(/^the JWT Token and my profile should be removed from the localStorage$/,
  async () => {
    // check localstorage
  });

  And(/^I enter right values but with an existing email in the "([^"]*)" form$/,
  async (form) => {
    // wait to the authentiaction page to load fully
    await client.waitForElementVisible(`#${form}tab`, 5000)
    // reefresh the page to enable marerailize style
    .refresh()
    // click the tab
    .click(`#${form}tab`);
    // for signup form only
    if (form === 'signup') {
      await client.setValue('#fname', user.fname)
      .setValue('#mname', user.mname)
      .setValue('#lname', user.lname)
      .setValue('#comfirmpassword', user.password)
      .setValue('#emailsignup', user.email)
      .setValue('#passwordsignup', user.password)
      .clearValue('#roleId')
      .click('select[id="roleId"]')
        .pause(1000)
        .click('option[value="24"]')
        .pause(3000);
    } else {
      await client.setValue('#email', user.email)
      .setValue('#password', user.password);
    }
    const submitButtonID = `#${form}Submit`;
    await client.click(submitButtonID);
  });

  Then(/^I should recieve a message that "([^"]*)"$/, async (message) => {
    await client.setValue('#errorMessageSignup', message);
  });

  And(/^I enter invalid input in the signin form$/, async () => {
    await client.setValue('#password', 'hell@!')
    .setValue('#email', user.email.substring(0, 15));
  });

  Then(/^I have gone through Document Hub "([^"]*)" process successfully$/,
  async (feature) => {
    // delete user from database
    if (feature === 'authentication') {
      User.findOne({
        where: {
          email: user.email
        }
      })
      .then(founduser => founduser.destroy());
    }

    // close the browser windows
    await client.closeWindow();
    await client.end();
  });
});
