# features/authentication.feature
 
Feature: User authentication
 
Scenario: Signup, Login
 
  Given I open Document Hub home page
  And I click on the "signin" tab
  When I enter valid value for every field in the "signin" form
  Then the "signin" button should be enabled
  When I click the "signin" button
  Then I should be Logged in and redirected to the Dashboard page
  When I click the "createDocument" button
  And I fill the "create Document" form
  