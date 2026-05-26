Feature: Movie ratings

  Scenario: Adding a rating by clicking a star
    Given I am logged in and on "/movies/2026"
    When I remove all ratings for year 2026
    And I click star 7 for the first movie
    Then I can see the score "7/10" for the first movie

  Scenario: Editing an existing rating
    Given I am logged in and on "/movies/2026"
    When I remove all ratings for year 2026
    And I click star 5 for the first movie
    And I click star 9 for the first movie
    Then I can see the score "9/10" for the first movie

  Scenario: Deleting a rating
    Given I am logged in and on "/movies/2026"
    When I remove all ratings for year 2026
    And I click star 6 for the first movie
    And I click the delete rating button for the first movie
    Then I cannot see a score for the first movie

  Scenario: Rating persists after page reload
    Given I am logged in and on "/movies/2026"
    When I remove all ratings for year 2026
    And I click star 8 for the first movie
    And I reload the page
    Then I can see the score "8/10" for the first movie

  Scenario: Hovering over a star highlights stars up to that number
    Given I am logged in and on "/movies/2026"
    When I hover over star 5 for the first movie
    Then 5 stars are active for the first movie
