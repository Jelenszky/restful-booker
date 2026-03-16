# Prompt Documentation: AI vs Manual Approaches

This file documents, for each major feature, whether the solution was developed using AI (Copilot/MCP), manual coding, or a combination, along with the reasoning behind each choice.

---

## API Type Mapping

- **Approach:** Manual exploration and documentation analysis
- **Reasoning:** The API endpoints and data models were mapped out manually by analyzing the available API documentation and responses. TypeScript interfaces and types were then created to ensure type safety and accurate modeling of the API contract.

## Fixtures & Service Layer

- **Approach:** Both AI-assisted and manual
- **Reasoning:** The initial fixture and service layer structure was set up manually, but Copilot was used to refactor and consolidate services, and to enforce consistent patterns for instantiation and test isolation.

## Design Patterns and Principles

- **Approach:** Both AI-assisted and manual
- **Reasoning:** Factory (for test data and service creation) was applied. Service factory patterns was implemented manually based on best practices, while test data factory was implemented with AI assistance, integrating faker.js.

## Test Data Generation

- **Approach:** AI-assisted
- **Reasoning:** The use of a TestDataFactory and faker.js was inspired by best practices, but the specific implementation and method naming conventions were refined with Copilot's input for consistency and flexibility.

## BookingService Cleanup Pattern

- **Approach:** Manual
- **Reasoning:** The auto-tracking and cleanup pattern was developed manually to solve the problem of shared public API state and parallel test workers. The chosen solution is a resilient, worker-scoped cleanup method that avoids race conditions and boilerplate.

## Edge and Negative Case Handling

- **Approach:** AI-assisted brainstorming
- **Reasoning:** For negative scenarios (such as invalid tokens, malformed JSON, and other edge cases), AI was used to brainstorm a comprehensive set of test cases. These suggestions were compared with manual ideas and reviewed.

## Tooling Integration (faker.js, ESLint, Prettier, Husky, Allure)

- **Approach:** AI-assisted
- **Reasoning:** Integration of faker.js for dynamic booking data, as well as ESLint, Prettier, Husky for code quality and pre-commit checks and Allure reporting, was guided by Copilot. AI provided configuration suggestions and helped resolve setup issues efficiently.

## CI/CD Pipeline (GitHub Actions)

- **Approach:** Both AI-assisted and manual
- **Reasoning:** The base pipeline was set up manually based on of the GH actions pipelines I previously set up for a pet project, but Copilot was used to improve it.

---

**Reflection:**

- AI was most valuable for architectural refactoring, boilerplate reduction, and edge-case handling.
- Manual coding was preferred for initial project setup, domain-specific logic, and when precise control was needed.
