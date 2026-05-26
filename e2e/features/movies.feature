Feature: Movies page

  Scenario: Movies page shows nominees for a ceremony year
    Given I am logged in and on "/movies/2026"
    Then I can see the text "2026"
    And I can see at least 5 movie cards
    And I can see the trophy icon on the winner

  Scenario: Movies page contains star rating widgets
    Given I am logged in and on "/movies/2026"
    Then I can see star ratings

  Scenario: Movies page has a back link to the dashboard
    Given I am logged in and on "/movies/2026"
    Then I can see a back link

  Scenario: Non-existent year shows a 404 error page
    Given I am logged in and on "/movies/9999"
    Then I can see a 404 error page

  Scenario: The 1929 ceremony has exactly 3 nominated films
    Given I am logged in and on "/movies/1929"
    Then I can see exactly 3 movie cards
