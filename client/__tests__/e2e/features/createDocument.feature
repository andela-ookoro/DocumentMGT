# features/authentication.feature
 
Feature: Manage Document
 
Scenario: create Document
 
  Given I open Document Hub home page
  And I signup
  Then I should be Logged in and redirected to the Dashboard page
  And I click the createDocument navigation tab
  When I fill the create Document form with incomplete values
  Then I should recieve an error message
  When I enter valid values for every field
  And I click the submit button
  Then I should recieve the text "Document has been updated successfully"
  Then I have gone through Document Hub "document creation" process successfully
  