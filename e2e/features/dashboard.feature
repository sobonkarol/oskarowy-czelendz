Feature: Dashboard

  Scenario: Dashboard displays progress stats and year cards
    Given I am logged in and on "/dashboard"
    Then I can see the text "Oskarowy Czelendż"
    And I can see progress stats
    And I can see year cards

  Scenario: Dashboard has cards for more than 90 ceremony years
    Given I am logged in and on "/dashboard"
    Then the number of year cards is greater than 90

  Scenario: Dashboard shows cards for the first and latest ceremony
    Given I am logged in and on "/dashboard"
    Then I can see a year card for "2026"
    And I can see a year card for "1929"

  Scenario: Clicking a year card navigates to the movies page
    Given I am logged in and on "/dashboard"
    When I click the year card for "2026"
    Then I am on page "/movies/2026"

  Scenario: Dashboard stats show the total number of films
    Given I am logged in and on "/dashboard"
    Then I can see the text "621"
