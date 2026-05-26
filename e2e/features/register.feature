Feature: User registration

  Scenario: Successful registration with valid data
    Given I navigate to "/register"
    When I fill in the registration form with valid data
    And I click the submit button
    Then I am on page "/login"

  Scenario: Registration fails with password shorter than 6 characters
    Given I navigate to "/register"
    When I fill in "Jan" with "Jan"
    And I fill in "Kowalski" with "Kowalski"
    And I fill in "ty@example.com" with "short-pw@example.com"
    And I fill in "Min. 6 znaków" with "abc"
    And I click the submit button
    Then I can see an error message containing "6"

  Scenario: Registration fails with invalid email format
    Given I navigate to "/register"
    When I fill in "Jan" with "Jan"
    And I fill in "Kowalski" with "Kowalski"
    And I fill in "ty@example.com" with "test@nodot"
    And I fill in "Min. 6 znaków" with "Valid123!"
    And I click the submit button
    Then I can see an error message

  Scenario: Registration fails when email is already taken
    Given I navigate to "/register"
    When I fill in the registration form with the existing email
    And I click the submit button
    Then I can see an error message containing "zajęty"

  Scenario: Login link is visible on the register page
    Given I navigate to "/register"
    Then I can see a link "Zaloguj się"
