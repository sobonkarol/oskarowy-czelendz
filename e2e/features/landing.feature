Feature: Landing page

  @unauthenticated
  Scenario: Landing page displays app title and call-to-action links
    Given I am on the home page
    Then I can see the text "Oskarowy Czelendż"
    And I can see a link "Mam już konto"
    And I can see a link "Rozpocznij czelendż"

  @unauthenticated
  Scenario: Unauthenticated user is redirected from dashboard to login
    Given I navigate to "/dashboard"
    Then I am on page "/login"

  @unauthenticated
  Scenario: Unauthenticated user is redirected from ranking to login
    Given I navigate to "/ranking"
    Then I am on page "/login"
