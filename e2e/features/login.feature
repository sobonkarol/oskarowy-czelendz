Feature: User login

  Scenario: Successful login with valid credentials
    Given I navigate to "/login"
    When I log in as the test user
    Then I am on page "/dashboard"

  Scenario: Login fails with wrong password
    Given I navigate to "/login"
    When I fill in the email field with "playwright-e2e@test.local"
    And I fill in the login password field with "wrong-password"
    And I click the submit button
    Then I can see an error message containing "Nieprawidłowy"

  Scenario: Login fails with non-existent account
    Given I navigate to "/login"
    When I fill in the email field with "nobody@example.com"
    And I fill in the login password field with "secret123"
    And I click the submit button
    Then I can see an error message

  Scenario: Register link is visible on the login page
    Given I navigate to "/login"
    Then I can see a link "Zarejestruj się"
