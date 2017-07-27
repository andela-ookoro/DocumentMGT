# features/authentication.feature
 
Feature: User authentication
 
Scenario: Signup, Login
 
  Given I open Document Hub home page
  And I click on the "signup" tab
  When I fill the signup form with invalid values
  Then I should recieve error message on the "signup" form
  And the "signup" button should be disabled
  When I enter valid value for every field in the "signup" form
  Then the "signup" button should be enabled
  When I click the "signup" button
  Then I should be Logged in and redirected to the Dashboard page
  And a JWT Token and my profile should be store in the localStorage
  When I click the "signout" button
  Then I should be redirected to the "authentication" page
  And the JWT Token and my profile should be removed from the localStorage
  When I click on the "signup" tab
  And I enter right values but with an existing email in the "signup" form
  Then I should recieve a message that "Email already exist"
  When I click on the "signin" tab
  And I enter invalid input in the signin form
  Then I should recieve error message on the "signin" form
  And the "signin" button should be disabled
  When I enter valid value for every field in the "signin" form
  Then the "signin" button should be enabled
  When I click the "signin" button
  Then I should be Logged in and redirected to the Dashboard page
  And a JWT Token and my profile should be store in the localStorage
  Then I have gone through Document Hub "authentication" process successfully

  