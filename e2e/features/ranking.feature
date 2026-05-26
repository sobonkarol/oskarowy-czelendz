Feature: Ranking page

  Scenario: Ranking page displays both leaderboards
    Given I am logged in and on "/ranking"
    Then I can see the text "Ranking"
    And I can see the section "Ranking użytkowników"
    And I can see the section "Top filmy"

  Scenario: Logged-in user is highlighted in the ranking
    Given I am logged in and on "/ranking"
    Then I can see my user highlighted

  Scenario: User ranking shows rating counts
    Given I am logged in and on "/ranking"
    Then I can see the text "ocenionych"

  Scenario: Film ranking shows vote counts
    Given I am logged in and on "/ranking"
    Then I can see the text "głosów"
