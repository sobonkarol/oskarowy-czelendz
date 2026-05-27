Feature: Profile settings

  Scenario: Profile page shows user information and sections
    Given I am logged in and on "/profile"
    Then I can see the text "Ustawienia profilu"
    And I can see the text "Awatar"
    And I can see the text "Zmień hasło"

  Scenario: User can select and save an avatar
    Given I am logged in and on "/profile"
    When I click the first avatar option
    And I click the save avatar button
    Then I can see the text "Zapisano"

  Scenario: Password change fails with wrong current password
    Given I am logged in and on "/profile"
    When I fill in the password form with current "WrongPassword!" new "NewPassword123!" confirm "NewPassword123!"
    And I click the change password button
    Then I can see an error message containing "Nieprawidłowe"

  Scenario: Password change fails when passwords do not match
    Given I am logged in and on "/profile"
    When I fill in the password form with current "Playwright123!" new "NewPassword123!" confirm "DifferentPass!"
    And I click the change password button
    Then I can see an error message containing "identyczne"

  Scenario: Password change fails when new password is too short
    Given I am logged in and on "/profile"
    When I fill in the password form with current "Playwright123!" new "abc" confirm "abc"
    And I click the change password button
    Then I can see an error message containing "6"

  Scenario: Password change succeeds with valid data
    Given I am logged in and on "/profile"
    When I fill in the password form with current "Playwright123!" new "Playwright456!" confirm "Playwright456!"
    And I click the change password button
    Then I can see the text "Hasło zostało zmienione"
