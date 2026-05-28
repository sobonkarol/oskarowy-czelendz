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

  Scenario: Clicking a film opens the ratings popup
    Given I am logged in and on "/movies/2025"
    When I rate the first unrated film with score 8
    And I navigate to "/ranking"
    And I click the first film in the ranking
    Then I can see the ratings popup
    And I can see the text "ocen"

  Scenario: Ratings popup shows user scores
    Given I am logged in and on "/movies/2025"
    When I rate the first unrated film with score 9
    And I navigate to "/ranking"
    And I click the first film in the ranking
    Then I can see the ratings popup
    And I can see the score "9" in the popup

  Scenario: Ratings popup can be closed with the X button
    Given I am logged in and on "/movies/2025"
    When I rate the first unrated film with score 7
    And I navigate to "/ranking"
    And I click the first film in the ranking
    Then I can see the ratings popup
    When I close the ratings popup
    Then the ratings popup is closed
