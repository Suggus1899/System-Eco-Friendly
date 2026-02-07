# Contributing to EcoGestión Local

Thank you for your interest in contributing to EcoGestión Local! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on constructive feedback
- Help maintain a positive community

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Suggus1899/System-Eco-Friendly/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check existing issues and discussions
2. Create an issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Mockups or examples if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding style guide
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   # Backend
   cd packages/backend
   npm test

   # Admin Panel
   cd packages/admin-panel
   npm test

   # Mobile
   cd packages/mobile
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add feature: description of your feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots for UI changes

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

## Coding Standards

### JavaScript/Node.js

- Use ES6+ features
- Use `const` and `let`, not `var`
- Use async/await over callbacks
- Add JSDoc comments for functions
- Keep functions small and focused

Example:
```javascript
/**
 * Creates a new material in the database
 * @param {Object} materialData - The material data
 * @returns {Promise<Object>} The created material
 */
const createMaterial = async (materialData) => {
  // Implementation
};
```

### React/React Native

- Use functional components with hooks
- Use meaningful component names
- Keep components focused and reusable
- Add PropTypes or TypeScript types

Example:
```javascript
function MaterialCard({ material, onEdit, onDelete }) {
  return (
    <div className="material-card">
      {/* Component JSX */}
    </div>
  );
}
```

### File Organization

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen/page components
├── services/       # API and external services
├── utils/          # Helper functions
├── config/         # Configuration files
└── constants/      # Constants and enums
```

### Commit Messages

Follow conventional commits:

- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor function`
- `test: Add tests`
- `chore: Update dependencies`

### Testing

- Write unit tests for utilities and services
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for 80%+ code coverage

## Project Structure

### Backend

- `src/config/` - Configuration files
- `src/controllers/` - Request handlers
- `src/middleware/` - Express middleware
- `src/routes/` - Route definitions
- `src/models/` - Data models (if using ORM)
- `src/database/` - Database migrations
- `src/seeds/` - Seed data

### Admin Panel

- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/services/` - API services
- `src/utils/` - Helper functions

### Mobile

- `src/screens/` - Screen components
- `src/components/` - Reusable components
- `src/navigation/` - Navigation configuration
- `src/services/` - API services
- `src/utils/` - Helper functions

## Adding New Features

### Backend API Endpoint

1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Update API documentation
4. Add tests

### Admin Panel Page

1. Create page component in `src/pages/`
2. Add route in `App.js`
3. Create API service methods
4. Add navigation link

### Mobile Screen

1. Create screen in `src/screens/`
2. Add to navigator
3. Create API service methods
4. Test on iOS and Android

## Database Changes

1. Create migration script in `src/database/migrate.js`
2. Update seed data if needed
3. Test migration locally
4. Document the changes

## Documentation

- Update README.md for major changes
- Update API_DOCUMENTATION.md for API changes
- Add JSDoc comments to new functions
- Update DEPLOYMENT.md for deployment changes

## Review Process

1. All PRs require review
2. Address review comments
3. Ensure CI passes
4. Maintain code quality

## Questions?

- Open an issue for questions
- Join our community discussions
- Email: soporte@ecogestion.local

Thank you for contributing! 🌱♻️
