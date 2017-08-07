# features/viewDocument.feature
 
Feature: Manage Document
Scenario: view Document
  Given I open Document Hub home page
  And I login
  When I click the "dashboard" navigation tab
  When I click on the "myDocument" tab on the dashboard
  Then I should view "my" documents
  When I click on the "public" tab on the dashboard
  Then I should view "public" documents
  When I click on the "private" tab on the dashboard
  Then I should view "private" documents
  When I click on the "role" tab on the dashboard
  Then I should view "role" documents
  When I click on a page
  Then I should view document on that page
  When I enter a text on the search box
  Then I should view documents with the hint that I entered
  When I click on the view document icon
  Then I should view the document on the document page

Scenario: edit Document
  When I click the "dashboard" navigation tab
  And I click on the edit document icon
  Then I should edit the document on the createdocument page
  When I enter valid values for every field
  And I click the submit button
  Then I should recieve the text "Document has been updated successfully"



  Then I have gone through Document Hub "view document" process successfully